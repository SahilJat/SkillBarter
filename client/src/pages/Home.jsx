import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-discord-bg text-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black text-discord-accent tracking-tighter">SkillBarter</h1>
        <div className="gap-4 flex">
          <button onClick={() => navigate('/auth')} className="px-4 py-2 hover:underline">Login</button>
          <button onClick={() => navigate('/auth')} className="bg-discord-accent hover:bg-indigo-600 px-5 py-2 rounded-full font-bold transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-20 px-4">
        <h1 className="text-5xl md:text-7xl font-black mb-6">
          Trade Skills.<br /> <span className="text-discord-accent">Not Money.</span>
        </h1>
        <p className="text-discord-muted text-xl max-w-2xl mb-10">
          The community where engineers, artists, and creators swap talents.
          Teach React, learn Guitar. No currency required.
        </p>
        <button onClick={() => navigate('/auth')} className="bg-discord-accent hover:bg-indigo-600 px-8 py-4 rounded-full text-xl font-bold flex items-center gap-2 transition transform hover:scale-105">
          Join the Community <ArrowRight />
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-32 px-6">
        <div className="bg-discord-dark p-8 rounded-2xl border border-discord-light">
          <Zap className="text-yellow-400 mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Instant Credits</h3>
          <p className="text-discord-muted">Start with 3 free credits. Earn more by teaching others your craft.</p>
        </div>
        <div className="bg-discord-dark p-8 rounded-2xl border border-discord-light">
          <Users className="text-discord-green mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Real-Time Chat</h3>
          <p className="text-discord-muted">Connect instantly with our Socket.io powered messaging system.</p>
        </div>
        <div className="bg-discord-dark p-8 rounded-2xl border border-discord-light">
          <CheckCircle className="text-discord-accent mb-4" size={40} />
          <h3 className="text-xl font-bold mb-2">Verified Skills</h3>
          <p className="text-discord-muted">See profiles, history, and community trust scores before you book.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
