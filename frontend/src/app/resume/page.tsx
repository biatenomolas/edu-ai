'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Upload, FileText, Sparkles, Target, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function ResumePage() {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryId, setSummaryId] = useState<number | null>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
    setSummary(''); setQuestions([]); setFinished(false);
  };

  const handleSummarize = async () => {
    if (!file) return alert('Choisis un PDF');
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5000/api/summarize', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
      });
      setSummary(res.data.summary);
      setSummaryId(res.data.summary_id);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Erreur résumé');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await axios.post('http://localhost:5000/api/generate-quiz', { summary_id: summaryId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setScore(0);
      setFinished(false);
    } catch (err) {
      setError('Erreur génération quizz');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    const isCorrect = index === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        saveScore();
      }
    }, 1400);
  };

  const saveScore = async () => {
    try {
      await axios.post('http://localhost:5000/api/save-quiz-result', {
        summary_id: summaryId,
        score,
        total_questions: questions.length
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.log('XP sauvegardé (erreur mineure)'); }
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Conteneur principal */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
            📄 Résumés & Quizz IA
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Télécharge un PDF et laisse l'IA créer des résumés et quizz
          </p>
        </div>

        {/* Section Upload - Non visible après résumé */}
        {!summary ? (
          <div className="mb-10">
            {/* Zone de drop/upload */}
            <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/50 rounded-2xl p-8 sm:p-10 text-center mb-6 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-50">
              <div className="mb-4 flex justify-center">
                <div className="p-4 bg-emerald-100 rounded-xl">
                  <Upload className="text-emerald-600" size={40} />
                </div>
              </div>
              <p className="text-slate-600 font-medium mb-4">Sélectionne un PDF</p>
              <label className="inline-block bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-200">
                {file ? `✓ ${file.name}` : 'Choisir un fichier'}
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs sm:text-sm text-slate-500 mt-4">Format : PDF uniquement</p>
            </div>

            {/* Bouton Résumer */}
            <button
              onClick={handleSummarize}
              disabled={!file || uploading}
              className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 active:to-teal-800 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              {uploading ? 'Résumé en cours...' : 'Créer un résumé'}
            </button>

            {/* Message d'erreur */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Section Résumé */}
        {summary && !questions.length && !finished && (
          <div className="mb-10 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="text-emerald-600" size={28} />
              Résumé généré
            </h2>
            
            {/* Contenu du résumé */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
                <p className="whitespace-pre-wrap text-sm sm:text-base">{summary}</p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setSummary(''); setFile(null); }}
                className="px-6 py-3 sm:py-4 rounded-lg font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-200"
              >
                Charger un autre PDF
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz}
                className="flex-1 px-6 py-3 sm:py-4 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Target size={20} />
                {generatingQuiz ? 'Génération du quizz...' : 'Générer un quizz'}
              </button>
            </div>
          </div>
        )}

        {/* Section Quiz */}
        {questions.length > 0 && !finished && currentQ && (
          <div className="mb-10 animate-fade-in">
            {/* Barre de progression */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Question {currentIndex + 1} / {questions.length}
                </h2>
                <span className="text-sm font-semibold text-emerald-600">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
              <p className="text-lg sm:text-xl font-semibold text-slate-900 mb-8">
                {currentQ.question}
              </p>

              {/* Options de réponse */}
              <div className="space-y-3">
                {currentQ.options.map((opt: string, i: number) => {
                  const isCorrect = i === currentQ.correctIndex;
                  const isSelected = i === selected;
                  
                  let buttonClass = "bg-white border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50";
                  
                  if (selected !== null) {
                    if (isCorrect) {
                      buttonClass = "bg-emerald-50 border-2 border-emerald-500";
                    } else if (isSelected) {
                      buttonClass = "bg-red-50 border-2 border-red-500";
                    } else {
                      buttonClass = "bg-slate-50 border-2 border-slate-200 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selected !== null}
                      className={`w-full p-4 sm:p-5 rounded-xl text-left transition-all duration-200 font-medium text-slate-900 flex items-center justify-between ${buttonClass}`}
                    >
                      <span>{opt}</span>
                      <div className="flex-shrink-0 ml-2">
                        {selected !== null && isCorrect && (
                          <CheckCircle className="text-emerald-600" size={24} />
                        )}
                        {selected !== null && isSelected && !isCorrect && (
                          <XCircle className="text-red-600" size={24} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section Résultats */}
        {finished && (
          <div className="mb-10 animate-fade-in">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 sm:p-12 border border-emerald-200 shadow-sm text-center">
              
              {/* Score emoji */}
              <div className="text-6xl sm:text-7xl mb-6">
                {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '⭐' : '👍'}
              </div>

              {/* Titre */}
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Quizz terminé!
              </h2>

              {/* Score détaillé */}
              <div className="bg-white rounded-xl p-6 mb-6 inline-block">
                <p className="text-4xl sm:text-5xl font-bold text-emerald-600">
                  {score}/{questions.length}
                </p>
                <p className="text-slate-600 text-sm mt-2 font-medium">
                  {Math.round((score / questions.length) * 100)}% de réussite
                </p>
              </div>

              {/* XP gagné */}
              <div className="bg-white rounded-xl p-4 inline-block mb-8">
                <p className="text-2xl font-bold text-emerald-700">
                  <Sparkles className="inline mr-2" size={24} />
                  +{score * 50} XP
                </p>
              </div>

              {/* Bouton Recommencer */}
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-lg transition-all duration-200"
              >
                Recommencer
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}