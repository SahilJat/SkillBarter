// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateSkill from './pages/CreateSkill';
import Chat from './pages/Chat';
import Inbox from './pages/Inbox';
import Layout from './components/Layout';

function App() {
  const token = localStorage.getItem('skill_token');

  return (
    // Note: We removed the bg-slate-900 here because Layout/Home handles backgrounds now
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={!token ? <Auth /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes wrapped in Sidebar Layout */}
      <Route element={token ? <Layout /> : <Navigate to="/auth" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateSkill />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
