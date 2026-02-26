'use client';

import { useState } from 'react';
import { Search, Play, X } from 'lucide-react';

export default function TutosPage() {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/youtube-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      alert('Erreur lors de la recherche YouTube');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 pt-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">🎥 Tutos YouTube</h1>

      {/* Barre de recherche */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Language C, Physique, Algèbre, Histoire..."
          className="flex-1 px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-red-600 text-white px-8 rounded-2xl disabled:opacity-50"
        >
          <Search size={26} />
        </button>
      </div>

      {/* Résultats */}
      {loading && <p className="text-center py-8">Recherche en cours...</p>}

      <div className="grid grid-cols-1 gap-4">
        {videos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideoId(video.id)}
            className="bg-white border border-gray-200 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl transition"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="font-medium line-clamp-2 text-sm leading-tight">{video.title}</p>
              <p className="text-xs text-gray-500 mt-1">{video.channel}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Player intégré */}
      {selectedVideoId && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden">
            <div className="flex justify-end p-3">
              <button onClick={() => setSelectedVideoId(null)} className="text-gray-500">
                <X size={28} />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}