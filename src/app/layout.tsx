import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'AACOM Recruitment Autopilot & Agency-Agents',
  description: 'Sistema de Reclutamiento Automatizado y Trineo de Candidatos para Promotoría AACOM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
