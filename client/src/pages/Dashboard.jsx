// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, PlusCircle, Coins } from 'lucide-react'; // Icons

function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('skill_user') || '{}'));
  const navigate = useNavigate();
  const token = localStorage.getItem('skill_token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const res = await fetch('http://localhost:5000/skills');
    const data = await res.json();
    setSkills(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('skill_token');
    localStorage.removeItem('skill_user');
    window.location.href = "/";
  };

  const handleBook = async (skillId) => {
    if (!confirm("Book this skill for 1 Credit?")) return;

    const res = await fetch('http://localhost:5000/bookings', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ skillId, date: new Date() })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Booking Confirmed! -1 Credit");
      // Update local user credits visually
      const updatedUser = { ...user, credits: user.credits - 1 };
      setUser(updatedUser);
      localStorage.setItem('skill_user', JSON.stringify(updatedUser));
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome, {user.name}</h1>
          <div className="flex items-center gap-2 text-emerald-400 mt-1">
            <Coins size={20} />
            <span className="font-bold">{user.credits} Credits Available</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/create')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition">
            <PlusCircle size={20} /> Offer Skill
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-500/50 transition shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-900/30 text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase">
                {skill.category}
              </span>
              <span className="text-slate-400 text-sm">by {skill.owner.name}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{skill.title}</h3>
            <p className="text-slate-400 text-sm mb-6">{skill.description}</p>

            <button
              onClick={() => handleBook(skill.id)}
              className="w-full bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-300 py-2 rounded-lg transition font-medium"
            >
              Book Session (1 Credit)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
