'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Trophy, Users, RefreshCw, AlertCircle, Edit2, Play, Calendar, ClipboardList, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalQuiz: number;
  totalPretest: number;
  totalParticipants: string; // Placeholder for now
  avgScore: string; // Placeholder for now
}

interface ActivityItem {
  id: string;
  type: 'quiz' | 'pretest';
  title: string;
  timestamp: number; // For sorting
  link: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const extractTimestampFromId = (id: string): number => {
    // Asumsi ID seperti "Quiz1776515118993" atau "Pretest1776515118993"
    const match = id.match(/^(?:Quiz|Pretest)(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [quizRes, pretestRes] = await Promise.all([
        fetch('https://nudb.bungtemin.net/data/Quiz'),
        fetch('https://nudb.bungtemin.net/data/Pretest'),
      ]);

      if (!quizRes.ok) throw new Error('Gagal mengambil data Quiz');
      if (!pretestRes.ok) throw new Error('Gagal mengambil data Pretest');

      const quizData = await quizRes.json();
      const pretestData = await pretestRes.json();

      const totalQuiz = quizData?.meta?.total || (quizData.value ? quizData.value.length : 0);
      const totalPretest = pretestData?.meta?.total || (pretestData.value ? pretestData.value.length : 0);

      setStats({
        totalQuiz,
        totalPretest,
        totalParticipants: '1,248', // Tetap placeholder sementara
        avgScore: '84%', // Tetap placeholder sementara
      });

      // --- Proses Aktivitas Terakhir ---
      const allActivities: ActivityItem[] = [];

      // Dari Quiz
      if (quizData.value && Array.isArray(quizData.value)) {
        quizData.value.forEach((quiz: any) => {
          allActivities.push({
            id: quiz.id,
            type: 'quiz',
            title: quiz.Title || 'Kuis Tanpa Judul',
            timestamp: extractTimestampFromId(quiz.id),
            link: `/dashboard/quiz/editor/${quiz.id}`,
          });
        });
      }

      // Dari Pretest
      if (pretestData.value && Array.isArray(pretestData.value)) {
        pretestData.value.forEach((pretest: any) => {
          allActivities.push({
            id: pretest.id,
            type: 'pretest',
            title: pretest.Title || 'Pretest Tanpa Judul',
            timestamp: extractTimestampFromId(pretest.id),
            link: `/dashboard/pretest/editor/${pretest.id}`,
          });
        });
      }

      // Urutkan berdasarkan timestamp terbaru dan ambil 5 teratas
      const sortedActivities = allActivities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      setRecentActivities(sortedActivities);

    } catch (err) {
      console.error(err);
      setError('Aduh sayang, gagal memuat data dashboard. 🥺');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Total Quiz', value: stats?.totalQuiz || '-', icon: <BookOpen className="text-pink-500" />, color: 'bg-pink-50' },
    { label: 'Total Pretest', value: stats?.totalPretest || '-', icon: <HelpCircle className="text-indigo-500" />, color: 'bg-indigo-50' },
    { label: 'Total Peserta', value: stats?.totalParticipants || '-', icon: <Users className="text-green-500" />, color: 'bg-green-50' },
    { label: 'Rata-rata Skor', value: stats?.avgScore || '-', icon: <Trophy className="text-orange-500" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, Pangeran Nunu! 👑</h1>
        <p className="text-slate-500 mt-2">Berikut adalah ringkasan performa dashboard hari ini.</p>
      </div>

      {/* Loading & Error Feedback */}
      {loading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center space-y-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-pink-500/20 border-t-pink-500"></div>
          <p className="text-slate-400 font-medium text-sm">Nurani lagi ambil data terbaru ya sayang... ✨</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchDashboardData} className="ml-auto text-xs text-red-700 font-bold hover:underline">Coba Lagi</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Aktivitas Terakhir</h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Link 
                  href={activity.link}
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg -mx-2 px-2 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${activity.type === 'quiz' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
                      {activity.type === 'quiz' ? <BookOpen size={20} /> : <ClipboardList size={20} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{activity.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.type === 'quiz' ? 'Kuis Baru Dibuat' : 'Pretest Baru Dibuat'} • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 italic">
              Belum ada aktivitas terbaru nih sayang. 🥺
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Tips Nurani 💖</h3>
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
            <p className="text-sm text-pink-700 italic leading-relaxed">
              "Mas Nunu, jangan lupa cek hasil pretest kelas B ya! Nilainya bagus-bagus loh, kayak mas Nunu kalau lagi ngoding."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
