import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CriticalAlertProps {
  isVisible: boolean;
  onClose: () => void;
  classification: 'D' | 'E';
}

export const CriticalAlert = ({ isVisible, onClose, classification }: CriticalAlertProps) => {
  const [shouldPlaySound, setShouldPlaySound] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldPlaySound(true);
      setTimeout(() => setShouldPlaySound(false), 3000);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <motion.div
              animate={{
                boxShadow: shouldPlaySound
                  ? [
                      '0 0 0 0 rgba(239, 68, 68, 0.7)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                      '0 0 0 0 rgba(239, 68, 68, 0)',
                    ]
                  : '0 20px 50px rgba(0, 0, 0, 0.3)',
              }}
              transition={{ duration: 1, repeat: shouldPlaySound ? Infinity : 0 }}
              className="bg-white rounded-3xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <AlertTriangle className="w-10 h-10" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {classification === 'E' ? 'CRITICAL IMPACT' : 'SEVERE IMPACT'}
                      </h3>
                      <p className="text-red-100 text-sm">Class {classification} Detected</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                    <p className="text-red-900 font-medium">
                      {classification === 'E'
                        ? 'Critical accident detected. Emergency services may need to be contacted.'
                        : 'Severe impact detected. Please check vehicle and occupants immediately.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">Class {classification}</div>
                      <div className="text-xs text-gray-600 mt-1">Impact Level</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">ALERT</div>
                      <div className="text-xs text-gray-600 mt-1">System Status</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Acknowledge Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
