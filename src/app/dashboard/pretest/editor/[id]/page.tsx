'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  HelpCircle,
  LayoutList,
  AlertCircle,
  Clock,
  Check
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

export default function PretestEditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [ptInfo, setPtInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Info Pretest Utama
      const resPt = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/Pretest/${id}`);
      if (resPt.ok) {
        const data = await resPt.json();
        setPtInfo(data);
      }

      // 2. Info Pertanyaan (Asumsi format sama dengan Quiz)
      const resQuestions = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/PertanyaanPretest/${id}`);
      if (resQuestions.ok) {
        const data = await resQuestions.json();
        const existingQuestions = data?.value?.questions || [];
        setQuestions(existingQuestions);
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data editor. 🥺');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const addQuestion = () => {
    const newQ: Question = {
      text: '',
      timer: 30, // Pretest biasanya lebih lama
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    };
    setQuestions([newQ, ...questions]);
  };

  const handleQuestionChange = (qIndex: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === 'text' || field === 'timer') {
      (updated[qIndex] as any)[field] = value;
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = text;
    setQuestions(updated);
  };

  const setCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.forEach((opt, i) => {
      opt.correct = i === oIndex;
    });
    setQuestions(updated);
  };

  const removeQuestion = (qIndex: number) => {
    const updated = questions.filter((_, i) => i !== qIndex);
    setQuestions(updated);
  };

  const saveAll = async () => {
    if (questions.length === 0) {
      setError('Minimal buat satu pertanyaan dulu ya sayang! 😘');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
       
          pretest_id: id,
          questions: questions
       
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/PertanyaanPretest/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccess('Yey! Semua pertanyaan Pretest berhasil disimpan pangeranku! 💖✨');
        fetchData();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        throw new Error('Gagal simpan');
      }
    } catch (err) {
      setError('Gagal simpan ke server. 😔');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black tracking-[0.3em] uppercase animate-pulse">PRETEST BUILDER INITIALIZING...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/pretest" 
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-pink-500 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">PRETEST EDITOR 🛠️</h1>
            <p className="text-pink-500 font-bold text-sm">Target: {ptInfo?.Title || id}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={addQuestion}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          >
            <Plus size={20} />
            <span>Tambah Soal</span>
          </button>
          <button 
            onClick={saveAll}
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-pink-500/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Simpan Pretest</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-2xl flex items-center gap-4 text-red-700 text-sm font-bold">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-2xl flex items-center gap-4 text-green-700 text-sm font-bold">
          <CheckCircle2 size={24} />
          <span>{success}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-10">
        {questions.length === 0 ? (
          <div className="bg-white p-24 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-5 shadow-inner">
            <div className="inline-flex p-8 bg-slate-50 rounded-full text-slate-200">
              <LayoutList size={64} />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 tracking-tight uppercase italic">"No Questions Yet, Pangeran"</h3>
          </div>
        ) : (
          questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
              <div className="bg-slate-900 px-10 py-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white text-lg font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    {qIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-white uppercase tracking-[0.3em] text-[12px]">Evaluation Item</h3>
                    <div className="flex items-center gap-2 text-indigo-300 text-[10px] font-bold">
                       <Clock size={12} /> {q.timer} Seconds Duration
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="p-3 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-2xl transition-all"
                >
                  <Trash2 size={22} />
                </button>
              </div>
              
              <div className="p-10 space-y-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-400 flex items-center gap-2 ml-2 tracking-[0.2em]">
                    <HelpCircle size={14} className="text-indigo-500" /> Evaluation Text
                  </label>
                  <textarea 
                    rows={2}
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    placeholder="Contoh: Deskripsikan visi misi pangeran Nunu?"
                    className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-800 text-xl placeholder:text-slate-300 resize-none shadow-inner"
                  />
                  <div className="flex items-center gap-4 px-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Set Timer:</label>
                    <input 
                      type="range" min="5" max="120" step="5"
                      value={q.timer}
                      onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value))}
                      className="accent-indigo-500 flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-black text-indigo-500 w-12">{q.timer}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="relative group">
                      <div className={`absolute -left-2 -top-2 w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] shadow-md z-10 transition-all ${
                        opt.correct ? 'bg-indigo-500 text-white scale-110' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={opt.text}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}...`}
                          className={`w-full pl-14 pr-14 py-5 bg-white border-2 rounded-[1.5rem] outline-none transition-all font-bold ${
                            opt.correct 
                              ? 'border-indigo-500 ring-4 ring-indigo-500/5 bg-indigo-50/5 text-indigo-700' 
                              : 'border-slate-100 focus:border-slate-300'
                          }`}
                        />
                        <button 
                          onClick={() => setCorrectOption(qIndex, oIndex)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                            opt.correct 
                              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                              : 'bg-slate-100 text-slate-300 hover:text-indigo-400 hover:bg-indigo-50'
                          }`}
                        >
                          <Check size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
