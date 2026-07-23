'use client';

import React, { useState } from 'react';
import { Header } from './_components/Header';
import '@/app/globals.css'; // Cero modificaciones a globals, importamos estilos estándar

export default function RecruitmentLayout({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'RECRUITER' | 'CANDIDATE'>('ADMIN');
  const [userName, setUserName] = useState('Director AACOM');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        userName={userName}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
        {children}
      </main>
    </div>
  );
}
