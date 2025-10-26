import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Infotainment } from './pages/Infotainment';
import { SystemInfo } from './pages/SystemInfo';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/infotainment" element={<Infotainment />} />
          <Route path="/system-info" element={<SystemInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
