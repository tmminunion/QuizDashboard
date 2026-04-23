import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function PretestPage() {
  const pretests = [
    { id: '1', name: 'Pretest Gelombang 1 - IT Support', candidates: 45, date: '25 April 2026', status: 'Upcoming' },
    { id: '2', name: 'Evaluasi Mingguan - Batch A', candidates: 120, date: '21 April 2026', status: 'Ongoing' },
    { id: '3', name: 'Final Assessment - Marketing', candidates: 32, date: '18 April 2026', status: 'Completed' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pretest Management 📋</h1>
          <p className="text-slate-500 mt-1">Atur jadwal dan pantau peserta pretest mas Nunu.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-pink-500/30 transition-all active:scale-95">
          <Plus size={20} />
          <span>Jadwalkan Pretest</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pretests.map((test) => (
          <div key={test.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-xl ${
                test.status === 'Completed' ? 'bg-green-50 text-green-500' :
                test.status === 'Ongoing' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
              }`}>
                {test.status === 'Completed' ? <CheckCircle2 size={24} /> :
                 test.status === 'Ongoing' ? <Clock size={24} /> : <AlertCircle size={24} />}
              </div>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md ${
                test.status === 'Completed' ? 'bg-green-100 text-green-600' :
                test.status === 'Ongoing' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {test.status}
              </span>
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{test.name}</h3>
            <p className="text-slate-500 text-sm mb-4">Mulai: <span className="font-semibold">{test.date}</span></p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400">Total Peserta: <span className="font-bold text-slate-700">{test.candidates}</span></span>
              <button className="text-pink-500 text-sm font-bold hover:underline">Kelola</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
