import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import { SensorData, ImpactLog } from '../types/sensor';

// Map Firebase data to our application's data structure
const mapFirebaseDataToSensorData = (firebaseData: any): SensorData => {
  // Map impactLevel to class format (A, B, C, D, E)
  const classMapping: { [key: string]: 'A' | 'B' | 'C' | 'D' | 'E' } = {
    'A': 'A',
    'B': 'B',
    'C': 'C',
    'D': 'D',
    'E': 'E'
  };

  return {
    accel: firebaseData.accel || 0,
    gyro: firebaseData.gyro || 0,
    pressure: firebaseData.pressure || 0,
    sound: firebaseData.sound || 0,
    sfi: firebaseData.sfi || 0,
    class: classMapping[firebaseData.impactLevel] || 'A',
    timestamp: new Date().toISOString(),
  };
};

export const useFirebaseSensorData = () => {
  const [data, setData] = useState<SensorData>({
    accel: 0,
    gyro: 0,
    pressure: 0,
    sound: 0,
    sfi: 0,
    class: 'A',
    timestamp: new Date().toISOString(),
  });
  
  const [logs, setLogs] = useState<ImpactLog[]>([]);

  useEffect(() => {
    const dataRef = ref(db, '/impactModule/latest');
    
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        const mappedData = mapFirebaseDataToSensorData(firebaseData);
        setData(mappedData);
        
        // Add to logs if impact level is B or higher
        if (mappedData.class >= 'B') {
          const newLog: ImpactLog = {
            timestamp: mappedData.timestamp,
            sfi: mappedData.sfi,
            class: mappedData.class,
            status: mappedData.class >= 'D' ? 'Critical' : mappedData.class === 'C' ? 'Alert' : 'Normal',
          };
          setLogs((prev) => [newLog, ...prev].slice(0, 50));
        }
      }
    });
    
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return { data, logs };
};