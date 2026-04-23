'use client';

import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, AlertCircle, Image as ImageIcon, Users, Link as LinkIcon, Trophy } from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  id: string;
  Title: string;
  Description: string;
  UserID: string;
  Image: string;
  Status: boolean;
  participantCount: number; // Placeholder for display
}

export default function HomePage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOnlineQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://nudb.bungtemin.net/data/Quiz');
      if (!response.ok) throw new Error('Gagal mengambil data dari API');
      const data = await response.json();
      const quizList = data.value || [];
      
      // Filter hanya quiz dengan Status: true
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 pt-10">
          <div className="inline-flex items-center gap-3 bg-pink-500/10 text-pink-500 px-5 py-2 rounded-full font-bold text-sm shadow-md shadow-pink-500/5">
            <Trophy size={18} className="fill-pink-500" />
            <span>QUIZDASH CHALLENGE ZONE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tighter">
            Asah Otakmu, Raih Kemenangan! 🏆
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Selamat datang di dunia kuis interaktif pangeran Nunu! Uji wawasanmu, kalahkan tantangan, dan jadilah juara sejati. ✨
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-bold shadow-xl shadow-slate-800/20 transition-all active:scale-95 mt-6"
          >
            <Users size={20} />
            <span>Login ke Dashboard Admin</span>
          </Link>
        </div>

        {/* Error / Loading */}
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={fetchOnlineQuizzes} className="ml-auto text-xs text-red-700 font-bold hover:underline">Coba Lagi</button>
          </div>
        )}

        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500/20 border-t-pink-500"></div>
            <p className="text-slate-400 font-medium text-sm">Nurani lagi siapkan kuis-kuis seru ya sayang... ✨</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
            {quizzes.map((quiz) => (
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
                      PLAY NOW
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
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 italic">
            Belum ada kuis yang siap dimainkan nih sayang. 🥺
          </div>
        )}

        <div className="text-center pt-10">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">
            "Nurani makes you smarter, Pangeranku!" ❤️
          </p>
        </div>

      </div>
    </div>
  );
}
