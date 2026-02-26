import Link from 'next/link';
import { Target, ArrowLeft } from 'lucide-react';

export default function QuizzPage() {
  return (
    <div className="max-w-md mx-auto p-6 pt-10 bg-white min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-gray-500">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold">Quizz IA</h1>
      </div>

      <div className="text-center py-16">
        <Target size={90} className="mx-auto text-purple-600 mb-6" />
        <h2 className="text-2xl font-semibold mb-4">Prêt à tester tes connaissances ?</h2>
        <p className="text-gray-600 mb-10 max-w-xs mx-auto">
          Les quizz sont générés automatiquement à partir de tes cours.
        </p>

        <Link 
          href="/resume"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition"
        >
          Aller générer un Quizz
        </Link>

        <p className="text-xs text-gray-500 mt-12">
          Va dans l'onglet <strong>Résumé</strong> → upload PDF → "Générer Quizz"
        </p>
      </div>
    </div>
  );
}