'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Users, Cpu, Key, FileText, UserCheck, LayoutDashboard, Lock } from 'lucide-react';

interface HeaderProps {
  currentRole: 'ADMIN' | 'RECRUITER' | 'CANDIDATE';
  onRoleChange: (role: 'ADMIN' | 'RECRUITER' | 'CANDIDATE') => void;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, userName }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/recruitment', label: 'Landing Postulación', icon: FileText, roles: ['ADMIN', 'RECRUITER', 'CANDIDATE'] },
    { href: '/recruitment/apply', label: 'Formulario Candidato', icon: UserCheck, roles: ['ADMIN', 'RECRUITER', 'CANDIDATE'] },
    { href: '/recruitment/dashboard', label: 'CRM & Semáforo', icon: LayoutDashboard, roles: ['ADMIN', 'RECRUITER'] },
    { href: '/recruitment/admin/ai-rules', label: 'Cerebro IA', icon: Cpu, roles: ['ADMIN'] },
    { href: '/recruitment/admin/users', label: 'Gestión Usuarios', icon: Users, roles: ['ADMIN'] },
    { href: '/recruitment/admin/integrations', label: 'Integraciones (Twilio/Gemini)', icon: Key, roles: ['ADMIN'] },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Marca Corporativa */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">AACOM</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-medium">
                Promotoría Reclutamiento
              </span>
            </div>
          </div>

          {/* Navegación Principal Filtrada por Rol */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems
              .filter((item) => item.roles.includes(currentRole))
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          {/* Selector de Rol y Perfil */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <span className="text-slate-400 px-2 font-mono text-[10px] uppercase flex items-center gap-1">
                <Lock className="h-3 w-3 text-sky-400" /> Rol:
              </span>
              <button
                onClick={() => onRoleChange('ADMIN')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  currentRole === 'ADMIN' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => onRoleChange('RECRUITER')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  currentRole === 'RECRUITER' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reclutador
              </button>
              <button
                onClick={() => onRoleChange('CANDIDATE')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  currentRole === 'CANDIDATE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Candidato
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400 text-xs">
                {userName.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">{userName}</p>
                <p className="text-[10px] text-sky-400 font-mono uppercase">{currentRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
