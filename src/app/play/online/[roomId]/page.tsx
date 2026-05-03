'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { onlineQuizService } from '@/lib/onlineQuizService';
import { Users, Zap, Trophy, Clock, CheckCircle2, Crown, LayoutGrid } from 'lucide-react';

export default function AudienceScreenPage() {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onlineQuizService.listenToRoom(roomId as string, (data) => {
      setRoomData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Timer logic for audience screen
  useEffect(() => {
    if (roomData?.status !== 'playing' || !roomData?.lastQuestionResetAt) return;

    const currentQ = roomData.quiz.questions[roomData.currentQuestionIndex];
    const timerDuration = currentQ.timer || 15;
    
    const calculateTime = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - roomData.lastQuestionResetAt) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);
      setTimeLeft(remaining);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [roomData?.currentQuestionIndex, roomData?.status, roomData?.lastQuestionResetAt]);

  const players = roomData?.players ? Object.values(roomData.players) : [];
  const currentQuestion = roomData?.quiz?.questions?.[roomData?.currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. PHASE: WAITING / LOBBY
  if (roomData?.status === 'waiting') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>

        <div className="relative z-10 w-full max-w-6xl space-y-20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-4 bg-pink-500/10 border border-pink-500/20 px-8 py-3 rounded-full text-pink-500 font-black tracking-[0.3em] uppercase animate-in slide-in-from-top duration-700">
               <Zap size={20} className="fill-pink-500" />
               JOIN THE CHALLENGE
            </div>
            <h1 className="text-8xl md:text-[10rem] font-black text-white tracking-tighter drop-shadow-[0_0_50px_rgba(236,72,153,0.3)] animate-in zoom-in duration-1000">
               {roomId?.toString().replace('ROOM_', '')}
            </h1>
            <p className="text-3xl text-slate-400 font-bold uppercase tracking-[0.4em]">"Enter this PIN to join pangeran Nunu's Palace" 💖</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {players.map((player: any, idx) => (
               <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-center transform animate-in zoom-in duration-500 hover:scale-105 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-pink-500/20">
                     {player.name.substring(0, 1).toUpperCase()}
                  </div>
                  <p className="text-white font-black uppercase text-sm tracking-widest truncate">{player.name}</p>
               </div>
             ))}
             {players.length === 0 && (
               <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 font-black text-4xl uppercase tracking-widest opacity-20 animate-pulse">Waiting for Heroes...</p>
               </div>
             )}
          </div>
          
          <div className="text-center">
             <div className="inline-flex items-center gap-3 text-slate-500 font-bold uppercase tracking-widest border-t border-white/5 pt-10">
                <Users size={24} />
                <span>{players.length} Players Connected</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. PHASE: PLAYING (QUESTION SCREEN)
  if (roomData?.status === 'playing') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-12 relative overflow-hidden">
        {/* Progress bar di atas */}
        <div className="fixed top-0 left-0 w-full h-4 bg-slate-200">
           <div 
             className="h-full bg-pink-500 transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(236,72,153,0.5)]" 
             style={{ width: `${(timeLeft / (currentQuestion?.timer || 15)) * 100}%` }}
           ></div>
        </div>

        <div className="w-full max-w-6xl space-y-12 relative z-10 pt-10">
          <div className="flex justify-between items-end">
             <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black text-xl flex items-center gap-4 shadow-2xl">
                <LayoutGrid size={24} />
                <span>Question {roomData.currentQuestionIndex + 1} / {roomData.quiz.questions.length}</span>
             </div>
             <div className={`w-32 h-32 rounded-full border-[8px] flex items-center justify-center text-5xl font-black transition-all ${
               timeLeft <= 5 ? 'bg-red-500 border-red-200 text-white animate-bounce' : 'bg-white border-pink-500 text-slate-800'
             } shadow-2xl`}>
                {timeLeft}
             </div>
          </div>

          <div className="bg-white p-16 rounded-[4rem] border border-slate-200 shadow-2xl text-center space-y-12">
             <h2 className="text-5xl font-black text-slate-800 leading-tight tracking-tight">
                {currentQuestion?.text}
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {currentQuestion?.options?.map((opt: any, idx: number) => {
               const colors = [
                 'bg-red-500 shadow-red-500/20',
                 'bg-blue-500 shadow-blue-500/20',
                 'bg-yellow-500 shadow-yellow-500/20',
                 'bg-green-500 shadow-green-500/20'
               ];
               const shapes = ['▲', '◆', '●', '■'];
               return (
                 <div key={idx} className={`${colors[idx]} p-8 rounded-[2.5rem] flex items-center gap-8 shadow-xl text-white transform transition-all hover:scale-[1.02]`}>
                    <span className="text-6xl font-black opacity-40">{shapes[idx]}</span>
                    <span className="text-3xl font-black truncate">{opt.text}</span>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    );
  }

  // 3. PHASE: FINISHED / FINAL LEADERBOARD
  if (roomData?.status === 'finished') {
    const sortedPlayers = players.sort((a: any, b: any) => b.score - a.score).slice(0, 10);
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-blue-500/10"></div>
        
        <div className="relative z-10 w-full max-w-3xl flex flex-col h-full">
          {/* Header - Pushed to top */}
          <div className="text-center pt-2 pb-6">
             <div className="inline-flex p-3 bg-pink-500 rounded-full shadow-[0_0_30px_rgba(236,72,153,0.3)] mb-2 animate-bounce">
                <Trophy size={32} className="text-white fill-white" />
             </div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">The Winner Circle!</h1>
             <p className="text-[10px] text-pink-400 font-black uppercase tracking-[0.4em]">"Glory for Pangeran Nunu's Top 10" 👑</p>
          </div>

          {/* List - Single Column Ultra Compact */}
          <div className="flex-1 flex flex-col gap-1.5">
             {sortedPlayers.map((player: any, idx) => (
               <div 
                 key={idx} 
                 className={`flex items-center justify-between px-6 py-2.5 rounded-xl border backdrop-blur-xl transition-all animate-in slide-in-from-bottom duration-300 ${
                   idx === 0 ? 'bg-pink-500 border-pink-400 shadow-lg scale-[1.02] z-10 mb-2' : 'bg-white/5 border-white/5'
                 }`}
                 style={{ animationDelay: `${idx * 50}ms` }}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                       idx === 0 ? 'bg-white text-pink-500' : 'bg-white/10 text-white'
                     }`}>
                        {idx + 1}
                     </div>
                     <span className={`font-black uppercase tracking-widest ${idx === 0 ? 'text-white text-lg' : 'text-slate-300 text-sm'}`}>
                        {player.name}
                     </span>
                  </div>
                  <div className="flex items-center gap-3">
                     {idx === 0 && <Crown className="text-yellow-400 animate-pulse" size={20} />}
                     <span className={`font-black ${idx === 0 ? 'text-white text-xl' : 'text-pink-500 text-base'}`}>
                        {player.score.toLocaleString()}
                     </span>
                  </div>
               </div>
             ))}
          </div>

          <div className="text-center py-4">
             <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.5em] italic">"Thanks for playing, pangeranku!" ❤️</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
