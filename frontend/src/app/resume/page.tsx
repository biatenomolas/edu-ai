'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Upload, FileText, Sparkles, Target, CheckCircle, XCircle } from 'lucide-react';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSummary('');
      setQuestions([]);
      setFinished(false);
    }
  };

  const handleSummarize = async () => {
    if (!file) return alert('Choisis un PDF');
    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/summarize`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-quiz`, { summary_id: summaryId }, {
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
        // Sauvegarde score + XP
        axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/save-quiz-result`, {
          summary_id: summaryId,
          score
        }, { headers: { Authorization: `Bearer ${token}` } }).catch(e => console.log(e));
      }
    }, 1400);
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-md mx-auto p-6 pt-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Résumé & Quizz IA</h1>

      {/* Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center mb-6">
        <Upload className="mx-auto text-blue-600 mb-4" size={48} />
        <label className="block bg-blue-600 text-white py-3 rounded-2xl cursor-pointer">
          {file ? file.name : 'Choisir PDF'}
          <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <button onClick={handleSummarize} disabled={!file || uploading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold mb-8">
        {uploading ? 'Résumé en cours...' : 'Résumer avec IA'}
      </button>

      {summary && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-3">Résumé</h2>
          <div className="bg-gray-50 p-6 rounded-3xl text-gray-800 leading-relaxed">{summary}</div>
          <button onClick={handleGenerateQuiz} disabled={generatingQuiz} className="mt-6 w-full py-4 bg-purple-600 text-white rounded-2xl font-bold">
            {generatingQuiz ? 'Génération...' : 'Générer Quizz'}
          </button>
        </div>
      )}

      {questions.length > 0 && !finished && currentQ && (
        <div>
          <h2 className="text-xl font-bold mb-4">Question {currentIndex + 1} / {questions.length}</h2>
          <p className="font-semibold mb-6">{currentQ.question}</p>
          <div className="space-y-3">
            {currentQ.options.map((opt: string, i: number) => {
              let style = "bg-gray-100 hover:bg-gray-200";
              if (selected !== null) {
                if (i === currentQ.correctIndex) style = "bg-green-100 border-green-500";
                else if (i === selected) style = "bg-red-100 border-red-500";
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                  className={`w-full p-4 rounded-2xl border text-left transition ${style}`}>
                  {opt}
                  {selected !== null && i === currentQ.correctIndex && <CheckCircle className="inline ml-2 text-green-600" />}
                  {selected !== null && i === selected && i !== currentQ.correctIndex && <XCircle className="inline ml-2 text-red-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {finished && (
        <div className="text-center mt-10">
          <h2 className="text-4xl font-bold text-green-600">Quizz terminé !</h2>
          <p className="text-2xl mt-4">Score : {score} / {questions.length}</p>
          <p className="text-xl text-purple-600 mt-2">+{score * 50} XP gagnés !</p>
          <button onClick={() => window.location.reload()} className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold">
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}