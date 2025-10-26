import { Link, useLocation } from 'react-router-dom';
import { Activity, Car, Info } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">Impact Detection System</span>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/dashboard')
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/infotainment"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/infotainment')
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="font-medium">Infotainment</span>
            </Link>

            <Link
              to="/system-info"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/system-info')
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Info className="w-5 h-5" />
              <span className="font-medium">System Info</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
