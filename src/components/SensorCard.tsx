import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  alert?: boolean;
}

export const SensorCard = ({ title, value, unit, icon: Icon, trend, alert }: SensorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border ${
        alert ? 'border-red-300 shadow-red-100' : 'border-gray-200/50'
      } shadow-lg p-6 transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${alert ? 'bg-red-50' : 'bg-gray-50'}`}>
          <Icon className={`w-6 h-6 ${alert ? 'text-red-600' : 'text-gray-700'}`} />
        </div>
        {trend && (
          <div
            className={`text-sm px-2 py-1 rounded-full ${
              trend === 'up'
                ? 'bg-red-50 text-red-600'
                : trend === 'down'
                ? 'bg-green-50 text-green-600'
                : 'bg-gray-50 text-gray-600'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      <div className="flex items-baseline space-x-2">
        <span className={`text-3xl font-bold ${alert ? 'text-red-600' : 'text-gray-900'}`}>
          {value}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {alert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-red-500/5 pointer-events-none"
        />
      )}
    </motion.div>
  );
};
