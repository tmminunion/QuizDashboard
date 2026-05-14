"use client";

import { useState, useEffect } from 'react';
import { onlineQuizService } from '@/lib/onlineQuizService';

export default function HostDashboard() {
  const [roomId, setRoomId] = useState('');
  const [roomData, setRoomData] = useState<any>(null);

  const handleCreateRoom = async () => {
    if (!roomId) return;
    await onlineQuizService.createRoom(roomId, { title: 'Kuis Seru' });
    alert('Room dibuat!');
  };

  useEffect(() => {
    if (!roomId) return;
    const unsubscribe = onlineQuizService.listenToRoom(roomId, (data) => {
      setRoomData(data);
    });
    return () => unsubscribe();
  }, [roomId]);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Host Powerhouse</h1>
      <div className="flex gap-2 my-4">
        <input 
          className="border p-2"
          placeholder="Room ID" 
          value={roomId} 
          onChange={(e) => setRoomId(e.target.value)} 
        />
        <button className="bg-blue-500 text-white p-2" onClick={handleCreateRoom}>Buat Room</button>
      </div>

      {roomData && (
        <div className="mt-4 p-4 border">
          <p>Status: {roomData.status}</p>
          <h2 className="font-bold mt-2">Pemain:</h2>
          <ul>
            {roomData.players && Object.entries(roomData.players).map(([id, player]: [string, any]) => (
              <li key={id}>{player.name} - Score: {player.score}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
