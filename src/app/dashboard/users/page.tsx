import React from 'react';
import { UserPlus, Mail, Shield, UserCircle2, Settings } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { id: '1', name: 'Ahmad Faisal', email: 'ahmad@example.com', role: 'Participant', lastSeen: '2 jam yang lalu' },
    { id: '2', name: 'Siti Aminah', email: 'siti@example.com', role: 'Moderator', lastSeen: 'Online' },
    { id: '3', name: 'Budi Santoso', email: 'budi@example.com', role: 'Participant', lastSeen: 'Kemarin' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">User Management 👥</h1>
          <p className="text-slate-500 mt-1">Pantau dan kelola hak akses pengguna Anda.</p>
        </div>
        <button className="flex items-center justify-center gap-2 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95">
          <UserPlus size={20} />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-slate-100">
          {users.map((user) => (
            <div key={user.id} className="p-6 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50/50 transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <UserCircle2 size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{user.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Mail size={12} />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center md:text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Shield size={14} className="text-pink-500" />
                    <span>{user.role}</span>
                  </div>
                </div>
                <div className="text-center md:text-right min-w-[120px]">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <p className={`text-sm font-bold ${user.lastSeen === 'Online' ? 'text-green-500' : 'text-slate-600'}`}>
                    {user.lastSeen}
                  </p>
                </div>
                <button className="bg-slate-100 p-2.5 rounded-xl text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-all">
                  <Settings size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
