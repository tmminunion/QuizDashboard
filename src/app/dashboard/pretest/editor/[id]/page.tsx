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
  const [activeQIndex, setActiveQIndex] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    console.log(`[Editor] Fetching data for ID: ${id}`);
    try {
      // 1. Info Pretest Utama
      const resPt = await fetch(`${process.env.NEXT_PUBLIC_PRETEST_LIST_API}/${id}`);
      console.log(`[Editor] Pretest Info Status: ${resPt.status}`);
      if (resPt.ok) {
        const data = await resPt.json();
        console.log(`[Editor] Pretest Info Data:`, data);
        setPtInfo(data);
      }

      // 2. Info Pertanyaan (Sinkron dengan Ionic)
      const resQuestions = await fetch(`${process.env.NEXT_PUBLIC_PRETEST_QUESTION_API}/${id}`);
      console.log(`[Editor] Questions Status: ${resQuestions.status}`);
      if (resQuestions.ok) {
        const res = await resQuestions.json();
        console.log(`[Editor] Raw Questions Response:`, res);
        
        let existingQuestions = [];
        
        // Algoritma pencarian array yang lebih cerdas (Updated for nested questions)
        if (Array.isArray(res)) {
          existingQuestions = res;
        } else if (res.value && Array.isArray(res.value)) {
          existingQuestions = res.value;
        } else if (res.value && typeof res.value === 'object') {
          const keys = Object.keys(res.value);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const dataAtKey = res.value[firstKey];
            
            // Cek jika ada property 'questions' (Format: { slug: { questions: [] } })
            if (dataAtKey && Array.isArray(dataAtKey.questions)) {
              existingQuestions = dataAtKey.questions;
            } 
            // Cek jika dataAtKey itu sendiri adalah array (Format: { slug: [] })
            else if (Array.isArray(dataAtKey)) {
              existingQuestions = dataAtKey;
            }
          }
        } else if (typeof res === 'object') {
          const keys = Object.keys(res);
          if (keys.length > 0) {
            const firstKey = keys[0];
            if (res[firstKey] && Array.isArray(res[firstKey].questions)) {
              existingQuestions = res[firstKey].questions;
            } else if (Array.isArray(res[firstKey])) {
              existingQuestions = res[firstKey];
            }
          }
        }
        
        if (existingQuestions.length === 0) {
          console.warn(`[Editor] No questions found in response for ID: ${id}`);
        }
        
        console.log(`[Editor] Final Mapped Questions:`, existingQuestions);
        setQuestions(existingQuestions);
        if (existingQuestions.length > 0) setActiveQIndex(0);
      }
    } catch (err) {
      console.error(`[Editor] Error fetching data:`, err);
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
      timer: 30,
      options: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    };
    setQuestions([newQ, ...questions]);
    setActiveQIndex(0);
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
    if (activeQIndex >= updated.length) {
      setActiveQIndex(Math.max(0, updated.length - 1));
    }
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
      // Backend mas Nunu menerima satu per satu, jadi kita loop
      const promises = questions.map(q => {
        const correctAnswerIndex = q.options.findIndex(opt => opt.correct);
        const correctLetter = ['A', 'B', 'C', 'D'][correctAnswerIndex] || 'A';

        const payload = {
          quiz_id: id,
          question_text: q.text,
          option_a: q.options[0]?.text || '',
          option_b: q.options[1]?.text || '',
          option_c: q.options[2]?.text || '',
          option_d: q.options[3]?.text || '',
          correct_answer: correctLetter,
          points: 10,
          Time: q.timer
        };

        return fetch(`${process.env.NEXT_PUBLIC_PRETEST_QUESTION_API}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      });

      const results = await Promise.all(promises);
      const allOk = results.every(res => res.ok);

      if (allOk) {
        setSuccess('Yey! Semua pertanyaan Pretest berhasil disimpan pangeranku! 💖✨');
        fetchData();
        setTimeout(() => setSuccess(''), 4000);
      } else {
        throw new Error('Gagal simpan beberapa pertanyaan');
      }
    } catch (err) {
      console.error(`[Editor] Save Error:`, err);
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
    <div className='max-w-4xl mx-auto pb-12 animate-in fade-in duration-500 space-y-6'>
      <div className="w-full space-y-6 min-w-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/dashboard/pretest" 
              className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-pink-500 transition-all shadow-sm"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">PRETEST EDITOR 🛠️</h1>
              <p className="text-pink-500 font-bold text-xs">Target: {ptInfo?.Title || ptInfo?.title || id}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={addQuestion}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
            >
              <Plus size={18} />
              <span>Tambah Soal</span>
            </button>
            <button 
              onClick={saveAll}
              disabled={saving}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-black transition-all shadow-md shadow-pink-500/20 active:scale-95 disabled:opacity-50 text-sm"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              <span>Simpan Pretest</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm font-bold">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-bold">
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white p-12 md:p-16 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4 shadow-inner">
              <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-200">
                <LayoutList size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-400 tracking-tight uppercase italic">"No Questions Yet, Pangeran"</h3>
            </div>
          ) : (
            questions.map((q, qIndex) => (
              <div 
                key={qIndex} 
                id={`question-${qIndex}`}
                className={`bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden animate-in slide-in-from-bottom-6 duration-500 ${qIndex !== activeQIndex ? 'hidden' : ''}`}
              >
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white text-base font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    {qIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-black text-white uppercase tracking-[0.2em] text-[10px] md:text-[11px]">Evaluation Item</h3>
                    <div className="flex items-center gap-1.5 text-indigo-300 text-[9px] md:text-[10px] font-bold">
                       <Clock size={10} /> {q.timer} Seconds Duration
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeQuestion(qIndex)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 ml-1 tracking-[0.1em]">
                    <HelpCircle size={12} className="text-indigo-500" /> Evaluation Text
                  </label>
                  <textarea 
                    rows={2}
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                    placeholder="Contoh: Deskripsikan visi misi pangeran Nunu?"
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 text-sm md:text-base placeholder:text-slate-300 resize-none shadow-inner"
                  />
                  <div className="flex items-center gap-3 px-2">
                    <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase">Set Timer:</label>
                    <input 
                      type="range" min="5" max="120" step="5"
                      value={q.timer}
                      onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value))}
                      className="accent-indigo-500 flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-[10px] md:text-xs font-black text-indigo-500 w-8 md:w-10 text-right">{q.timer}s</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="relative group">
                      <div className={`absolute -left-2 -top-2 w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center font-black text-[9px] md:text-[10px] shadow-sm z-10 transition-all ${
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
                          className={`w-full pl-10 pr-10 py-3 bg-white border-2 rounded-xl outline-none transition-all font-bold text-sm ${
                            opt.correct 
                              ? 'border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/10 text-indigo-700' 
                              : 'border-slate-100 focus:border-slate-300'
                          }`}
                        />
                        <button 
                          onClick={() => setCorrectOption(qIndex, oIndex)}
                          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                            opt.correct 
                              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                              : 'bg-slate-100 text-slate-300 hover:text-indigo-400 hover:bg-indigo-50'
                          }`}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Bottom Navigation Kahoot Style */}
        {questions.length > 0 && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-md">
            <button 
              onClick={() => setActiveQIndex(prev => Math.max(0, prev - 1))}
              disabled={activeQIndex === 0}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="font-black text-slate-400 tracking-widest text-sm uppercase">
              Soal <span className="text-indigo-500 text-lg mx-1">{activeQIndex + 1}</span> dari {questions.length}
            </div>
            <button 
              onClick={() => setActiveQIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={activeQIndex === questions.length - 1}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
            >
              Next
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
