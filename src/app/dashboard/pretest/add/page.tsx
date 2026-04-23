'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2, Calendar, Type, AlignLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function PretestAddPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    DateStart: new Date().toISOString().split('T')[0],
    UserID: user?.username || 'admin',
    Status: true
  });

  const generateId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `Pretest${timestamp}${randomStr}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
const idna = generateId();
    const newPretest = {
      ...formData,
      id: idna,
      Slug: idna,
    };

    try {
      const response = await fetch(
        "https://nudb.bungtemin.net/data/Pretest/" + idna,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPretest),
        },
      );

      if (response.ok) {
        router.push(`/dashboard/pretest/editor/${newPretest.id}`);
      } else {
        throw new Error('Gagal simpan');
      }
    } catch (err) {
      setError('Gagal buat Pretest baru sayang. 🥺');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard/pretest" 
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-pink-500 transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Buat Pretest Baru 📋</h1>
          <p className="text-slate-500 text-sm font-medium italic">"Mempersiapkan masa depan yang cerah bersama mas Nunu"</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <Type size={14} className="text-pink-500" /> Nama Pretest
              </label>
              <input 
                type="text" required
                value={formData.Title}
                onChange={(e) => setFormData({...formData, Title: e.target.value})}
                placeholder="Misal: Evaluasi Kemampuan Dasar - Batch April"
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-pink-500/5 focus:border-pink-500 transition-all text-xl font-bold text-slate-800"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                <AlignLeft size={14} className="text-pink-500" /> Deskripsi Evaluasi
              </label>
              <textarea 
                rows={4}
                value={formData.Description}
                onChange={(e) => setFormData({...formData, Description: e.target.value})}
                placeholder="Tuliskan petunjuk atau detail untuk peserta ya sayang..."
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] outline-none focus:ring-8 focus:ring-pink-500/5 focus:border-pink-500 transition-all text-sm font-medium text-slate-600 resize-none"
              />
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                  <Calendar size={14} className="text-pink-500" /> Tanggal Mulai
                </label>
                <input 
                  type="date" 
                  value={formData.DateStart}
                  onChange={(e) => setFormData({...formData, DateStart: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] outline-none focus:border-pink-500 transition-all font-bold text-slate-700"
                />
              </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl group-hover:bg-pink-500/20 transition-all duration-1000"></div>
            
            <h3 className="font-black text-xl flex items-center gap-2 relative z-10 italic">
              ACTION CENTER 🚀
            </h3>
            
            <div className="space-y-6 relative z-10">
               <div>
                  <p className="text-[10px] uppercase text-slate-500 font-black tracking-widest mb-1">Author</p>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-500">
                        <User size={14} />
                     </div>
                     <span className="font-bold text-pink-400">@{formData.UserID}</span>
                  </div>
               </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-5 rounded-[1.5rem] font-black shadow-lg shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 relative z-10"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              <span>START BUILDER</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
