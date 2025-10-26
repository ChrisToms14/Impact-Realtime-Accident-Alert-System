import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, Gauge, Wind, Volume2, TrendingUp, Wifi } from 'lucide-react';
import { SensorCard } from '../components/SensorCard';
import { ClassificationBadge } from '../components/ClassificationBadge';
import { SFIGauge } from '../components/SFIGauge';
import { LogsTable } from '../components/LogsTable';
import { CriticalAlert } from '../components/CriticalAlert';
import { useFirebaseSensorData } from '../hooks/useFirebaseSensorData';

export const Dashboard = () => {
  const { data, logs } = useFirebaseSensorData();
  const [showAlert, setShowAlert] = useState(false);
  const [lastAlertClass, setLastAlertClass] = useState<'D' | 'E' | null>(null);
  const alarmSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    alarmSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3');
    alarmSound.current.loop = true;
    
    return () => {
      if (alarmSound.current) {
        alarmSound.current.pause();
        alarmSound.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (data.class === 'D' || data.class === 'E') {
      setShowAlert(true);
      setLastAlertClass(data.class);
      
      // Play alarm sound for severe impacts
      if (alarmSound.current) {
        alarmSound.current.play().catch(e => console.error("Error playing alarm sound:", e));
      }
    } else {
      // Stop alarm if impact level decreases
      if (alarmSound.current && alarmSound.current.played.length > 0) {
        alarmSound.current.pause();
        alarmSound.current.currentTime = 0;
      }
    }
  }, [data.class]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Impact Monitoring Dashboard
              </h1>
              <p className="text-gray-600">Real-time vehicle accident detection system</p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">System Online</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ClassificationBadge classification={data.class} size="lg" />
            <div className="text-sm text-gray-500">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <SensorCard
                title="Acceleration"
                value={data.accel}
                unit="g"
                icon={Activity}
                alert={data.accel > 3.0}
              />
              <SensorCard
                title="Gyroscope"
                value={data.gyro}
                unit="°/s"
                icon={Gauge}
                alert={data.gyro > 150}
              />
              <SensorCard
                title="Pressure"
                value={data.pressure}
                unit="hPa"
                icon={Wind}
              />
              <SensorCard
                title="Sound Level"
                value={data.sound}
                unit="ADC"
                icon={Volume2}
                alert={data.sound > 900}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg p-8"
            >
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Live Sensor Fusion Index</h2>
              </div>
              <SFIGauge value={data.sfi} max={10} />

              <div className="grid grid-cols-5 gap-3 mt-6">
                {['A', 'B', 'C', 'D', 'E'].map((cls) => (
                  <div
                    key={cls}
                    className={`text-center p-3 rounded-lg border-2 transition-all ${
                      data.class === cls
                        ? 'border-gray-900 bg-gray-50 shadow-md'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div
                      className={`text-lg font-bold ${
                        data.class === cls ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {cls}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Classification Guide</h3>
            <div className="space-y-3">
              {[
                { class: 'A', label: 'Normal', desc: 'No impact detected', range: 'SFI < 1.0' },
                { class: 'B', label: 'Minor', desc: 'Small vibrations', range: 'SFI 1.0-2.0' },
                { class: 'C', label: 'Moderate', desc: 'Noticeable impact', range: 'SFI 2.0-3.5' },
                { class: 'D', label: 'Severe', desc: 'Major collision', range: 'SFI 3.5-5.0' },
                { class: 'E', label: 'Critical', desc: 'Emergency event', range: 'SFI > 5.0' },
              ].map((item) => (
                <div
                  key={item.class}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">Class {item.class}</span>
                    <span className="text-xs text-gray-500">{item.range}</span>
                  </div>
                  <div className="text-sm text-gray-700 font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LogsTable logs={logs} />
        </motion.div>
      </div>

      {lastAlertClass && (
        <CriticalAlert
          isVisible={showAlert}
          onClose={() => setShowAlert(false)}
          classification={lastAlertClass}
        />
      )}
    </div>
  );
};
