import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EduAI - Cours, Résumés & Quizz',
  description: 'Apprends plus vite avec l\'IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <div className="pb-20"> {/* espace pour la bottom nav */}
            {children}
          </div>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}