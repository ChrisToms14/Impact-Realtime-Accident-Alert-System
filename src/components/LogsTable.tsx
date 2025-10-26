import { motion } from 'framer-motion';
import { ImpactLog } from '../types/sensor';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface LogsTableProps {
  logs: ImpactLog[];
}

export const LogsTable = ({ logs }: LogsTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'Alert':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Alert':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  return (
    <div className="rounded-2xl backdrop-blur-xl bg-white/70 border border-gray-200/50 shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200/50">
        <h3 className="text-xl font-bold text-gray-900">Event Logs</h3>
        <p className="text-sm text-gray-500 mt-1">Impact events classified as B or higher</p>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No impact events recorded</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50/80 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SFI
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {logs.map((log, index) => (
                <motion.tr
                  key={`${log.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.sfi.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-900">
                      Class {log.class}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(log.status)}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
