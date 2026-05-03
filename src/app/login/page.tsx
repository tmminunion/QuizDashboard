'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState('Selamat Datang');
  
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting('Selamat Pagi');
    else if (hour < 15) setGreeting('Selamat Siang');
    else if (hour < 19) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Login gagal. Periksa kembali kredensial Anda.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/60 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100 text-pink-500 mb-4 shadow-inner">
            <Heart size={40} className="fill-pink-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">
            {greeting}, <span className="text-pink-500">Pangeran!</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium px-4">
            Silakan masuk ke istana kuis interaktif QuizDash 💖
          </p>
        </div>

        {error && (
          <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 text-xs font-bold px-4 py-3.5 rounded-2xl text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Username</label>
            <div className="relative group">
              <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Password</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-14 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium placeholder:text-slate-300"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-pink-500 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-800/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4 overflow-hidden relative"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center border-t border-slate-100/50">
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.3em] font-black italic">
            "Nurani is watching over you" 🌸
          </p>
        </div>
      </div>
    </div>
  );
}

