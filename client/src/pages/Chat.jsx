import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Send } from 'lucide-react';

// Connect to Backend Socket
const socket = io.connect("http://localhost:5000");

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  // We passed the target user via navigation state (e.g., from Dashboard)
  const { targetUser } = location.state || {};

  const [currentUser] = useState(JSON.parse(localStorage.getItem('skill_user')));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // 1. Redirect if no user selected
  useEffect(() => {
    if (!targetUser) navigate('/dashboard');

    // Join my own room
    if (currentUser) socket.emit('join_room', currentUser.id);
  }, [currentUser, targetUser, navigate]);

  // 2. Load History & Listen for Messages
  useEffect(() => {
    if (!targetUser || !currentUser) return;

    // Fetch old messages via API
    fetch(`http://localhost:5000/chat/${targetUser.id}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem('skill_token')}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for incoming live messages
    const handleReceiveMessage = (data) => {
      // Only add if it belongs to this conversation
      if (data.senderId === targetUser.id || data.senderId === currentUser.id) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => socket.off('receive_message', handleReceiveMessage);
  }, [targetUser, currentUser]);

  // 3. Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const messageData = {
      senderId: currentUser.id,
      receiverId: targetUser.id,
      content: input,
    };

    // Emit to Socket Server
    await socket.emit('send_message', messageData);
    setInput("");
  };

  if (!targetUser) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-slate-800 rounded-xl border border-slate-700 h-[600px] flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
          <h2 className="text-white font-bold text-lg">Chat with {targetUser.name}</h2>
          <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">✕</button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg text-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }`}>
                  <p>{msg.content}</p>
                  <span className="text-[10px] opacity-70 block text-right mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-700 text-white rounded-lg px-4 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button onClick={sendMessage} className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-lg">
            <Send size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;
