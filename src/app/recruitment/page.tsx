'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, DollarSign, Award, Users, Car, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export default function CandidateLandingPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-14 text-center shadow-2xl">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6">
          <Sparkles className="h-4 w-4" /> Convocatoria Abierta: Promotoría AACOM
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Construye tu propio negocio rentable como <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Socio Comercial AACOM</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
          Buscamos profesionales resilientes con visión empresarial, dispuestos a superar la barrera de los <strong className="text-emerald-400">$50,000 MXN mensuales</strong> mediante ventas consultivas de alto valor y sin tope de ingresos.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/recruitment/apply"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            Realizar Test de Elegibilidad Instantáneo <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/recruitment/dashboard"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition-all"
          >
            Acceso Reclutador / CRM
          </Link>
        </div>
      </div>

      {/* Pilares del Socio Comercial Ideal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-sky-500/40 transition-all">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Ingresos Sin Tope</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esquema 100% comisionista diseñado para quienes huyen de la trampa del sueldo fijo y buscan facturar sin límites basados en su rendimiento.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-sky-500/40 transition-all">
          <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
            <Car className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Autonomía & Movilidad</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gestión propia de agenda y movilidad independiente para cierres corporativos de alto valor y pólizas empresariales estratégicas.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-sky-500/40 transition-all">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Construcción de Cartera</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Desarrollo de un activo patrimonial renovable año con año a través de ventas consultivas en sectores de alto nivel.
          </p>
        </div>
      </div>

      {/* Los Filtros de Hierro (Explicación Transparente) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-sky-400" /> Transparencia Total: Filtros de Selección AACOM
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Respaldo Financiero Mínimo</strong>
              Contar con colchón de 3 a 4 meses para la curva de aprendizaje inicial.
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Movilidad / Auto Propio</strong>
              Para atender clientes presenciales o acceso compensatorio a mercado de alto valor (Semáforo Amarillo).
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Aversión al Sueldo Fijo</strong>
              Mentalidad 100% comisionista motivada por la aceleración de ingresos.
            </div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm mb-0.5">Resiliencia & Proceso</strong>
              Tolerancia al rechazo y disciplina para seguir la metodología comercial AACOM.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
