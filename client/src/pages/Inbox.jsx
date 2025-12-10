// client/src/pages/Inbox.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Inbox() {
  const [conversations, setConversations] = useState([]); // Default to empty array
  const navigate = useNavigate();
  const token = localStorage.getItem('skill_token');

  useEffect(() => {
    fetch('http://localhost:5000/chat/inbox', {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // --- DEBUG LOG ---
        console.log("Inbox Data:", data);

        // --- SAFEGUARD ---
        if (Array.isArray(data)) {
          setConversations(data);
        } else {
          console.error("API Error:", data);
          setConversations([]); // Fallback to empty list
        }
      })
      .catch(err => console.error("Network Error:", err));
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar List */}
      <div className="w-80 bg-discord-dark flex flex-col border-r border-discord-darker">
        <div className="p-4 shadow-sm text-white font-bold text-lg">Messages</div>
        <div className="flex-1 overflow-y-auto">
          {/* SAFEGUARD: Only map if we have length */}
          {conversations.length === 0 ? (
            <p className="text-discord-muted text-center mt-10">No messages yet.</p>
          ) : (
            conversations.map(c => (
              <div key={c.user.id}
                onClick={() => navigate('/chat', { state: { targetUser: c.user } })}
                className="flex items-center gap-3 p-3 hover:bg-discord-light cursor-pointer transition mx-2 rounded my-1"
              >
                <div className="w-10 h-10 rounded-full bg-discord-accent flex items-center justify-center text-white font-bold">
                  {c.user.name[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between">
                    <h4 className="text-gray-200 font-medium truncate">{c.user.name}</h4>
                    <span className="text-xs text-discord-muted">{new Date(c.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-discord-muted text-sm truncate">{c.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Empty State (Right Side) */}
      <div className="flex-1 bg-discord-bg flex items-center justify-center text-discord-muted flex-col">
        <h3 className="text-xl font-bold mb-2">Select a conversation</h3>
        <p>Or find a skill in the Dashboard to start chatting.</p>
      </div>
    </div>
  );
}

export default Inbox;
