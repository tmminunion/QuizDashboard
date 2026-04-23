'use client';

import React from 'react';
import { Search, Bell, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-600">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl w-80 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500/50 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 bg-pink-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
            3
          </span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name || 'Pangeran Nunu'}</p>
            <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">{user?.role || 'Super Admin'} 👑</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
