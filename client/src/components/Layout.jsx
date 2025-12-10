import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, PlusCircle, LogOut } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const SidebarItem = ({ icon: Icon, path, tooltip }) => {
    const active = location.pathname === path;
    return (
      <div
        onClick={() => navigate(path)}
        className={`relative group flex justify-center items-center w-12 h-12 rounded-3xl hover:rounded-xl transition-all cursor-pointer mb-3 mx-auto
        ${active ? "bg-discord-accent text-white rounded-xl" : "bg-discord-bg text-discord-green hover:bg-discord-green hover:text-white"}`}
      >
        <Icon size={24} />
        {/* Tooltip */}
        <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
          {tooltip}
        </span>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-discord-bg font-sans">
      {/* SIDEBAR */}
      <div className="w-[72px] bg-discord-darker flex flex-col py-4 shrink-0">
        <SidebarItem icon={LayoutDashboard} path="/dashboard" tooltip="Dashboard" />
        <SidebarItem icon={MessageSquare} path="/inbox" tooltip="Messages" />
        <SidebarItem icon={PlusCircle} path="/create" tooltip="Offer Skill" />

        <div className="mt-auto">
          <div onClick={() => { localStorage.clear(); window.location.href = '/'; }}
            className="flex justify-center items-center w-12 h-12 rounded-3xl hover:rounded-xl bg-discord-bg text-discord-red hover:bg-discord-red hover:text-white transition-all cursor-pointer mx-auto">
            <LogOut size={20} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-discord-bg">
        <Outlet /> {/* This is where Dashboard/Chat/Create renders */}
      </div>
    </div>
  );
}

export default Layout;
