'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, AlertCircle, Play, Users, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface OnlineQuiz {
  id: string;
  Title: string;
  Description: string;
  UserID: string;
  Image: string;
  Status: boolean;
  participantCount: number; // Placeholder
}

export default function OnlineQuizPage() {
  const [quizzes, setQuizzes] = useState<OnlineQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOnlineQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://nudb.bungtemin.net/data/Quiz'); // Menggunakan endpoint yang sama dengan Quiz Management
      if (!response.ok) throw new Error('Gagal mengambil data dari API');
      const data = await response.json();
      const quizList = data.value || [];
      
      // Filter hanya quiz dengan Status: true untuk Online Quiz
      const activeQuizzes = quizList.filter((q: any) => q.Status === true);
      
      // Tambahkan data placeholder jumlah peserta
      const quizzesWithParticipants = activeQuizzes.map((q: any) => ({
        ...q,
        participantCount: Math.floor(Math.random() * 200) + 50 // Random antara 50-250
      }));

      setQuizzes(quizzesWithParticipants);
    } catch (err) {
      console.error(err);
      setError('Maaf sayang, Nurani gagal memuat kuis online. 🥺');
    } finally {
      setLoading(false);
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

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="lg:col-span-3 min-h-[200px] flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500/20 border-t-pink-500"></div>
            <p className="text-slate-400 font-medium text-sm">Nurani lagi panggil kuis online-nya ya sayang... ✨</p>
          </div>
        ) : quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                {quiz.Image ? (
                  <img src={quiz.Image} alt={quiz.Title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Play size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                  <span className="bg-pink-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg shadow-pink-500/20">
                    LIVE NOW
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-pink-600 transition-colors">{quiz.Title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{quiz.Description || 'Yuk, mainkan kuis seru ini sekarang!'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Users size={16} />
                    <span>{quiz.participantCount.toLocaleString()} Peserta</span>
                  </div>
                  <Link 
                    href={`/play/${quiz.id}`}
                    className="flex items-center gap-2 text-pink-500 text-sm font-bold hover:underline group-hover:text-pink-600 transition-colors"
                  >
                    <LinkIcon size={16} />
                    <span>Mainkan</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-3 bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 italic">
            Belum ada kuis online yang aktif nih sayang. 🥺
          </div>
        )}
      </div>
    </div>
  );
}
