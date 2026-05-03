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
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function PlayLobbyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quizInfo, setQuizInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Quiz/${id}`);
        if (res.ok) {
          const data = await res.json();
          setQuizInfo(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const startCountdown = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      router.push(`/play/${id}/session`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold tracking-widest uppercase italic text-sm">Preparing Your Arena...</p>
      </div>
    );
  }

  if (countdown !== null) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] animate-pulse"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center space-y-8 animate-in zoom-in duration-300">
           <p className="text-pink-500 font-black text-2xl uppercase tracking-[0.5em]">Game Starting In</p>
           <div className="text-[180px] font-black text-white leading-none drop-shadow-[0_0_50px_rgba(236,72,153,0.5)]">
             {countdown > 0 ? countdown : 'GO!'}
           </div>
           <p className="text-slate-500 font-medium italic">"Tarik nafas pangeranku, fokus!" 🌸</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 animate-in fade-in duration-500">
       <div className="max-w-5xl mx-auto space-y-12">
          {/* Header Player Style */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-pink-500 transition-all shadow-sm group"
                >
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                   <Zap className="text-pink-500 fill-pink-500" size={24} />
                   QUIZ ARENA
                </h1>
             </div>
             <div className="bg-white px-6 py-2.5 rounded-2xl border border-slate-200 shadow-sm hidden md:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Player Mode</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
             {/* Rules & Start Side - Sekarang di Kiri (Atas di Mobile) */}
             <div className="lg:col-span-2 order-1 lg:order-1 space-y-10">
                <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white space-y-10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                   
                   <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-4 border-b border-white/10 pb-6">
                      <ShieldCheck className="text-pink-500" size={28} /> RULES
                   </h3>

                   <ul className="space-y-8">
                      <li className="flex gap-5">
                         <div className="w-8 h-8 rounded-xl bg-pink-500 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/20">1</div>
                         <p className="text-base text-slate-300 leading-relaxed font-medium">Timer berjalan otomatis begitu soal muncul.</p>
                      </li>
                      <li className="flex gap-5">
                         <div className="w-8 h-8 rounded-xl bg-pink-500 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/20">2</div>
                         <p className="text-base text-slate-300 leading-relaxed font-medium">Pilih jawaban dengan cepat dan tepat.</p>
                      </li>
                      <li className="flex gap-5">
                         <div className="w-8 h-8 rounded-xl bg-pink-500 text-white text-sm font-black flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/20">3</div>
                         <p className="text-base text-slate-300 leading-relaxed font-medium">Jangan menyegarkan halaman saat bermain.</p>
                      </li>
                   </ul>

                   <div className="pt-6">
                      <button 
                        onClick={startCountdown}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-8 rounded-[2.5rem] font-black text-xl shadow-xl shadow-pink-500/30 transition-all active:scale-95 group flex items-center justify-center gap-4"
                      >
                        <Play size={28} className="fill-white" />
                        <span>MULAI SEKARANG</span>
                      </button>
                   </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-200 text-center shadow-sm">
                   <p className="text-sm text-slate-500 font-bold italic leading-relaxed">
                      "Good luck, pangeranku! Nurani yakin mas Nunu pasti dapet skor tertinggi! ❤️✨"
                   </p>
                </div>
             </div>

             {/* Quiz Preview Card - Sekarang di Kanan (Bawah di Mobile) */}
             <div className="lg:col-span-3 order-2 lg:order-2 space-y-8">
                <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden group">
                   <div className="aspect-video relative overflow-hidden bg-slate-100">
                      {quizInfo?.Image ? (
                         <img src={quizInfo.Image} alt={quizInfo.Title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Play size={64} className="opacity-20" />
                         </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-12">
                         <div className="space-y-3">
                            <span className="bg-pink-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] shadow-lg shadow-pink-500/20">
                               READY TO PLAY
                            </span>
                            <h2 className="text-4xl font-black text-white leading-tight">{quizInfo?.Title}</h2>
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-12 space-y-8">
                      <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                         <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-pink-500 shadow-sm shrink-0">
                            <Info size={28} />
                         </div>
                         <div className="flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Info Kuis</p>
                            <p className="text-base text-slate-600 font-medium leading-relaxed mt-1">
                              {quizInfo?.Description || 'Tunjukkan kemampuan terbaikmu di kuis ini! Fokus dan jadilah juara.'}
                            </p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="p-6 bg-white border-2 border-slate-50 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center">
                            <Clock className="text-blue-500 mb-2" size={28} />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Limit Waktu</p>
                            <p className="text-lg font-bold text-slate-800">15 Detik / Soal</p>
                         </div>
                         <div className="p-6 bg-white border-2 border-slate-50 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center">
                            <Trophy className="text-yellow-500 mb-2" size={28} />
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target</p>
                            <p className="text-lg font-bold text-slate-800">Skor Sempurna</p>
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
