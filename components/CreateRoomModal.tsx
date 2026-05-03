'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ref, set } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function CreateRoomModal({ quiz, onClose }: { quiz: any; onClose: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createRoom = async () => {
    setLoading(true);
    try {
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const roomData = {
        quiz_id: quiz.id,
        title: quiz.Title,
        status: 'waiting',
        currentQuestionIndex: -1,
        createdAt: Date.now(),
        participants: {}
      };

      await set(ref(db, `rooms/${pin}`), roomData);
      router.push(`/dashboard/quiz/host/${pin}`);
    } catch (error) {
      console.error("Gagal membuat room:", error);
      alert("Gagal membuat room. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Buat Sesi Kuis</h2>
        <p className="text-slate-600 mb-6">Kuis: <span className="font-semibold">{quiz.Title}</span></p>
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 rounded-xl font-bold"
          >Batal</button>
          <button 
            onClick={createRoom}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-xl font-bold"
          >
            {loading ? 'Memproses...' : 'Buat Room'}
          </button>
        </div>
      </div>
    </div>
  );
}
