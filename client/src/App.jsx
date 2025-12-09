
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateSkill from './pages/CreateSkill';

function App() {
  const token = localStorage.getItem('skill_token');

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        <Route path="/" element={!token ? <Auth /> : <Navigate to="/dashboard" />} />

        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/create" element={token ? <CreateSkill /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
