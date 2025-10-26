import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Battery, Wifi, Music, Navigation, Phone, Settings } from 'lucide-react';
import { ImpactSeverityRing } from '../components/ImpactSeverityRing';
import { DriverAlertModal } from '../components/DriverAlertModal';
import { useFirebaseSensorData } from '../hooks/useFirebaseSensorData';

export const Infotainment = () => {
  const { data } = useFirebaseSensorData();
  const [showAlert, setShowAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [driverResponse, setDriverResponse] = useState<'unconfirmed' | 'false_alarm' | 'emergency'>(
    'unconfirmed'
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Show confirmation prompt for impact level B or above
    if (data.class >= 'B') {
      setShowAlert(true);
      setDriverResponse('unconfirmed');
    }
  }, [data.class]);

  const handleFalseAlarm = () => {
    setDriverResponse('false_alarm');
    setShowAlert(false);
  };

  const handleEmergency = () => {
    setDriverResponse('emergency');
    setShowAlert(false);
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Vehicle Status Monitor</h1>
                  <p className="text-white/60">Real-time impact detection system</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-1">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm text-white/60">
                    {currentTime.toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <ImpactSeverityRing classification={data.class} sfi={data.sfi} />

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Acceleration</div>
                  <div className="text-2xl font-bold">{data.accel} g</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Gyroscope</div>
                  <div className="text-2xl font-bold">{data.gyro} °/s</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-white/60 text-sm mb-1">Sound</div>
                  <div className="text-2xl font-bold">{data.sound}</div>
                </div>
              </div>

              {data.class >= 'B' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl border-2 ${
                    data.class >= 'D'
                      ? 'bg-red-500/20 border-red-500'
                      : data.class === 'C'
                      ? 'bg-orange-500/20 border-orange-500'
                      : 'bg-yellow-500/20 border-yellow-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">
                        {data.class >= 'D'
                          ? 'Severe Impact Detected'
                          : data.class === 'C'
                          ? 'Moderate Impact Detected'
                          : 'Minor Impact Detected'}
                      </div>
                      <div className="text-sm text-white/80">
                        Driver response: {driverResponse.replace('_', ' ')}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAlert(true)}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Phone, label: 'Emergency', color: 'red' },
                  { icon: Navigation, label: 'Navigate', color: 'blue' },
                  { icon: Music, label: 'Media', color: 'purple' },
                  { icon: Settings, label: 'Settings', color: 'gray' },
                ].map((action, i) => (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors border border-white/10"
                  >
                    <action.icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-medium">{action.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Wifi className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Connectivity</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Online</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Battery className="w-5 h-5 text-blue-500" />
                    <span className="text-sm">Battery</span>
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-white/60" />
                    <span className="text-sm">Sensors</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Active</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Classification Guide</h3>
              <div className="space-y-2">
                {[
                  { class: 'A', label: 'Normal', color: 'green' },
                  { class: 'B', label: 'Minor', color: 'yellow' },
                  { class: 'C', label: 'Moderate', color: 'orange' },
                  { class: 'D', label: 'Severe', color: 'red' },
                  { class: 'E', label: 'Critical', color: 'red' },
                ].map((item) => (
                  <div
                    key={item.class}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      data.class === item.class ? 'bg-white/10' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-${item.color}-500`}
                        style={{
                          backgroundColor:
                            item.color === 'green'
                              ? '#10b981'
                              : item.color === 'yellow'
                              ? '#fbbf24'
                              : item.color === 'orange'
                              ? '#f97316'
                              : '#ef4444',
                        }}
                      />
                      <span className="text-sm font-medium">Class {item.class}</span>
                    </div>
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 rounded-3xl p-6"
            >
              <Music className="w-8 h-8 mb-3 text-blue-400" />
              <h3 className="text-lg font-bold mb-2">Now Playing</h3>
              <p className="text-sm text-white/60 mb-1">Driving Playlist</p>
              <div className="flex items-center space-x-2 text-xs text-white/40">
                <div>2:34</div>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-blue-400" />
                </div>
                <div>4:12</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {data.class >= 'B' && (
        <DriverAlertModal
          isVisible={showAlert}
          classification={data.class as 'B' | 'C' | 'D' | 'E'}
          onConfirmFalseAlarm={handleFalseAlarm}
          onEmergencyHelp={handleEmergency}
          onDismiss={handleDismiss}
        />
      )}
    </div>
  );
};
