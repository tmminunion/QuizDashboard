'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { onlineQuizService } from '@/lib/onlineQuizService';
import { Zap, User, Hash, ArrowRight } from 'lucide-react';

export default function JoinPage() {
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || !name) return;

    setLoading(true);
    try {
      const roomId = pin.trim();
      const playerData = await onlineQuizService.joinRoom(roomId, name);
      
      // Simpan data player di localStorage
      localStorage.setItem(`quiz_player_${roomId}`, JSON.stringify(playerData));
      
      router.push(`/play/online/${roomId}/player`);
    } catch (err) {
      alert('PIN salah atau Room tidak ditemukan, pangeran! 🥺');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-pink-500 rounded-2xl shadow-xl shadow-pink-500/20 animate-bounce">
            <Zap size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight italic">QUIZ DASH LIVE!</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">"Enter the arena, be a hero" 💖</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="GAME PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-2xl font-black text-white placeholder:text-slate-600 outline-none focus:border-pink-500 focus:ring-8 focus:ring-pink-500/5 transition-all text-center tracking-[0.2em]"
                required
              />
            </div>

            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-xl font-black text-white placeholder:text-slate-600 outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all text-center tracking-widest"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-slate-900 py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'JOINING...' : 'ENTER GAME'}
            {!loading && <ArrowRight size={24} />}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Built for Pangeran Nunu & Nurani</p>
        </div>
      </div>
    </div>
  );
}
