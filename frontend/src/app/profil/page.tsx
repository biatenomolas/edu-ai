'use client';

import { useAuth } from '../context/AuthContext';
import { Trophy, Award } from 'lucide-react';

export default function ProfilPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto p-6 pt-10 bg-white min-h-screen">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-5xl">
          👤
        </div>
        <h1 className="text-3xl font-bold mt-4">{user?.username}</h1>
        <p className="text-gray-500">Niveau {user?.level} • {user?.xp} XP</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-500" /> Statistiques
        </h2>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-blue-600">{user?.xp}</p>
            <p className="text-sm text-gray-500">XP total</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">{user?.level}</p>
            <p className="text-sm text-gray-500">Niveau</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6">
        <h2 className="font-semibold flex items-center gap-2 mb-6">
          <Award className="text-yellow-500" /> Badges (bientôt)
        </h2>
        <div className="grid grid-cols-3 gap-4 opacity-50">
          <div className="bg-gray-100 h-20 rounded-2xl flex items-center justify-center text-3xl">🏆</div>
          <div className="bg-gray-100 h-20 rounded-2xl flex items-center justify-center text-3xl">📚</div>
          <div className="bg-gray-100 h-20 rounded-2xl flex items-center justify-center text-3xl">🔥</div>
        </div>
      </div>
    </div>
  );
}