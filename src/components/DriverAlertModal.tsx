import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Phone, X } from 'lucide-react';

interface DriverAlertModalProps {
  isVisible: boolean;
  classification: 'B' | 'C' | 'D' | 'E';
  onConfirmFalseAlarm: () => void;
  onEmergencyHelp: () => void;
  onDismiss: () => void;
}

export const DriverAlertModal = ({
  isVisible,
  classification,
  onConfirmFalseAlarm,
  onEmergencyHelp,
  onDismiss,
}: DriverAlertModalProps) => {
  const getAlertConfig = () => {
    switch (classification) {
      case 'E':
        return {
          title: 'CRITICAL ACCIDENT DETECTED',
          description: 'Severe impact detected. Emergency services may be contacted automatically.',
          color: 'red',
          showEmergency: true,
        };
      case 'D':
        return {
          title: 'SEVERE ACCIDENT DETECTED',
          description: 'Major collision detected. Confirm if this is a false alarm.',
          color: 'red',
          showEmergency: true,
        };
      case 'C':
        return {
          title: 'POTENTIAL COLLISION DETECTED',
          description: 'Moderate impact detected. Please verify vehicle status.',
          color: 'orange',
          showEmergency: false,
        };
      case 'B':
        return {
          title: 'Minor Impact Detected',
          description: 'Small vibrations detected. System is monitoring.',
          color: 'yellow',
          showEmergency: false,
        };
    }
  };

  const config = getAlertConfig();
  const isCritical = classification === 'D' || classification === 'E';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-6"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-white/10">
              {isCritical && (
                <motion.div
                  animate={{
                    backgroundColor: ['#dc2626', '#ef4444', '#dc2626'],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-2"
                />
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={
                        isCritical
                          ? { rotate: [0, -15, 15, -15, 0], scale: [1, 1.1, 1] }
                          : {}
                      }
                      transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0, repeatDelay: 1 }}
                      className={`p-4 rounded-2xl ${
                        config.color === 'red'
                          ? 'bg-red-500/20'
                          : config.color === 'orange'
                          ? 'bg-orange-500/20'
                          : 'bg-yellow-500/20'
                      }`}
                    >
                      {isCritical ? (
                        <ShieldAlert
                          className={`w-10 h-10 ${
                            config.color === 'red' ? 'text-red-500' : 'text-orange-500'
                          }`}
                        />
                      ) : (
                        <AlertTriangle
                          className={`w-10 h-10 ${
                            config.color === 'orange' ? 'text-orange-500' : 'text-yellow-500'
                          }`}
                        />
                      )}
                    </motion.div>
                    <div>
                      <h2
                        className={`text-2xl font-bold mb-1 ${
                          config.color === 'red'
                            ? 'text-red-500'
                            : config.color === 'orange'
                            ? 'text-orange-500'
                            : 'text-yellow-500'
                        }`}
                      >
                        {config.title}
                      </h2>
                      <p className="text-white/70">{config.description}</p>
                    </div>
                  </div>

                  {!isCritical && (
                    <button
                      onClick={onDismiss}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-white/60" />
                    </button>
                  )}
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60">Impact Classification</span>
                    <span className="text-3xl font-bold text-white">Class {classification}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          classification === 'E'
                            ? 100
                            : classification === 'D'
                            ? 80
                            : classification === 'C'
                            ? 60
                            : 40
                        }%`,
                      }}
                      className={`h-full ${
                        config.color === 'red'
                          ? 'bg-red-500'
                          : config.color === 'orange'
                          ? 'bg-orange-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  {config.showEmergency && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onEmergencyHelp}
                      className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Request Emergency Help</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirmFalseAlarm}
                    className="flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-colors border border-white/20"
                  >
                    <X className="w-5 h-5" />
                    <span>Confirm False Alarm</span>
                  </motion.button>
                </div>

                {isCritical && (
                  <p className="text-center text-white/40 text-sm mt-4">
                    If no action is taken, emergency services will be notified automatically
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
