import { motion } from 'framer-motion';

interface ClassificationBadgeProps {
  classification: 'A' | 'B' | 'C' | 'D' | 'E';
  size?: 'sm' | 'md' | 'lg';
}

const classColors = {
  A: 'bg-green-100 text-green-700 border-green-300',
  B: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  C: 'bg-orange-100 text-orange-700 border-orange-300',
  D: 'bg-red-100 text-red-700 border-red-300',
  E: 'bg-red-200 text-red-900 border-red-400',
};

const classLabels = {
  A: 'Normal',
  B: 'Minor Impact',
  C: 'Moderate Impact',
  D: 'Severe Impact',
  E: 'Critical Impact',
};

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const ClassificationBadge = ({ classification, size = 'md' }: ClassificationBadgeProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center space-x-2 rounded-full border-2 font-bold ${classColors[classification]} ${sizes[size]}`}
    >
      <span className="text-xl">Class {classification}</span>
      <span className="opacity-80">•</span>
      <span>{classLabels[classification]}</span>
    </motion.div>
  );
};
