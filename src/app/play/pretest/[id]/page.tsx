'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  Trophy, 
  ShieldCheck, 
  Info,
  Zap,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function PlayLobbyPretestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pretestInfo, setPretestInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchPretest = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Pretest/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPretestInfo(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPretest();
  }, [id]);

  const startCountdown = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      router.push(`/play/pretest/${id}/session`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, id, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold tracking-widest uppercase italic text-sm">Preparing Pretest Arena...</p>
      </div>
    );
  }

  if (countdown !== null) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center space-y-8 animate-in zoom-in duration-300">
           <p className="text-indigo-500 font-black text-2xl uppercase tracking-[0.5em]">Pretest Starting In</p>
           <div className="text-[180px] font-black text-white leading-none drop-shadow-[0_0_50px_rgba(99,102,241,0.5)]">
             {countdown > 0 ? countdown : 'GO!'}
           </div>
           <p className="text-slate-500 font-medium italic">"Fokuskan pikiranmu, pangeranku!" 📋</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 p-4 md:p-6 animate-in fade-in duration-500 overflow-hidden flex flex-col relative z-0">
       {/* Background Orbs */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-sky-400/30 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-cyan-300/20 rounded-full blur-[100px]"></div>
       </div>

       <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col space-y-4 md:space-y-6 min-h-0 relative z-10">
          {/* Header Player Style */}
          <div className="flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <Link 
                  href="/" 
                  className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-500 transition-all shadow-sm group"
                >
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <Zap className="text-indigo-500 fill-indigo-500" size={22} />
                   PRETEST ARENA
                </h1>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pretest Mode</p>
             </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 min-h-0">
             {/* Rules & Start Side - Kiri */}
             <div className="lg:col-span-2 order-1 lg:order-1 flex flex-col gap-4 min-h-0 h-full">
                <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative flex flex-col flex-1 overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                   
                   <h3 className="text-lg md:text-xl font-black italic tracking-tight flex items-center gap-3 border-b border-white/10 pb-4 shrink-0">
                      <ShieldCheck className="text-indigo-500" size={24} /> ATURAN PRETEST
                   </h3>

                   <ul className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6 py-4 overflow-y-auto no-scrollbar">
                      <li className="flex gap-4 items-start">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white text-xs md:text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">1</div>
                         <p className="text-sm md:text-base text-slate-300 leading-snug font-medium">Setiap soal memiliki batas waktu tertentu.</p>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white text-xs md:text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">2</div>
                         <p className="text-sm md:text-base text-slate-300 leading-snug font-medium">Pilih jawaban yang paling tepat.</p>
                      </li>
                      <li className="flex gap-4 items-start">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white text-xs md:text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">3</div>
                         <p className="text-sm md:text-base text-slate-300 leading-snug font-medium">Skor akan dihitung berdasarkan jawaban yang benar.</p>
                      </li>
                   </ul>

                   <div className="pt-2 shrink-0 mt-auto">
                      <button 
                        onClick={startCountdown}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/30 transition-all active:scale-95 group flex items-center justify-center gap-3"
                      >
                        <Play size={24} className="fill-white" />
                        <span>MULAI PRETEST</span>
                      </button>
                   </div>
                </div>

                <div className="bg-white p-4 md:p-5 rounded-[1.5rem] border border-slate-200 text-center shadow-sm shrink-0">
                   <p className="text-xs md:text-sm text-slate-500 font-bold italic leading-relaxed">
                      "Good luck, pangeranku! Nurani yakin mas Nunu pasti bisa melewati tantangan ini! ❤️✨"
                   </p>
                </div>
             </div>

             {/* Pretest Preview Card - Kanan */}
             <div className="lg:col-span-3 order-2 lg:order-2 flex flex-col min-h-0 h-full">
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden group flex flex-col h-full">
                   <div className="relative overflow-hidden bg-slate-100 flex-1 min-h-0">
                      <img 
                         src={pretestInfo?.Image || `https://picsum.photos/seed/${id}/1200/800`} 
                         alt={pretestInfo?.Title || 'Pretest Cover'} 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6 md:p-8">
                         <div className="space-y-2">
                            <span className="bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-[0.2em] shadow-lg shadow-indigo-500/20">
                               PRETEST MODE
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight line-clamp-2">{pretestInfo?.Title}</h2>
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-6 md:p-8 space-y-4 md:space-y-5 shrink-0 bg-white">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                            <Info size={24} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Info Pretest</p>
                            <p className="text-sm md:text-base text-slate-600 font-medium leading-snug mt-0.5 truncate">
                              {pretestInfo?.Description || 'Bersiaplah untuk menguji wawasan dan kemampuanmu!'}
                            </p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-white border-2 border-slate-50 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                            <Clock className="text-blue-500 mb-2 w-6 h-6" />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Limit Waktu</p>
                            <p className="text-sm md:text-base font-bold text-slate-800">30 Detik / Soal</p>
                         </div>
                         <div className="p-4 bg-white border-2 border-slate-50 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                            <Users className="text-green-500 mb-2 w-6 h-6" />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Peserta</p>
                            <p className="text-sm md:text-base font-bold text-slate-800">Kelas Umum</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
