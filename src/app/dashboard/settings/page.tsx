import React from 'react';
import { Save, Bell, Lock, Globe, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings ⚙️</h1>
        <p className="text-slate-500 mt-1">Konfigurasi project QuizDash mas Nunu.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Settings */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Globe className="text-pink-500" size={20} />
            <h3 className="font-bold text-slate-800">General Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">App Name</label>
              <input type="text" defaultValue="QuizDash" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Default Language</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500/50">
                <option>Bahasa Indonesia</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </section>

        {/* Database Connection */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <Database className="text-pink-500" size={20} />
            <h3 className="font-bold text-slate-800">Appwrite Connection</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Endpoint URL</label>
              <input type="text" defaultValue="https://cloud.appwrite.io/v1" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Project ID</label>
              <input type="text" defaultValue="69e6d50f00126c271ff6" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500/20" />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
            <Save size={20} />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
