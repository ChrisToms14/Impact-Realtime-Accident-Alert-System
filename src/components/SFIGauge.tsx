import { motion } from 'framer-motion';

interface SFIGaugeProps {
  value: number;
  max?: number;
}

export const SFIGauge = ({ value, max = 10 }: SFIGaugeProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = () => {
    if (percentage < 20) return '#10b981';
    if (percentage < 40) return '#fbbf24';
    if (percentage < 60) return '#f97316';
    if (percentage < 80) return '#ef4444';
    return '#dc2626';
  };

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="25%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="251.2"
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (percentage / 100) * 251.2 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        <motion.line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: '100px 100px' }}
        />

        <circle cx="100" cy="100" r="8" fill={getColor()} />
        <circle cx="100" cy="100" r="4" fill="white" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <motion.div
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold text-gray-900"
        >
          {value.toFixed(2)}
        </motion.div>
        <div className="text-sm text-gray-500 font-medium mt-1">Sensor Fusion Index</div>
      </div>
    </div>
  );
};
