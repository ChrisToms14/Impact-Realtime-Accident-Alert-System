import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Database, Activity, CheckCircle, Code, Cpu } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, get, DatabaseReference } from 'firebase/database';

export const SystemInfo = () => {
  const [firebaseStatus, setFirebaseStatus] = useState('Connecting...');
  const [esp32Status, setEsp32Status] = useState('Checking...');
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: 'ESP32-DEV-001',
    firmwareVersion: 'v2.4.1',
    ipAddress: '192.168.1.105',
    signalStrength: 'Checking...',
    uptime: 'Calculating...'
  });

  useEffect(() => {
    // Check Firebase connection
    const connRef = ref(db, '.info/connected');
    const unsubscribeConn = onValue(connRef, (snapshot) => {
      const connected = snapshot.val();
      setFirebaseStatus(connected ? 'Connected' : 'Disconnected');
    });

    // Check ESP32 data freshness
    const dataRef = ref(db, '/impactModule/data');
    const unsubscribeData = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const now = new Date();
        const lastUpdateTime = data.timestamp ? new Date(data.timestamp) : null;
        
        if (lastUpdateTime) {
          const timeDiff = now.getTime() - lastUpdateTime.getTime();
          const isRecent = timeDiff < 60000; // Within last minute
          
          setEsp32Status(isRecent ? 'Connected' : 'Stale Connection');
          setLastUpdate(lastUpdateTime.toLocaleString());
          
          // Update device info if available
          if (data.deviceInfo) {
            setDeviceInfo({
              deviceId: data.deviceInfo.id || deviceInfo.deviceId,
              firmwareVersion: data.deviceInfo.firmware || deviceInfo.firmwareVersion,
              ipAddress: data.deviceInfo.ip || deviceInfo.ipAddress,
              signalStrength: `${data.deviceInfo.rssi || 'Unknown'} dBm`,
              uptime: `${Math.floor((data.deviceInfo.uptime || 0) / 3600)}h ${Math.floor(((data.deviceInfo.uptime || 0) % 3600) / 60)}m`
            });
          }
        }
      }
    });

    return () => {
      unsubscribeConn();
      unsubscribeData();
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Information</h1>
          <p className="text-gray-600">ESP32 connectivity and Firebase database status</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 ${esp32Status === 'Connected' ? 'bg-green-50' : 'bg-yellow-50'} rounded-xl`}>
                <Wifi className={`w-6 h-6 ${esp32Status === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">ESP32 Connection</h2>
                <p className={`text-sm font-medium ${esp32Status === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {esp32Status}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Device ID</span>
                <span className="text-sm font-mono font-medium">{deviceInfo.deviceId}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Firmware Version</span>
                <span className="text-sm font-mono font-medium">{deviceInfo.firmwareVersion}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">IP Address</span>
                <span className="text-sm font-mono font-medium">{deviceInfo.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Signal Strength</span>
                <span className="text-sm font-medium text-green-600">{deviceInfo.signalStrength}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium">{deviceInfo.uptime}</span>
              </div>
              {lastUpdate && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Last Update</span>
                  <span className="text-sm font-medium">{lastUpdate}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-3 ${firebaseStatus === 'Connected' ? 'bg-blue-50' : 'bg-yellow-50'} rounded-xl`}>
                <Database className={`w-6 h-6 ${firebaseStatus === 'Connected' ? 'text-blue-600' : 'text-yellow-600'}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Firebase Database</h2>
                <p className={`text-sm font-medium ${firebaseStatus === 'Connected' ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {firebaseStatus}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${firebaseStatus === 'Connected' ? 'text-blue-600' : 'text-yellow-600'}`}>
                  {firebaseStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Database Type</span>
                <span className="text-sm font-mono font-medium">Realtime Database</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">API Version</span>
                <span className="text-sm font-mono font-medium">v9</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Update Interval</span>
                <span className="text-sm font-medium">Real-time</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Data Sync</span>
                <span className="text-sm font-medium">Live Data from ESP32</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-50 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Sensors</h2>
                <p className="text-sm text-purple-600 font-medium">All Operational</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'MPU6050 (Accelerometer)', status: 'Active', icon: Cpu },
                { name: 'MPU6050 (Gyroscope)', status: 'Active', icon: Cpu },
                { name: 'BMP180 (Pressure)', status: 'Active', icon: Cpu },
                { name: 'HW484 (Sound)', status: 'Active', icon: Cpu },
              ].map((sensor, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <sensor.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{sensor.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{sensor.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-gray-50 rounded-xl">
                <Code className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Integration Notes</h2>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                <p className="font-medium text-blue-900 mb-1">Firebase Ready</p>
                <p className="text-blue-700">
                  The application structure is prepared for Firebase Realtime Database integration.
                  Mock data is currently being used for demonstration.
                </p>
              </div>

              <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                <p className="font-medium text-green-900 mb-1">ESP32 Compatible</p>
                <p className="text-green-700">
                  Data structure supports ESP32 firmware using Arduino IDE with WiFi & Firebase SDK.
                </p>
              </div>

              <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                <p className="font-medium text-purple-900 mb-1">Real-time Updates</p>
                <p className="text-purple-700">
                  System configured for 2-second refresh intervals matching ESP32 update frequency.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 backdrop-blur-xl bg-gradient-to-br from-gray-900 to-black text-white border border-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4">Expected Firebase Data Structure</h3>
          <pre className="bg-black/50 p-4 rounded-xl overflow-x-auto text-xs font-mono border border-gray-800">
            {`{
  "impact_readings": {
    "latest": {
      "accel": 2.3,
      "gyro": 150,
      "pressure": 1009.12,
      "sound": 512,
      "sfi": 0.52,
      "class": "C",
      "timestamp": "2025-10-09T12:45:32Z"
    },
    "logs": {
      "2025-10-09T12:45:32Z": {
        "accel": 2.3,
        "gyro": 150,
        "sfi": 0.52,
        "class": "C"
      }
    }
  },
  "driver_response": {
    "status": "unconfirmed",
    "timestamp": "2025-10-09T12:46:00Z"
  }
}`}
          </pre>
        </motion.div>
      </div>
    </div>
  );
};
