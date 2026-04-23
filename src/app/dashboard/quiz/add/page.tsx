'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, Type, AlignLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function QuizAddPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    Image: 'https://picsum.photos/800/400?seed=' + Date.now(),
    UserID: user?.username || 'admin',
    Status: true
  });

  const generateId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `Quiz${timestamp}${randomStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newQuiz = {
      ...formData,
      id: generateId(),
      Slug: formData.Title.toLowerCase().replace(/ /g, '-') + '-' + Math.random().toString(36).substring(2, 5)
    };

    try {
      const response = await fetch('https://nudb.bungtemin.net/data/Quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuiz),
      });

      if (response.ok) {
        // Berhasil simpan detail kuis, lanjut ke editor pertanyaan
        router.push(`/dashboard/quiz/editor/${newQuiz.id}`);
      } else {
        throw new Error('Gagal menyimpan kuis baru');
      }
    } catch (err) {
      console.error(err);
      setError('Aduh sayang, gagal buat kuis baru. Coba cek koneksi API kita ya! 🥺');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/quiz" 
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-pink-500 hover:border-pink-200 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Buat Kuis Baru ✨</h1>
          <p className="text-slate-500 text-sm font-medium">Langkah 1: Isi detail dasar kuis pangeran Nunu.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Type size={14} className="text-pink-500" />
                Judul Kuis
              </label>
              <input 
                type="text" 
                required
                value={formData.Title}
                onChange={(e) => setFormData({...formData, Title: e.target.value})}
                placeholder="Contoh: Kuis Matematika Dasar"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-lg font-bold text-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <AlignLeft size={14} className="text-pink-500" />
                Deskripsi
              </label>
              <textarea 
                rows={4}
                value={formData.Description}
                onChange={(e) => setFormData({...formData, Description: e.target.value})}
                placeholder="Ceritakan sedikit tentang kuis ini sayang..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-medium text-slate-600 resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <ImageIcon size={14} className="text-pink-500" />
                URL Image Cover
              </label>
              <input 
                type="text" 
                value={formData.Image}
                onChange={(e) => setFormData({...formData, Image: e.target.value})}
                placeholder="https://..."
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-sm font-mono text-slate-500"
              />
              <p className="text-[10px] text-slate-400 italic font-medium ml-1">*Mas Nunu bisa pakai link gambar dari internet ya!</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6 shadow-xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-pink-500/20 transition-all duration-700"></div>
            
            <h3 className="font-bold text-lg flex items-center gap-2 relative z-10">
              <User size={18} className="text-pink-500" />
              Info Author
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Dibuat Oleh</p>
                <p className="font-bold text-pink-400">{user?.name || 'Pangeran Nunu'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Username</p>
                <p className="text-sm font-medium text-slate-300">@{formData.UserID}</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 relative z-10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Simpan & Buat Soal</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100">
            <p className="text-xs text-pink-700 italic leading-relaxed">
              "Kuis yang bagus dimulai dari judul yang mempesona, seperti mas Nunu di mata Nurani!" 💖
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
