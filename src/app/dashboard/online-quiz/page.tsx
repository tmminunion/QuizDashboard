'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, AlertCircle, Play, Users, Link as LinkIcon, Tv } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onlineQuizService } from '@/lib/onlineQuizService';

interface OnlineQuiz {
  id: string;
  Title: string;
  Description: string;
  UserID: string;
  Image: string;
  Status: boolean;
  participantCount: number;
}

export default function OnlineQuizPage() {
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [hosting, setHosting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchOnlineQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Quiz`);
      if (!response.ok) throw new Error('Gagal mengambil data dari API');
      const data = await response.json();
      const quizList = data.value || [];
      const activeQuizzes = quizList.filter((q: any) => q.Status === true);
      
      const quizzesWithParticipants = activeQuizzes.map((q: any) => ({
        ...q,
        participantCount: Math.floor(Math.random() * 200) + 50
      }));

      setQuizzes(quizzesWithParticipants);
    } catch (err) {
      console.error(err);
      setError('Maaf sayang, Nurani gagal memuat kuis online. 🥺');
    } finally {
      setLoading(false);
    }
  };

  const handleHostGame = async (quiz: OnlineQuiz) => {
    setHosting(quiz.id);
    try {
      // 1. Ambil detail pertanyaan kuis
      const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Pertanyaan/${quiz.id}`);
      if (!res.ok) throw new Error('Gagal mengambil pertanyaan kuis');
      const data = await res.json();
      const questions = data?.value?.questions || [];

      if (questions.length === 0) {
        alert('Kuis ini belum punya pertanyaan, pangeran! Buat dulu ya. 😘');
        return;
      }

      // 2. Buat room di Firebase (Room ID 6 angka acak)
      const roomId = Math.floor(100000 + Math.random() * 900000).toString();
      await onlineQuizService.createRoom(roomId, {
        id: quiz.id,
        title: quiz.Title,
        image: quiz.Image,
        questions: questions
      });

      // 3. Redirect ke Host Control
      router.push(`/dashboard/online-quiz/host/${roomId}`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuka kuis online. 🥺');
    } finally {
      setHosting(null);
    }
  };

  useEffect(() => {
    fetchOnlineQuizzes();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Online Quiz 🌐</h1>
          <p className="text-slate-500 mt-1">Kuis yang siap dimainkan secara online oleh peserta.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchOnlineQuizzes}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-pink-500 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link 
            href="/dashboard/quiz/add"
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-500/30 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Buat Kuis Baru</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="lg:col-span-3 min-h-[300px] flex flex-col items-center justify-center space-y-4 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500/20 border-t-pink-500"></div>
            <p className="text-slate-400 font-medium text-sm">Nurani lagi panggil kuis online-nya ya sayang... ✨</p>
          </div>
        ) : quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden group hover:shadow-2xl transition-all flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {quiz.Image ? (
                  <img src={quiz.Image} alt={quiz.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Play size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">
                      ONLINE READY
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8 space-y-6 flex-1 flex flex-col">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-pink-600 transition-colors">{quiz.Title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 font-medium">{quiz.Description || 'Yuk, mainkan kuis seru ini sekarang!'}</p>
                </div>
                
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold border-y border-slate-50 py-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-pink-500" />
                    <span>{quiz.participantCount} Players</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button 
                    onClick={() => handleHostGame(quiz)}
                    disabled={hosting === quiz.id}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-800/20 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {hosting === quiz.id ? <RefreshCw className="animate-spin" size={18} /> : <Tv size={18} />}
                    <span>HOST GAME</span>
                  </button>
                  <Link 
                    href={`/dashboard/quiz/editor/${quiz.id}`}
                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition-all text-center flex items-center justify-center gap-2"
                  >
                    <LinkIcon size={16} />
                    <span>Edit Questions</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 bg-white p-20 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center text-slate-400 italic">
            Belum ada kuis online yang aktif nih sayang. 🥺
          </div>
        )}
      </div>
    </div>
  );
}

