// client/src/pages/Auth.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    try {
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
          window.location.href = "/dashboard";
        } else {
          alert("Welcome! Please Login.");
          setIsLogin(true);
        }
      } else {
        alert(data.error);
      }
    } catch (err) { alert("Connection Failed"); }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-discord-bg bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="bg-discord-dark p-8 rounded-md shadow-2xl w-full max-w-md border border-discord-light animate-fade-in-up">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-discord-muted text-sm">
            {isLogin ? "We're so excited to see you again!" : "Join the skill revolution today."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-discord-muted uppercase mb-1 block">Username</label>
              <input required type="text" className="w-full p-2.5 rounded bg-discord-darker border border-discord-darker focus:border-discord-accent outline-none text-white transition"
                onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-discord-muted uppercase mb-1 block">Email</label>
            <input required type="email" className="w-full p-2.5 rounded bg-discord-darker border border-discord-darker focus:border-discord-accent outline-none text-white transition"
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-bold text-discord-muted uppercase mb-1 block">Password</label>
            <input required type="password" className="w-full p-2.5 rounded bg-discord-darker border border-discord-darker focus:border-discord-accent outline-none text-white transition"
              onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <button className="bg-discord-accent hover:bg-indigo-600 text-white font-bold py-3 rounded transition-all mt-4">
            {isLogin ? "Log In" : "Continue"}
          </button>
        </form>

        <p className="text-sm mt-4 text-discord-muted">
          {isLogin ? "Need an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} className="text-discord-accent ml-1 cursor-pointer hover:underline">
            {isLogin ? "Register" : "Log In"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
