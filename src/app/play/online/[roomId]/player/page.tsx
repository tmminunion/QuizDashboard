'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { onlineQuizService } from '@/lib/onlineQuizService';
import { CheckCircle2, XCircle, Zap, Users, Trophy, Loader2 } from 'lucide-react';

export default function PlayerPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const [roomData, setRoomData] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Ambil data player dari localStorage
    const savedPlayer = localStorage.getItem(`quiz_player_${roomId}`);
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }

    const unsubscribe = onlineQuizService.listenToRoom(roomId as string, (data) => {
      setRoomData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  // Reset answer state when question changes
  useEffect(() => {
    setAnswered(false);
    setFeedback(null);
  }, [roomData?.currentQuestionIndex]);

  const handleAnswer = async (optionIdx: number) => {
    if (answered || roomData?.status !== 'playing' || !player) return;

    setAnswered(true);
    const currentQ = roomData.quiz.questions[roomData.currentQuestionIndex];
    const isCorrect = currentQ.options[optionIdx].correct;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Kirim skor ke Firebase
    await onlineQuizService.submitAnswer(roomId as string, player.playerNoreg, isCorrect, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-bold">
        <Loader2 className="animate-spin text-pink-500 mr-2" />
        Sabar ya pahlawan... ⚔️
      </div>
    );
  }

  // 1. PHASE: WAITING IN LOBBY
  if (roomData?.status === 'waiting') {
    return (
      <div className="min-h-screen bg-pink-500 flex flex-col items-center justify-center p-8 text-white text-center space-y-8">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
           <Zap size={48} className="fill-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic">YOU'RE IN!</h1>
          <p className="text-pink-100 font-bold uppercase tracking-widest text-sm">Lihat namamu di layar utama ya, {player?.playerName}!</p>
        </div>
        <div className="bg-black/10 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase">
           Waiting for Host to Start...
        </div>
      </div>
    );
  }

  // 2. PHASE: QUESTION (SHOW TEXT & OPTIONS)
  if (roomData?.status === 'playing') {
    if (feedback) {
      return (
        <div className={`min-h-screen ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'} flex flex-col items-center justify-center p-8 text-white text-center space-y-6 animate-in fade-in duration-500`}>
           {feedback === 'correct' ? (
             <>
               <div className="p-6 bg-white/20 rounded-full animate-bounce">
                <CheckCircle2 size={80} />
               </div>
               <h2 className="text-5xl font-black italic">GENIUS!</h2>
               <p className="text-xl font-bold opacity-80 uppercase tracking-widest">Jawabanmu tepat sasaran! 🔥</p>
             </>
           ) : (
             <>
               <div className="p-6 bg-white/20 rounded-full animate-pulse">
                <XCircle size={80} />
               </div>
               <h2 className="text-5xl font-black italic">OOPS!</h2>
               <p className="text-xl font-bold opacity-80 uppercase tracking-widest">Kurang beruntung sayang, ayo coba lagi! 💪</p>
             </>
           )}
           <p className="pt-10 text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">Tunggu soal berikutnya pahlawan...</p>
        </div>
      );
    }

    const currentQ = roomData.quiz.questions[roomData.currentQuestionIndex];

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col p-6 space-y-6 animate-in fade-in duration-500">
        {/* Question Header */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm text-center">
           <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest mb-2">Question {roomData.currentQuestionIndex + 1}</div>
           <h2 className="text-xl font-bold text-slate-800 leading-tight">
              {currentQ?.text}
           </h2>
        </div>

        {/* Options Grid */}
        <div className="flex-1 grid grid-cols-1 gap-4">
          {currentQ?.options?.map((opt: any, idx: number) => {
             const colors = [
               'bg-red-500 shadow-red-500/20 active:bg-red-600',
               'bg-blue-500 shadow-blue-500/20 active:bg-blue-600',
               'bg-yellow-500 shadow-yellow-500/20 active:bg-yellow-600',
               'bg-green-500 shadow-green-500/20 active:bg-green-600'
             ];
             const shapes = ['▲', '◆', '●', '■'];
             return (
               <button 
                 key={idx}
                 onClick={() => handleAnswer(idx)}
                 className={`${colors[idx]} rounded-3xl p-6 flex items-center gap-6 text-white text-left shadow-lg transition-all active:scale-95 group relative overflow-hidden`}
               >
                 <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-125 transition-transform">
                    <span className="text-8xl font-black">{shapes[idx]}</span>
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-black flex-shrink-0">
                    {shapes[idx]}
                 </div>
                 <span className="text-lg font-black tracking-tight leading-snug">{opt.text}</span>
               </button>
             );
          })}
        </div>

        <div className="text-center">
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Choose the best answer, pahlawan!</p>
        </div>
      </div>
    );
  }

  // 3. PHASE: FINISHED
  if (roomData?.status === 'finished') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8 text-white text-center space-y-8">
        <Trophy size={100} className="text-yellow-400" />
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic">GAME OVER</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Lihat siapa pemenangnya di layar utama!</p>
        </div>
        <button 
          onClick={() => router.push('/play/online/join')}
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm"
        >
          Play Again
        </button>
      </div>
    );
  }

  return null;
}
