'use client';

import Link from 'next/link';
import { Home, BookOpen, Target, PlayCircle, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Accueil' },
    { href: '/resume', icon: BookOpen, label: 'Résumé' },
    { href: '/quiz', icon: Target, label: 'Quizz' },
    { href: '/tutos', icon: PlayCircle, label: 'Tutos' },
    { href: '/profil', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
            >
              <Icon size={24} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}