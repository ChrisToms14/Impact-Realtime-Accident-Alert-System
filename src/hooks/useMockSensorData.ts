import { useState, useEffect } from 'react';
import { SensorData, ImpactLog } from '../types/sensor';

const generateRandomData = (): SensorData => {
  const rand = Math.random();
  let classification: 'A' | 'B' | 'C' | 'D' | 'E';
  let accel: number;
  let gyro: number;
  let sound: number;

  if (rand < 0.7) {
    classification = 'A';
    accel = 0.5 + Math.random() * 0.5;
    gyro = 10 + Math.random() * 20;
    sound = 300 + Math.random() * 200;
  } else if (rand < 0.85) {
    classification = 'B';
    accel = 1.2 + Math.random() * 0.8;
    gyro = 40 + Math.random() * 40;
    sound = 550 + Math.random() * 150;
  } else if (rand < 0.93) {
    classification = 'C';
    accel = 2.1 + Math.random() * 0.9;
    gyro = 90 + Math.random() * 50;
    sound = 720 + Math.random() * 150;
  } else if (rand < 0.97) {
    classification = 'D';
    accel = 3.2 + Math.random() * 1.3;
    gyro = 150 + Math.random() * 80;
    sound = 900 + Math.random() * 150;
  } else {
    classification = 'E';
    accel = 5.0 + Math.random() * 2.0;
    gyro = 250 + Math.random() * 100;
    sound = 1100 + Math.random() * 200;
  }

  const pressure = 1008 + (Math.random() - 0.5) * 4;
  const sfi = accel * 0.4 + (gyro / 200) * 0.3 + (sound / 1000) * 0.3;

  return {
    accel: parseFloat(accel.toFixed(2)),
    gyro: parseFloat(gyro.toFixed(1)),
    pressure: parseFloat(pressure.toFixed(2)),
    sound: Math.round(sound),
    sfi: parseFloat(sfi.toFixed(2)),
    class: classification,
    timestamp: new Date().toISOString(),
  };
};

export const useMockSensorData = (interval = 2000) => {
  const [data, setData] = useState<SensorData>(generateRandomData());
  const [logs, setLogs] = useState<ImpactLog[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newData = generateRandomData();
      setData(newData);

      if (newData.class >= 'B') {
        const newLog: ImpactLog = {
          timestamp: newData.timestamp,
          sfi: newData.sfi,
          class: newData.class,
          status: newData.class >= 'D' ? 'Critical' : newData.class === 'C' ? 'Alert' : 'Normal',
        };
        setLogs((prev) => [newLog, ...prev].slice(0, 50));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { data, logs };
};
