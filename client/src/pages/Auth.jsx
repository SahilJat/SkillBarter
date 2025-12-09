
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";

    const res = await fetch(`http://localhost:5000/auth${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      if (isLogin) {
        localStorage.setItem('skill_token', data.token);
        localStorage.setItem('skill_user', JSON.stringify(data.user));
        window.location.href = "/dashboard"; // Force refresh to update App state
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-2 text-emerald-400">SkillBarter 🤝</h1>
        <p className="text-center text-slate-400 mb-6">Trade skills, not money.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text" placeholder="Full Name"
              className="p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 outline-none text-white"
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          )}

          <input
            type="email" placeholder="Email"
            className="p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 outline-none text-white"
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />

          <input
            type="password" placeholder="Password"
            className="p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 outline-none text-white"
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />

          <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded transition-all">
            {isLogin ? "Login" : "Join Community"}
          </button>
        </form>

        <p className="text-center mt-4 text-slate-400 cursor-pointer hover:text-white" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New here? Create account" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
