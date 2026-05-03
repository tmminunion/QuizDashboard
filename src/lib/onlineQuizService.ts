import { db } from './firebase';
import { ref, set, onValue, update, get, off } from 'firebase/database';

export const onlineQuizService = {
  // Mendengarkan perubahan data di sebuah Room
  listenToRoom: (roomId: string, callback: (data: any) => void) => {
    const roomRef = ref(db, `online_rooms/${roomId}`);
    onValue(roomRef, (snapshot) => {
      callback(snapshot.val());
    });
    return () => off(roomRef);
  },

  // Membuat Room baru (Host Control)
  createRoom: async (roomId: string, quizData: any) => {
    const roomRef = ref(db, `online_rooms/${roomId}`);
    return set(roomRef, {
      quiz: quizData,
      status: 'waiting',
      currentQuestionIndex: 0,
      players: {},
      createdAt: Date.now(),
      lastQuestionResetAt: Date.now()
    });
  },

  // Update status room (waiting, playing, finished)
  updateRoomStatus: async (roomId: string, status: string) => {
    const roomRef = ref(db, `online_rooms/${roomId}`);
    return update(roomRef, { status });
  },

  // Pindah ke soal berikutnya
  nextQuestion: async (roomId: string, nextIndex: number) => {
    const roomRef = ref(db, `online_rooms/${roomId}`);
    return update(roomRef, {
      currentQuestionIndex: nextIndex,
      status: 'playing',
      lastQuestionResetAt: Date.now()
    });
  },

  // Peserta bergabung ke room (Web Player)
  joinRoom: async (roomId: string, playerName: string) => {
    const playerNoreg = `USER_${Math.floor(100000 + Math.random() * 900000)}`;
    const playerRef = ref(db, `online_rooms/${roomId}/players/${playerNoreg}`);
    
    await set(playerRef, {
      name: playerName,
      score: 0,
      lastAnswerCorrect: false,
      lastAnswerAt: 0,
      joinedAt: Date.now()
    });

    return { playerNoreg, playerName };
  },

  // Submit jawaban dari player
  submitAnswer: async (roomId: string, playerNoreg: string, isCorrect: boolean, points: number) => {
    const playerRef = ref(db, `online_rooms/${roomId}/players/${playerNoreg}`);
    const snapshot = await get(playerRef);
    const currentData = snapshot.val() || { score: 0 };
    
    return update(playerRef, {
      score: (currentData.score || 0) + (isCorrect ? points : 0),
      lastAnswerCorrect: isCorrect,
      lastAnswerAt: Date.now()
    });
  },

  // Menutup room
  deleteRoom: async (roomId: string) => {
    const roomRef = ref(db, `online_rooms/${roomId}`);
    return set(roomRef, null);
  }
};
