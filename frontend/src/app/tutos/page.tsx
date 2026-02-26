'use client';

import { useState } from 'react';
import { Search, Play, X } from 'lucide-react';

export default function TutosPage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return alert('Tape quelque chose !');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/youtube-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.message) {
        throw new Error(data.message);
      }

      setVideos(data);
    } catch (err) {
      console.error('Erreur recherche YouTube :', err);
      alert('Erreur lors de la recherche YouTube');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Conteneur principal */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            🎥 Tutoriels YouTube
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Trouvez des tutoriels vidéo sur n'importe quel sujet
          </p>
        </div>

        {/* Barre de recherche - Moderne */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Language C, Physique, Algèbre, Histoire..."
                className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-white border border-slate-200 rounded-xl sm:rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl sm:rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Search size={20} />
              <span className="hidden sm:inline">Rechercher</span>
            </button>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Recherche en cours...</p>
          </div>
        )}

        {/* Grille de résultats - Responsive */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video) => (
              <button
                key={video.id}
                onClick={() => setSelectedVideoId(video.id)}
                className="text-left group cursor-pointer transition-all duration-300"
              >
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-100 mb-3 aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200">
                    <div className="bg-emerald-600 group-hover:bg-emerald-700 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                      <Play size={24} className="text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="px-0.5">
                  <p className="font-semibold text-slate-900 line-clamp-2 text-sm sm:text-base group-hover:text-emerald-700 transition-colors duration-200">
                    {video.title}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-1">
                    {video.channel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* État vide - Pas de résultats */}
        {!loading && videos.length === 0 && query && (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-600 font-medium">Aucune vidéo trouvée</p>
            <p className="text-slate-400 text-sm mt-2">Essayez une autre recherche</p>
          </div>
        )}

        {/* État initial - Pas de recherche */}
        {!loading && videos.length === 0 && !query && (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-slate-600 font-medium">Commencez votre recherche</p>
            <p className="text-slate-400 text-sm mt-2">Tapez un sujet ou un mot-clé pour trouver des tutoriels</p>
          </div>
        )}
      </div>

      {/* Modal - Lecteur vidéo */}
      {selectedVideoId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header du modal */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Lecture vidéo</h3>
              <button
                onClick={() => setSelectedVideoId(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-slate-600 hover:text-slate-900"
                title="Fermer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Iframe */}
            <div className="aspect-video bg-black overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                title="Lecteur vidéo"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}