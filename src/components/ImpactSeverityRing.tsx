import { motion } from 'framer-motion';

interface ImpactSeverityRingProps {
  classification: 'A' | 'B' | 'C' | 'D' | 'E';
  sfi: number;
}

const classLevels = {
  A: { level: 0, color: '#10b981', label: 'Normal', percentage: 10 },
  B: { level: 1, color: '#fbbf24', label: 'Minor', percentage: 30 },
  C: { level: 2, color: '#f97316', label: 'Moderate', percentage: 50 },
  D: { level: 3, color: '#ef4444', label: 'Severe', percentage: 75 },
  E: { level: 4, color: '#dc2626', label: 'Critical', percentage: 100 },
};

export const ImpactSeverityRing = ({ classification, sfi }: ImpactSeverityRingProps) => {
  const { color, label, percentage } = classLevels[classification];
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="70"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="20"
        />

        <motion.circle
          cx="128"
          cy="128"
          r="70"
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            filter: 'drop-shadow(0 0 10px currentColor)',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={classification}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl font-bold mb-2" style={{ color }}>
            {classification}
          </div>
          <div className="text-xl font-bold text-white mb-1">{label}</div>
          <div className="text-sm text-white/60">SFI: {sfi.toFixed(2)}</div>
        </motion.div>
      </div>
    </div>
  );
};
