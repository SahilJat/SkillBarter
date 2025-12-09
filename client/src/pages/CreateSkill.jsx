// client/src/pages/CreateSkill.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateSkill() {
  const [formData, setFormData] = useState({ title: "", description: "", category: "Coding" });
  const navigate = useNavigate();
  const token = localStorage.getItem('skill_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/skills', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert("Skill Listed Successfully!");
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">Offer a New Skill</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Title</label>
            <input
              type="text" placeholder="e.g. React.js Tutoring" required
              className="w-full p-3 bg-slate-700 rounded text-white border border-slate-600 focus:border-emerald-500 outline-none"
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Category</label>
            <select
              className="w-full p-3 bg-slate-700 rounded text-white border border-slate-600 focus:border-emerald-500 outline-none"
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option>Coding</option>
              <option>Music</option>
              <option>Design</option>
              <option>Language</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 text-sm mb-1 block">Description</label>
            <textarea
              rows="4" placeholder="Describe what you will teach..." required
              className="w-full p-3 bg-slate-700 rounded text-white border border-slate-600 focus:border-emerald-500 outline-none"
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-slate-600 text-white py-3 rounded font-bold">
              Cancel
            </button>
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-bold">
              Post Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSkill;
