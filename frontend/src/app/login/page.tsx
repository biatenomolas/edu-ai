'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Tentative de connexion...');
      await login(email, password);

      alert('✅ Connexion réussie !\nRedirection vers le tableau de bord...');
      router.push('/'); // redirection Next.js
    } catch (err: any) {
      console.error('❌ Erreur login :', err);
      setError(err.response?.data?.message || err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">EduAI</h1>
          <p className="text-slate-600 mt-2">Apprends plus vite avec l’IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-busy={loading}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Mail size={16} /> Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              placeholder="ton@email.com"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Lock size={16} /> Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 font-semibold py-3.5 rounded-2xl border border-slate-300 shadow hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                Se connecter
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-slate-900 font-medium hover:underline">
            S’inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  );
}