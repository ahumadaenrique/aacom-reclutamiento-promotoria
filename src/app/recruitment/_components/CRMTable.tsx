'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TrafficLightBadge } from './TrafficLightBadge';
import { Search, Phone, Mail, ShieldAlert, CheckCircle2, XCircle, MessageSquare, RefreshCw, Eye, GraduationCap, FileText, ExternalLink, AlertTriangle, Award, BarChart3, Sparkles, X, ArrowLeft, Layers, Check, ChevronRight, FileSpreadsheet, ShieldCheck, UserCheck } from 'lucide-react';

export const STAGES = [
  { id: 1, name: 'Registro & Perfil', desc: 'Creación de perfil inicial' },
  { id: 2, name: 'Revisión CV', desc: 'Evaluación de CV en Vercel Blob' },
  { id: 3, name: 'Prueba POP', desc: 'Orientación de Perfil Comercial' },
  { id: 4, name: 'Primera Cita', desc: 'Entrevista inicial (Calendly)' },
  { id: 5, name: 'Proyecto 200', desc: 'Carga de lista Excel de prospectos' },
  { id: 6, name: 'Entrevista Carrera', desc: 'Entrevista Director Comercial' },
  { id: 7, name: 'Documentación', desc: 'Carga de 6 expediente oficiales' },
  { id: 8, name: '¡Bienvenido!', desc: 'Alta e inducción Cédula CNSF' },
];

export const CRMTable: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<number | 'ALL'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (statusFilter !== 'ALL') query.append('status', statusFilter);
      if (search) query.append('search', search);

      const res = await fetch(`/api/recruitment/candidates?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.candidates);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [statusFilter, search]);

  const advanceStage = async (cand: any) => {
    const nextStage = Math.min(8, (cand.etapaActual || 1) + 1);
    try {
      const res = await fetch('/api/recruitment/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cand.id, etapaActual: nextStage }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCandidates();
        if (selectedCandidate && selectedCandidate.id === cand.id) {
          setSelectedCandidate({ ...selectedCandidate, etapaActual: nextStage });
        }
      }
    } catch (err) {
      alert('Error avanzando la etapa del candidato');
    }
  };

  const updateCandidateStatus = async (id: string, reviewStatus: string, status?: string) => {
    try {
      const res = await fetch('/api/recruitment/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reviewStatus, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCandidates();
        if (selectedCandidate && selectedCandidate.id === id) {
          setSelectedCandidate(data.candidate);
        }
      }
    } catch (err) {
      alert('Error actualizando estado del candidato');
    }
  };

  const getWhatsAppLink = (cand: any) => {
    const cleanPhone = cand.phone.replace(/[^0-9]/g, '');
    const currentStageObj = STAGES.find((s) => s.id === (cand.etapaActual || 1));
    const message = encodeURIComponent(
      `¡Hola ${cand.fullName}! Te contactamos de la Promotoría AACOM. Revisamos tu avance en el proceso de selección (Actualmente en Etapa ${cand.etapaActual || 1}: ${currentStageObj?.name}). Nos gustaría agendar tu siguiente sesión esta semana. ¿Tienes disponibilidad mañana?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const filteredCandidates = candidates.filter((c) => {
    if (stageFilter === 'ALL') return true;
    return (c.etapaActual || 1) === Number(stageFilter);
  });

  return (
    <div className="space-y-6">
      {/* Búsqueda, Filtros Semáforo y Filtro de Etapas */}
      <div className="flex flex-col gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar candidato, email, universidad..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Botones de Filtro Semáforo */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'ALL' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({candidates.length})
            </button>
            <button
              onClick={() => setStatusFilter('GREEN')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'GREEN' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              🟢 Verdes
            </button>
            <button
              onClick={() => setStatusFilter('YELLOW')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'YELLOW' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              🟡 Amarillos (Excepción)
            </button>
            <button
              onClick={() => setStatusFilter('RED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'RED' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              🔴 Rojos
            </button>
          </div>

          <button
            onClick={fetchCandidates}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Recargar candidatos"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Barra de Filtro de las 8 Etapas del Proceso AACOM */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0 flex items-center gap-1">
            <Layers className="h-3.5 w-3.5 text-sky-400" /> Etapas del Proceso:
          </span>
          <button
            onClick={() => setStageFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors ${
              stageFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            Todas las Etapas
          </button>
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStageFilter(s.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                stageFilter === s.id
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-slate-800 text-sky-400 text-[10px] flex items-center justify-center font-bold">
                {s.id}
              </span>
              <span>{s.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Candidatos con 8 Etapas */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Candidato & Perfil</th>
                <th className="px-4 py-3.5">Etapa Actual (1 a 8)</th>
                <th className="px-4 py-3.5">Semáforo & Match</th>
                <th className="px-4 py-3.5">Movilidad & Ingreso Previo</th>
                <th className="px-4 py-3.5">Industria & Universidad</th>
                <th className="px-4 py-3.5 text-right">Acción 1-Clic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500">
                    Cargando expediente de candidatos...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No se encontraron candidatos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((cand) => {
                  const currentStageNum = cand.etapaActual || 1;
                  const stageObj = STAGES.find((s) => s.id === currentStageNum);

                  return (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedCandidate(cand)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                          {cand.fullName}
                          {cand.agenteExperimentado && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                              FAST-TRACK EXPERIMENTADO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {cand.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {cand.phone}
                          </span>
                        </div>
                      </td>

                      {/* Columna de Etapa Actual (1 a 8) */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[11px]">
                              Etapa {currentStageNum} de 8
                            </span>
                            <span className="text-slate-200 font-semibold text-xs">{stageObj?.name}</span>
                          </div>
                          <div className="w-36 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all"
                              style={{ width: `${(currentStageNum / 8) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <TrafficLightBadge status={cand.status} score={cand.score} size="sm" />
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-slate-200">
                            {cand.hasCar ? '🚗 Con Auto' : '🚶 Sin Auto'}
                            <span className="text-[10px] text-slate-400">({cand.financialBufferMonths}m Colchón)</span>
                          </span>
                          {cand.previousIncomeRange && (
                            <span className="text-[10px] text-emerald-400 font-mono">
                              Ingreso: {cand.previousIncomeRange} MXN
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-200 truncate max-w-[180px]" title={cand.background}>
                          {cand.background}
                        </div>
                        {cand.targetUniversity && (
                          <div className="flex items-center gap-1 text-[10px] text-indigo-300 mt-0.5">
                            <GraduationCap className="h-3 w-3 text-indigo-400" />
                            <span className="truncate max-w-[140px]">{cand.targetUniversity}</span>
                            {cand.universityTier === 'TIER_1' && (
                              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1 rounded text-[9px] font-bold">
                                Tier 1
                              </span>
                            )}
                            {cand.universityTier === 'TIER_2' && (
                              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1 rounded text-[9px] font-bold">
                                Tier 2
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => advanceStage(cand)}
                            disabled={currentStageNum >= 8}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-semibold text-[11px] flex items-center gap-1 transition-all disabled:opacity-30"
                            title="Avanzar a la siguiente etapa del proceso"
                          >
                            Avanzar Etapa <ChevronRight className="h-3 w-3" />
                          </button>

                          <a
                            href={getWhatsAppLink(cand)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                            title="Enviar mensaje de WhatsApp instantáneo"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                          </a>

                          <button
                            onClick={() => setSelectedCandidate(cand)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Ver Expediente 360° Completo"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL EXPEDIENTE 360° CON VISUALIZADOR DE LAS 8 ETAPAS */}
      {selectedCandidate && mounted && createPortal(
        <div className="fixed inset-0 w-screen h-screen z-[99999] bg-slate-950 flex flex-col text-slate-100 overflow-hidden">
          
          {/* Header Superior Fijo de la Pantalla Completa */}
          <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 shadow-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all text-xs font-bold flex items-center gap-2 border border-slate-700/60"
              >
                <ArrowLeft className="h-4 w-4" /> Regresar al CRM
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{selectedCandidate.fullName}</h2>
                  {selectedCandidate.cvFileUrl && (
                    <a
                      href={selectedCandidate.cvFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <FileText className="h-3.5 w-3.5" /> Descargar CV (Vercel Blob) <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedCandidate.email} • {selectedCandidate.phone} • {selectedCandidate.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <TrafficLightBadge status={selectedCandidate.status} score={selectedCandidate.score} size="lg" />
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/60"
                title="Cerrar Expediente"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* CUERPO DEL EXPEDIENTE (Scroll Fluido Completo) */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* LINEA DEL TIEMPO DE LAS 8 ETAPAS DEL CANDIDATO */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="h-5 w-5 text-sky-400" /> Línea del Tiempo del Candidato (8 Etapas del Proceso AACOM)
                  </h4>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    Etapa Actual: {selectedCandidate.etapaActual || 1} / 8
                  </span>
                </div>

                {/* Pasos horizontales */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
                  {STAGES.map((step) => {
                    const isCompleted = step.id < (selectedCandidate.etapaActual || 1);
                    const isActive = step.id === (selectedCandidate.etapaActual || 1);

                    return (
                      <div
                        key={step.id}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-between space-y-1 transition-all ${
                          isCompleted
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : isActive
                            ? 'bg-sky-500/20 border-sky-500/50 text-white shadow-lg ring-1 ring-sky-500/50'
                            : 'bg-slate-950 border-slate-800/80 text-slate-500'
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : isActive
                              ? 'bg-sky-500 text-white animate-pulse'
                              : 'bg-slate-900 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
                        </div>
                        <span className="font-bold text-[11px] leading-tight mt-1">{step.name}</span>
                        <span className="text-[9px] opacity-75">{isCompleted ? 'Completado' : isActive ? 'En Curso' : 'Bloqueado'}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => advanceStage(selectedCandidate)}
                    disabled={(selectedCandidate.etapaActual || 1) >= 8}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-40"
                  >
                    Avanzar a la Siguiente Etapa ({Math.min(8, (selectedCandidate.etapaActual || 1) + 1)}) <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* EXPEDIENTE DE DOCUMENTOS OFICIALES & ARCHIVOS (ETAPA 5 Y 7) */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" /> Expediente de Documentos Oficiales & Archivos del Candidato
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Proyecto 200 Excel (Etapa 5) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-400" /> Proyecto 200 (Lista Excel de Prospectos)
                      </span>
                      {selectedCandidate.proyecto200Url ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          SUBIDO
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                          PENDIENTE
                        </span>
                      )}
                    </div>
                    {selectedCandidate.proyecto200Url ? (
                      <a
                        href={selectedCandidate.proyecto200Url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-mono pt-1"
                      >
                        Descargar Excel de Proyecto 200 <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-[11px] text-slate-500">El candidato subirá este archivo en la Etapa 5.</p>
                    )}
                  </div>

                  {/* Prueba POP (Etapa 3) */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-indigo-400" /> Resultado de Prueba POP
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        ETAPA 3
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono pt-1">
                      {selectedCandidate.popTestScore || 'Prueba no realizada aún'}
                    </p>
                  </div>
                </div>

                {/* Estatus de los 6 Documentos Oficiales (Etapa 7) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="font-bold text-slate-300 text-xs block">
                    Checklist de los 6 Documentos Oficiales (Etapa 7 para Alta):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.identificacion ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      1. INE / Identificación
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.estudios ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      2. Comp. Estudios
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.domicilio ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      3. Comp. Domicilio
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.fiscal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      4. Constancia Fiscal
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.rfc ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      5. RFC
                    </div>
                    <div className={`p-2.5 rounded-lg border text-center ${selectedCandidate.documentosEstado?.curp ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      6. CURP
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivo de Excepción Amarillo si aplica */}
              {selectedCandidate.manualReviewReason && (
                <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 shadow-xl">
                  <span className="font-bold flex items-center gap-2 text-amber-400 text-sm mb-1">
                    <ShieldAlert className="h-5 w-5" /> Detalle de Revisión Manual (Semáforo Amarillo por Excepción):
                  </span>
                  {selectedCandidate.manualReviewReason}
                </div>
              )}

              {/* Resumen Ejecutivo 360° */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
                <span className="font-bold text-sky-400 flex items-center gap-2 text-base">
                  <Sparkles className="h-5 w-5 text-sky-400" /> Diagnóstico Ejecutivo 360° del Lector de CV (Gemini AI)
                </span>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">{selectedCandidate.aiAnalysis}</p>
                {selectedCandidate.fitAssessment && (
                  <div className="pt-3 border-t border-slate-800/80 text-xs font-semibold text-indigo-300">
                    {selectedCandidate.fitAssessment}
                  </div>
                )}
              </div>

              {/* Desglose Cuantitativo de los 5 Pilares de Evaluación */}
              <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl backdrop-blur-xl">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-400" /> Ponderación Desglosada por los 5 Pilares del Socio Comercial
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Pilar 1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-200">💰 Autonomía Financiera ({selectedCandidate.financialBufferMonths}m Colchón)</span>
                      <span className="text-sky-400 font-mono font-bold text-sm">{selectedCandidate.pillarScores?.financialAutonomy || 80}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: `${selectedCandidate.pillarScores?.financialAutonomy || 80}%` }} />
                    </div>
                  </div>

                  {/* Pilar 2 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-200">🚗 Movilidad & Cobertura ({selectedCandidate.hasCar ? 'Con Auto' : 'Sin Auto'})</span>
                      <span className="text-emerald-400 font-mono font-bold text-sm">{selectedCandidate.pillarScores?.mobilityAndReach || (selectedCandidate.hasCar ? 100 : 50)}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedCandidate.pillarScores?.mobilityAndReach || (selectedCandidate.hasCar ? 100 : 50)}%` }} />
                    </div>
                  </div>

                  {/* Pilar 3 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-200">📈 Visión 100% Variable (Aversión a Fijo)</span>
                      <span className="text-indigo-400 font-mono font-bold text-sm">{selectedCandidate.pillarScores?.commissionMindset || 100}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${selectedCandidate.pillarScores?.commissionMindset || 100}%` }} />
                    </div>
                  </div>

                  {/* Pilar 4 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-200">💼 Venta Consultiva ({selectedCandidate.salesExperienceYears} Años Experiencia)</span>
                      <span className="text-purple-400 font-mono font-bold text-sm">{selectedCandidate.pillarScores?.consultativeSalesExperience || 85}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${selectedCandidate.pillarScores?.consultativeSalesExperience || 85}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fortalezas vs Alertas de Riesgo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl space-y-3 shadow-xl">
                  <span className="font-bold text-emerald-400 flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5" /> Fortalezas Clave Detectadas en el CV:
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {selectedCandidate.strengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold text-base">•</span>
                        <span className="leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl space-y-3 shadow-xl">
                  <span className="font-bold text-amber-400 flex items-center gap-2 text-base">
                    <AlertTriangle className="h-5 w-5" /> Alertas de Riesgo & Puntos Ciegos a Cuidar:
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {selectedCandidate.riskAlerts?.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold text-base">•</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preguntas Guía Personalizadas para la Entrevista */}
              {selectedCandidate.recommendedInterviewQuestions && (
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-xs sm:text-sm space-y-4 shadow-xl">
                  <span className="font-bold text-indigo-400 flex items-center gap-2 text-base">
                    <Award className="h-5 w-5 text-indigo-400" /> Guía de Entrevista Específica para este Candidato:
                  </span>
                  <ul className="space-y-3 text-slate-200">
                    {selectedCandidate.recommendedInterviewQuestions.map((q: string, i: number) => (
                      <li key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-sky-400 mr-2 text-sm">P{i + 1}:</span>
                        <span className="leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracto de Puntos Destacados del CV */}
              {selectedCandidate.cvHighlights && (
                <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 text-xs space-y-2 shadow-xl">
                  <span className="font-bold text-slate-300 text-sm">Extracto de Texto del CV Recibido:</span>
                  <p className="text-slate-400 font-mono text-xs leading-relaxed">{selectedCandidate.cvHighlights}</p>
                </div>
              )}

              <div className="h-12" />
            </div>
          </div>

          {/* FOOTER FIJO DE ACCIONES DE LA PANTALLA COMPLETA */}
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-2xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => updateCandidateStatus(selectedCandidate.id, 'APPROVED', 'GREEN')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="h-4 w-4" /> Aprobar Candidato (Verde)
              </button>

              <button
                onClick={() => updateCandidateStatus(selectedCandidate.id, 'PENDING', 'YELLOW')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/30"
              >
                Marcar para Revisión (Amarillo)
              </button>

              <button
                onClick={() => updateCandidateStatus(selectedCandidate.id, 'REJECTED', 'RED')}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30"
              >
                <XCircle className="h-4 w-4" /> Descartar Candidato (Rojo)
              </button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={getWhatsAppLink(selectedCandidate)}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <MessageSquare className="h-4 w-4" /> Contactar por WhatsApp 1-Clic
              </a>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all border border-slate-700/60"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>

        </div>,
        document.body
      )}
    </div>
  );
};
