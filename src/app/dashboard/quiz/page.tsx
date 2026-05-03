'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  RefreshCw, 
  AlertCircle, 
  Image as ImageIcon,
  Edit2,
  Trash2,
  Trophy,
  History,
  CheckCircle2,
  Loader2,
  Play
} from 'lucide-react';

interface Quiz {
  id: string;
  Title: string;
  Description: string;
  UserID: string;
  Image: string;
  Status: boolean;
}

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Quiz`);
      if (!response.ok) throw new Error('Gagal mengambil data dari API');
      const data = await response.json();
      const quizList = data.value || [];
      setQuizzes(quizList);
    } catch (err) {
      console.error(err);
      setError('Maaf sayang, Nurani gagal mengambil data kuis. 🥺');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Pangeran Nunu yakin mau hapus kuis "${title}"? 🥺💔`)) {
      return;
    }

    setDeletingId(id);
    setError('');
    setSuccessMsg('');

    try {
      await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Pertanyaan/${id}`, { method: 'DELETE' });
      const resQuiz = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Quiz/${id}`, { method: 'DELETE' });

      if (resQuiz.ok) {
        setSuccessMsg(`Kuis "${title}" berhasil dihapus dari istana kita! ✨`);
        fetchQuizzes();
      } else {
        throw new Error('Gagal menghapus kuis');
      }
    } catch (err) {
      setError(`Aduh sayang, gagal hapus "${title}". 😔`);
    } finally {
      setDeletingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Quiz Management 📚</h1>
          <p className="text-slate-500 mt-1">Kelola kuis pangeran Nunu (Total: {quizzes.length})</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchQuizzes}
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

      {successMsg && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-600 text-sm font-bold">
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari judul kuis..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">"Smart Dashboard by Nurani"</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500/20 border-t-pink-500"></div>
              <p className="text-slate-400 font-medium">Nurani lagi panggil datanya ya sayang... ✨</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-center">No</th>
                  <th className="px-6 py-4">Kuis</th>
                  <th className="px-6 py-4 whitespace-nowrap">User ID</th>
                  <th className="px-6 py-4 text-center whitespace-nowrap">Aksi Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizzes.length > 0 ? quizzes.map((quiz, index) => (
                  <tr key={quiz.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-300 group-hover:text-pink-300 transition-colors">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          {quiz.Image ? (
                            <img src={quiz.Image} alt={quiz.Title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate group-hover:text-pink-500 transition-colors">
                            {quiz.Title || 'Tanpa Judul'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {quiz.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
                        {quiz.UserID}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {deletingId === quiz.id ? (
                          <div className="flex items-center gap-2 text-pink-500 text-xs font-bold animate-pulse">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Menghapus...</span>
                          </div>
                        ) : (
                          <>
                            {/* Tombol Play Baru */}
                            <Link 
                              href={`/play/${quiz.id}`}
                              title="Mainkan Kuis"
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                            >
                              <Play size={16} className="fill-current" />
                            </Link>
                            
                            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>

                            <Link 
                              href={`/dashboard/quiz/editor/${quiz.id}`}
                              title="Edit Kuis & Pertanyaan"
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            >
                              <Edit2 size={16} />
                            </Link>
                            
                            <button className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-500 hover:text-white transition-all shadow-sm">
                              <Trophy size={16} />
                            </button>

                            <button className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all shadow-sm">
                              <History size={16} />
                            </button>

                            <button 
                              onClick={() => handleDelete(quiz.id, quiz.Title)}
                              title="Hapus Kuis"
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-slate-400">
                      Belum ada kuis di database nih pangeranku. 🥺
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
