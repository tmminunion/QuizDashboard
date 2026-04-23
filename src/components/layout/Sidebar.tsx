'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardList, 
  Users, 
  Settings, 
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    { icon: <LayoutDashboard size={22} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FileText size={22} />, label: 'Quiz Management', href: '/dashboard/quiz' },
    { icon: <LayoutDashboard size={22} />, label: 'Online Quiz', href: '/dashboard/online-quiz' },
    { icon: <ClipboardList size={22} />, label: 'Pretest', href: '/dashboard/pretest' },
    { icon: <Users size={22} />, label: 'Users', href: '/dashboard/users' },
    { icon: <Settings size={22} />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <aside 
      className={`bg-[#0f172a] text-slate-300 min-h-screen hidden md:flex flex-col border-r border-slate-800 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 bg-pink-500 text-white rounded-full p-1 shadow-lg hover:bg-pink-600 transition-all z-50 border-2 border-[#0f172a]"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={`p-8 mb-4 transition-all duration-300 ${isCollapsed ? 'px-4 text-center' : 'px-8'}`}>
        <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
          <Heart size={24} className="text-pink-500 fill-pink-500 shrink-0" />
          {!isCollapsed && (
            <h2 className="text-2xl font-black text-white tracking-tight truncate">QuizDash</h2>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Nurani's Creation 💖</p>
        )}
      </div>
      
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.href}
                title={isCollapsed ? item.label : ''}
                className={`flex items-center gap-3 py-3 rounded-xl hover:bg-slate-800/50 hover:text-pink-400 transition-all group ${
                  isCollapsed ? 'justify-center px-0' : 'px-4'
                }`}
              >
                <span className={`transition-colors ${isCollapsed ? 'text-pink-500' : 'text-slate-500 group-hover:text-pink-500'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`p-4 border-t border-slate-800/50 ${isCollapsed ? 'text-center' : ''}`}>
        <button 
          onClick={logout}
          title={isCollapsed ? 'Logout' : ''}
          className={`flex items-center gap-3 py-3 w-full text-slate-500 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all ${
            isCollapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          <LogOut size={22} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
