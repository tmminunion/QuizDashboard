'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Loader2, 
  Clock, 
  Trophy, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Home,
  RefreshCcw,
  Zap,
  Check,
  X,
  Coins
} from 'lucide-react';
import Link from 'next/link';

interface Option {
  text: string;
  correct: boolean;
}

interface Question {
  text: string;
  timer: number;
  options: Option[];
}

export default function PlaySessionPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [lastBonus, setLastBonus] = useState(0);

  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`https://nudb.bungtemin.net/data/Pertanyaan/${id}`);
        if (res.ok) {
          const data = await res.json();
          let list = data?.value?.questions || [];
          
          if (list.length > 0) {
            list = shuffleArray(list);
            list = list.map((q: Question) => ({
              ...q,
              options: shuffleArray(q.options)
            }));
            setQuestions(list);
            setTimeLeft(list[0].timer || 15);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  useEffect(() => {
    if (isFinished || loading || showFeedback || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleAnswer(null, true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished, loading, showFeedback]);

  const handleAnswer = (optionIndex: number | null, isTimeout = false) => {
    if (selectedOption !== null || showFeedback) return;
    
    setSelectedOption(optionIndex);
    
    let isCorrect = false;
    if (!isTimeout && optionIndex !== null) {
      isCorrect = questions[currentIndex].options[optionIndex].correct;
    }

    if (isCorrect) {
      const bonus = timeLeft * 50;
      const pointEarned = 1000 + bonus;
      setTotalScore((prev) => prev + pointEarned);
      setCorrectCount((prev) => prev + 1);
      setLastBonus(bonus);
      setShowFeedback('correct');
    } else {
      setLastBonus(0);
      setShowFeedback('wrong');
    }
    
    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setShowFeedback(null);
      setLastBonus(0);
      setTimeLeft(questions[nextIndex].timer || 15);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black tracking-widest uppercase animate-pulse">Syncing Arena...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-xl w-full animate-in zoom-in duration-500">
          <div className="bg-white rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden text-center">
             <div className="bg-slate-900 p-12 text-white space-y-4">
                <div className="inline-flex p-6 bg-pink-500 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.5)] mb-2">
                   <Trophy size={48} className="fill-white" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Kuis Selesai!</h2>
                <p className="text-pink-400 font-bold text-sm italic">"Pangeran Nunu luar biasa!"</p>
             </div>
             
             <div className="p-12 space-y-10">
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Total Score</p>
                   <p className="text-6xl font-black text-slate-800 drop-shadow-sm">{totalScore.toLocaleString()}</p>
                   <div className="flex items-center gap-4 mt-2">
                      <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold border border-green-100">
                        {correctCount} Benar
                      </div>
                      <div className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                        {questions.length - correctCount} Salah
                      </div>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={() => window.location.reload()} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 rounded-2xl font-bold transition-all border-2 border-slate-200">
                     <RefreshCcw size={18} />
                     <span>REPLAY</span>
                   </button>
                   <Link href="/" className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg">
                     <Home size={18} />
                     <span>EXIT</span>
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center relative overflow-hidden">
       
       {/* Feedback Overlay */}
       {showFeedback && (
         <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center animate-in zoom-in fade-in duration-300 ${
           showFeedback === 'correct' ? 'bg-green-500/90' : 'bg-red-500/90'
         }`}>
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 transform animate-bounce">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white ${
                showFeedback === 'correct' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {showFeedback === 'correct' ? <Check size={64} strokeWidth={4} /> : <X size={64} strokeWidth={4} />}
              </div>
              <div className="text-center">
                 <h1 className={`text-5xl font-black uppercase tracking-tighter ${
                   showFeedback === 'correct' ? 'text-green-600' : 'text-red-600'
                 }`}>
                   {showFeedback === 'correct' ? 'BENAR! 🥳' : 'SALAH! 🥺'}
                 </h1>
                 {showFeedback === 'correct' && (
                    <p className="text-green-500 font-black text-xl mt-2 animate-pulse">
                       +{(1000 + lastBonus).toLocaleString()} Pts
                    </p>
                 )}
              </div>
           </div>
         </div>
       )}

       <div className="w-full max-w-3xl flex-1 flex flex-col p-4 md:p-8 relative z-10">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-lg mb-6 shrink-0 relative overflow-hidden">
             <div className="absolute top-0 left-0 h-1 bg-pink-500 transition-all duration-700" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
             
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">
                   {currentIndex + 1}
                </div>
                <div className="flex flex-col">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cumulative Score</p>
                   <p className="font-black text-pink-600 text-lg leading-none">{totalScore.toLocaleString()}</p>
                </div>
             </div>

             <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl font-black ${timeLeft <= 5 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-slate-50 text-slate-700'}`}>
                <Clock size={18} />
                <span className="text-xl font-mono leading-none">{timeLeft}s</span>
             </div>
          </div>

          {/* Arena Soal */}
          <div className="flex-1 overflow-y-auto no-scrollbar rounded-[2.5rem] bg-white border border-slate-200 shadow-xl flex flex-col">
             <div className="p-8 md:p-12 space-y-10 flex-1 flex flex-col justify-center">
                <div className="text-center space-y-2">
                   <div className="inline-flex items-center gap-2 text-pink-500 font-black text-[10px] uppercase tracking-[0.3em]">
                      <Zap size={12} className="fill-pink-500" /> Question {currentIndex + 1} of {questions.length}
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                      {currentQ.text}
                   </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto w-full">
                   {currentQ.options.map((opt, oIndex) => {
                      const isSelected = selectedOption === oIndex;
                      return (
                        <button
                          key={oIndex}
                          disabled={selectedOption !== null}
                          onClick={() => handleAnswer(oIndex)}
                          className={`group flex items-center gap-4 p-4 rounded-[1.2rem] transition-all duration-300 text-left font-bold border-2 ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-900 text-white scale-[0.98]' 
                              : 'bg-white border-slate-100 hover:border-pink-500 hover:bg-pink-50/5 text-slate-700'
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] transition-all ${
                            isSelected ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-500'
                          }`}>
                             {String.fromCharCode(65 + oIndex)}
                          </div>
                          <span className="flex-1 text-sm md:text-base leading-relaxed">{opt.text}</span>
                        </button>
                      );
                   })}
                </div>
             </div>
          </div>

          <div className="text-center pt-6 pb-2 shrink-0">
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">
                "Speed is Power, Pangeranku!" ⚡🏆
             </p>
          </div>
       </div>

       <style jsx global>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       `}</style>
    </div>
  );
}
