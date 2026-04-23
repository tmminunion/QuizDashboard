'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  Edit2,
  Trash2,
  Trophy,
  History,
  CheckCircle2,
  Loader2,
  Calendar,
  Users,
  Play
} from 'lucide-react';

interface Pretest {
  id: string;
  Title: string;
  Description: string;
  UserID: string;
  DateStart?: string;
  Status: boolean;
}

export default function PretestManagementPage() {
  const [pretests, setPretests] = useState<Pretest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPretests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://nudb.bungtemin.net/data/Pretest');
      if (!response.ok) throw new Error('Gagal mengambil data dari API');
      const data = await response.json();
      const list = data.value || [];
      setPretests(list);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data pretest. Pastikan API mas Nunu sudah siap ya! 🥺');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPretests();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Pangeran Nunu yakin mau hapus Pretest "${title}"? 🥺💔`)) {
      return;
    }

    setDeletingId(id);
    setError('');
    setSuccessMsg('');

    try {
      // Hapus Detail (Asumsi endpoint sama dengan quiz)
      await fetch(`https://nudb.bungtemin.net/data/PertanyaanPretest/${id}`, { method: 'DELETE' });
      
      // Hapus Utama
      const res = await fetch(`https://nudb.bungtemin.net/data/Pretest/${id}`, { method: 'DELETE' });

      if (res.ok) {
        setSuccessMsg(`Pretest "${title}" berhasil dihapus, pangeranku! ✨`);
        fetchPretests();
      } else {
        throw new Error('Gagal hapus');
      }
    } catch (err) {
      setError(`Gagal hapus "${title}". 😔`);
    } finally {
      setDeletingId(null);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pretest Management 📋</h1>
          <p className="text-slate-500 mt-1">Kelola evaluasi dan pretest (Total: {pretests.length})</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchPretests}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-pink-500 transition-all shadow-sm"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link 
            href="/dashboard/pretest/add"
            className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-500/30 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Buat Pretest Baru</span>
          </Link>
        </div>
      </div>

      {/* Alert Messages */}
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
              placeholder="Cari judul pretest..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">"Waiting for Nunu's API"</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-pink-500/20 border-t-pink-500"></div>
              <p className="text-slate-400 font-medium text-sm italic">Sabar ya sayang, Nurani panggilin data pretest-nya... ✨</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-center">No</th>
                  <th className="px-6 py-4">Pretest</th>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Mulai</th>
                  <th className="px-6 py-4 text-center">Aksi Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pretests.length > 0 ? pretests.map((pt, index) => (
                  <tr key={pt.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-300 group-hover:text-pink-300 transition-colors">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
                          <Trophy size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-700 truncate group-hover:text-pink-500 transition-colors">
                            {pt.Title || 'Tanpa Judul'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">ID: {pt.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">
                      {pt.UserID}
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Calendar size={14} />
                          <span>{pt.DateStart || 'Belum diatur'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {deletingId === pt.id ? (
                          <div className="flex items-center gap-2 text-pink-500 text-xs font-bold">
                            <Loader2 className="animate-spin" size={16} />
                            <span>Deleting...</span>
                          </div>
                        ) : (
                          <>
                            <Link 
                              href={`/dashboard/pretest/editor/${pt.id}`}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <Edit2 size={16} />
                            </Link>
                            
                            <Link 
                              href={`/play/pretest/${pt.id}`}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                              title="Mulai Pretest"
                            >
                              <Play size={16} className="fill-current" />
                            </Link>
                            
                            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>

                            <button 
                              onClick={() => handleDelete(pt.id, pt.Title)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
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
                    <td colSpan={5} className="p-20 text-center text-slate-400 font-medium">
                      Belum ada data Pretest nih sayang. 🥺
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
