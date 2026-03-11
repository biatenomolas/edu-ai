'use client';

import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Trophy, BookOpen, Target, LogOut, Sparkles } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const xpForNextLevel = 1000;
  const progress = ((user.xp || 0) % xpForNextLevel) / 10;
  const xpForCurrentLevel = (user.xp || 0) % xpForNextLevel;
  const xpRemaining = xpForNextLevel - xpForCurrentLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Conteneur principal avec max-width pour desktop */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-emerald-700 bg-clip-text text-transparent">
              Bienvenue, {user.username}! 👋
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base font-medium">
              Niveau <span className="font-bold text-emerald-700">{user.level}</span> • 
              <span className="font-bold text-emerald-700 ml-1">{user.xp}</span> XP
            </p>
          </div>
          
          {/* Bouton de déconnexion - Moderne */}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium transition-all duration-200 border border-transparent hover:border-red-200"
            title="Se déconnecter"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>

        {/* Carte XP principale - Design moderne */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-emerald-100 text-xs sm:text-sm font-semibold uppercase tracking-wide">Prochain niveau</p>
                <p className="text-4xl sm:text-5xl font-bold mt-2">{xpRemaining}</p>
                <p className="text-emerald-100 text-sm mt-1">XP restants</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
                <Sparkles size={24} className="text-emerald-200" />
              </div>
            </div>
            
            {/* Barre de progression - Moderne */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-emerald-100">
                <span>Progression</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats rapides - Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Résumés créés</p>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">12</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Target className="text-emerald-600" size={24} />
              </div>
              <div>
                <p className="text-slate-600 text-sm font-medium">Moyenne quizz</p>
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-slate-900">87<span className="text-xl">%</span></p>
          </div>
        </div>

        {/* Section Classement */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Trophy className="text-amber-600" size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Top 10 Étudiants</h2>
          </div>

          {/* Classement Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {loadingClassement ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-slate-500 font-medium">Chargement du classement...</p>
              </div>
            ) : classement.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {classement.map((player, index) => (
                  <div
                    key={index}
                    className="px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-300 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-semibold text-slate-900 truncate">{player.username}</span>
                    </div>
                    <div className="flex-shrink-0 text-right ml-2">
                      <p className="font-bold text-emerald-700 text-sm sm:text-base">{player.xp} XP</p>
                      <p className="text-xs text-slate-500 mt-0.5">Niv. {player.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                Aucun résultat disponible
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-400 mt-8 pb-4">
          Utilise les onglets en bas pour continuer ton apprentissage !
        </p>
      </div>
    </div>
  );
}