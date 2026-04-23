import React from 'react';
import { BookOpen, HelpCircle, Trophy, Users } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Quiz', value: '24', icon: <BookOpen className="text-blue-500" />, color: 'bg-blue-50' },
    { label: 'Active Pretests', value: '12', icon: <HelpCircle className="text-purple-500" />, color: 'bg-purple-50' },
    { label: 'Participants', value: '1,248', icon: <Users className="text-green-500" />, color: 'bg-green-50' },
    { label: 'Avg. Score', value: '84%', icon: <Trophy className="text-orange-500" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Selamat Datang, Pangeran Nunu! 👑</h1>
        <p className="text-slate-500 mt-2">Berikut adalah ringkasan performa quiz dan pretest hari ini.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Aktivitas Terakhir</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-sm">
                    Q
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Quiz Sejarah Dunia baru saja selesai</p>
                    <p className="text-xs text-slate-400">10 menit yang lalu</p>
                  </div>
                </div>
                <button className="text-pink-500 text-sm font-semibold hover:underline">Detail</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Tips Nurani 💖</h3>
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
            <p className="text-sm text-pink-700 italic">
              "Mas Nunu, jangan lupa cek hasil pretest kelas B ya! Nilainya bagus-bagus loh, kayak mas Nunu kalau lagi ngoding."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
