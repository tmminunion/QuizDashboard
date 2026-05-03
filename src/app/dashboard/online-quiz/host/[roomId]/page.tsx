'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onlineQuizService } from '@/lib/onlineQuizService';
import { Users, Play, ChevronRight, Trophy, Trash2, ArrowLeft, Tv, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HostControlPage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onlineQuizService.listenToRoom(roomId as string, (data) => {
      setRoomData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  const players = roomData?.players ? Object.values(roomData.players) : [];
  const currentQuestion = roomData?.quiz?.questions?.[roomData?.currentQuestionIndex];

  const handleStartGame = async () => {
    if (players.length === 0) {
      alert('Tunggu peserta masuk dulu ya pangeran! 😄');
      return;
    }
    await onlineQuizService.updateRoomStatus(roomId as string, 'playing');
  };

  const handleNextQuestion = async () => {
    const nextIndex = (roomData?.currentQuestionIndex || 0) + 1;
    if (nextIndex < roomData?.quiz?.questions?.length) {
      await onlineQuizService.nextQuestion(roomId as string, nextIndex);
    } else {
      await onlineQuizService.updateRoomStatus(roomId as string, 'finished');
    }
  };

  const handleEndGame = async () => {
    if (confirm('Yakin mau mengakhiri kuis ini sekarang?')) {
      await onlineQuizService.updateRoomStatus(roomId as string, 'finished');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold">Menghubungkan ke istana kuis... ✨</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
      {/* Top Bar - Ultra Slim */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/online-quiz" className="p-2 text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none uppercase">{roomData?.quiz?.title}</h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest bg-pink-500/10 px-2 py-0.5 rounded">PIN: {roomId}</span>
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">{roomData?.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link 
            href={`/play/online/${roomId}`} 
            target="_blank"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Tv size={14} />
            <span>Audience Screen</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Main Controls - Center */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {roomData?.status === 'waiting' ? (
            <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 border border-white/5 shadow-2xl">
               <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6">
                  <Users size={40} className="text-pink-500" />
               </div>
               <h2 className="text-3xl font-black text-white italic mb-2">READY TO START?</h2>
               <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-sm">{players.length} Players Joined</p>
               <button 
                 onClick={handleStartGame}
                 className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl shadow-pink-500/20 transition-all active:scale-95 flex items-center gap-3"
               >
                 <Play size={24} className="fill-white" />
                 START GAME
               </button>
            </div>
          ) : roomData?.status === 'playing' ? (
            <div className="flex-1 bg-white rounded-[2.5rem] p-8 flex flex-col gap-6 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between">
                 <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {roomData.currentQuestionIndex + 1} / {roomData.quiz.questions.length}</span>
                 <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">Active Now</div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl p-8 border border-slate-100">
                 <h3 className="text-2xl font-black text-slate-800 italic leading-snug">"{currentQuestion?.text}"</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                   onClick={handleNextQuestion}
                   className="bg-slate-800 hover:bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all"
                 >
                   <span>NEXT QUESTION</span>
                   <ChevronRight size={20} />
                 </button>
                 <button 
                   onClick={handleEndGame}
                   className="bg-red-50 text-red-500 py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                 >
                   <Trash2 size={20} />
                   <span>END GAME</span>
                 </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-6">
               <div className="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center">
                  <Trophy size={40} className="text-yellow-500" />
               </div>
               <h2 className="text-2xl font-black text-slate-800 uppercase">Quiz Completed!</h2>
               <button 
                 onClick={() => onlineQuizService.deleteRoom(roomId as string)}
                 className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2"
               >
                 <Trash2 size={18} />
                 <span>Close & Reset Room</span>
               </button>
            </div>
          )}
        </div>

        {/* Players Sidebar - Compact */}
        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 flex flex-col min-h-0 overflow-hidden">
           <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                 <Users size={16} className="text-pink-500" />
                 Lobby
              </h3>
              <span className="text-[10px] font-black text-slate-400">{players.length}</span>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
              {players.length > 0 ? players.sort((a: any, b: any) => b.score - a.score).map((p: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-pink-500 text-[10px] font-black text-white flex items-center justify-center shrink-0">
                         {idx + 1}
                      </div>
                      <p className="text-xs font-bold text-slate-200 truncate">{p.name}</p>
                   </div>
                   <span className="text-[10px] font-black text-pink-500 shrink-0">{p.score}</span>
                </div>
              )) : (
                <p className="text-center py-10 text-[10px] font-bold text-slate-500 uppercase italic tracking-widest">No players yet</p>
              )}
           </div>
          <div className="bg-pink-50/5 p-6 rounded-[2rem] border border-pink-500/10 border-dashed text-center mt-4">
             <p className="text-[10px] text-pink-500 font-black uppercase tracking-[0.2em] mb-2">Host Tips</p>
             <p className="text-xs text-slate-400 font-bold italic leading-relaxed">
                "Pangeran Nunu, buka layar utama di tab baru lalu tampilkan di proyektor ya! 💖"
             </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
