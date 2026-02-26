'use client';

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, Star, BookOpen, Target, Award } from 'lucide-react';

interface ClassementUser {
  username: string;
  xp: number;
  level: number;
}

export default function Dashboard() {
  const { user, token, logout, isLoading: contextLoading } = useAuth();
  const router = useRouter();
  const [classement, setClassement] = useState<ClassementUser[]>([]);
  const [loadingClassement, setLoadingClassement] = useState(true);

  // Redirection si non connecté
  useEffect(() => {
    if (!contextLoading && !token) {
      router.replace('/login');
    }
  }, [contextLoading, token, router]);

  // Récupération du classement en temps réel
  useEffect(() => {
    if (!token) return;

    const fetchClassement = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/classement', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setClassement(data);
      } catch (err) {
        console.error('Erreur classement', err);
      } finally {
        setLoadingClassement(false);
      }
    };

    fetchClassement();
  }, [token]);

  if (contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const xpForNextLevel = 1000;
  const progress = ((user.xp || 0) % xpForNextLevel) / 10;

  return (
    <div className="max-w-md mx-auto p-6 pt-10 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bonjour, {user.username} 👋</h1>
          <p className="text-gray-500">Niveau {user.level} • {user.xp} XP</p>
        </div>
        <button
          onClick={logout}
          className="text-red-500 text-sm font-medium hover:underline"
        >
          Déconnexion
        </button>
      </div>

      {/* Carte XP principale */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm">Prochain niveau dans</p>
            <p className="text-5xl font-bold mt-1">
              {xpForNextLevel - ((user.xp || 0) % xpForNextLevel)} XP
            </p>
          </div>
          <Trophy size={60} className="opacity-80" />
        </div>
        <div className="h-3 bg-white/30 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-3xl p-5 text-center">
          <BookOpen className="mx-auto text-blue-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-gray-500 text-sm">Résumés créés</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-5 text-center">
          <Target className="mx-auto text-purple-600 mb-2" size={32} />
          <p className="text-3xl font-bold text-gray-900">87%</p>
          <p className="text-gray-500 text-sm">Moyenne quizz</p>
        </div>
      </div>

      {/* Classement en temps réel */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-500" /> Top 10 Étudiants
      </h2>
      <div className="bg-white border border-gray-200 rounded-3xl p-5">
        {loadingClassement ? (
          <p className="text-center py-8 text-gray-500">Chargement du classement...</p>
        ) : (
          <div className="space-y-3">
            {classement.map((player, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <span className="font-medium">{player.username}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-purple-600">{player.xp} XP</span>
                  <span className="text-xs text-gray-500 block">Niv. {player.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 mt-12">
        Utilise les onglets en bas pour continuer !
      </p>
    </div>
  );
}