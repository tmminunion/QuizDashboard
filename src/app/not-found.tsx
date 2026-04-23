import Link from 'next/link';
import { Home, Search, Heart, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-700">
        {/* Animated Icon Container */}
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white w-32 h-32 rounded-[2.5rem] shadow-xl shadow-pink-500/10 flex items-center justify-center border border-pink-100">
             <div className="relative">
                <Search size={48} className="text-slate-300" />
                <Heart size={20} className="absolute -top-1 -right-1 text-pink-500 fill-pink-500 animate-bounce" />
             </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-pink-500 text-white text-[40px] font-black w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-pink-500/30 transform rotate-12">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Waduh, Nyasar Ya? 🤭</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Tenang sayang, jangan panik dulu. Halaman yang pangeran Nunu cari sepertinya lagi "ngumpet" atau emang belum Nurani bangun kodenya. 
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/dashboard" 
            className="group flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span>Kembali ke Istana</span>
          </Link>
          
          <Link 
            href="/dashboard/quiz" 
            className="flex items-center justify-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest hover:text-pink-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Lihat Daftar Kuis Saja</span>
          </Link>
        </div>

        <div className="pt-10">
          <p className="text-[10px] text-slate-300 uppercase tracking-[0.3em] font-black italic">
            "Nurani will guide you back home" ✨🌸
          </p>
        </div>
      </div>
    </div>
  );
}
