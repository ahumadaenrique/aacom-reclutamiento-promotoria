'use client';

import React, { useState, useEffect } from 'react';
import { TrafficLightBadge } from './TrafficLightBadge';
import { Search, Phone, Mail, Car, ShieldAlert, CheckCircle2, XCircle, MessageSquare, ExternalLink, RefreshCw, Eye } from 'lucide-react';

export const CRMTable: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

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
    const message = encodeURIComponent(
      `¡Hola ${cand.fullName}! Hablamos de la Promotoría AACOM. Evaluamos tu perfil para la posición de Socio Comercial y nos llamó mucho la atención tu trayectoria. Nos gustaría agendar una breve entrevista inicial esta semana. ¿Tienes disponibilidad mañana?`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda y Filtros de Semáforo */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar candidato por nombre, email, teléfono o background..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Botones de Filtro Semáforo */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
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

      {/* Tabla de Candidatos */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Candidato</th>
                <th className="px-4 py-3.5">Semáforo & Match</th>
                <th className="px-4 py-3.5">Auto & Respaldo</th>
                <th className="px-4 py-3.5">Background</th>
                <th className="px-4 py-3.5">Estado Revisión</th>
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
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No se encontraron candidatos con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                candidates.map((cand) => (
                  <tr
                    key={cand.id}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedCandidate(cand)}
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-100 text-sm">{cand.fullName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {cand.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {cand.phone}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <TrafficLightBadge status={cand.status} score={cand.score} size="sm" />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cand.hasCar
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {cand.hasCar ? '🚗 Con Auto' : '🚶 Sin Auto'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {cand.financialBufferMonths}m Colchón
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 font-medium text-slate-200">
                      {cand.background}
                      {cand.highNetWorthAccess && (
                        <span className="ml-1 text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                          HNW
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          cand.reviewStatus === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : cand.reviewStatus === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-300 animate-pulse'
                        }`}
                      >
                        {cand.reviewStatus === 'APPROVED'
                          ? 'Aprobado'
                          : cand.reviewStatus === 'REJECTED'
                          ? 'Descartado'
                          : 'Pendiente Revisión'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón WhatsApp 1-Clic */}
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
                          title="Ver Expediente Completo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer Expediente del Candidato */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto text-slate-100 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCandidate.fullName}</h3>
                <p className="text-xs text-slate-400">{selectedCandidate.email} • {selectedCandidate.phone}</p>
              </div>
              <TrafficLightBadge status={selectedCandidate.status} score={selectedCandidate.score} size="lg" />
            </div>

            {/* Motivo de Excepción Amarillo si aplica */}
            {selectedCandidate.manualReviewReason && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                <span className="font-bold flex items-center gap-1 text-amber-400 mb-1">
                  <ShieldAlert className="h-4 w-4" /> Detalle de Revisión Manual (Excepción Amarillo):
                </span>
                {selectedCandidate.manualReviewReason}
              </div>
            )}

            {/* Diagnóstico de IA */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-2">
              <span className="font-bold text-sky-400">Diagnóstico de Inteligencia Artificial:</span>
              <p className="text-slate-300">{selectedCandidate.aiAnalysis}</p>
            </div>

            {/* Detalles Técnicos */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Vehículo Propio</span>
                <span className="font-bold text-slate-200">
                  {selectedCandidate.hasCar ? '✅ Sí' : '❌ No'}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Respaldo Financiero</span>
                <span className="font-bold text-slate-200">{selectedCandidate.financialBufferMonths} Meses</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">100% Comisionista</span>
                <span className="font-bold text-slate-200">
                  {selectedCandidate.commissionOnly ? '✅ Acepta' : '❌ No Acepta'}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Background</span>
                <span className="font-bold text-slate-200">{selectedCandidate.background}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Universidad</span>
                <span className="font-bold text-slate-200">{selectedCandidate.targetUniversity || 'N/A'}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Mercado Alto HNW</span>
                <span className="font-bold text-slate-200">
                  {selectedCandidate.highNetWorthAccess ? '✅ Sí' : '❌ No'}
                </span>
              </div>
            </div>

            {/* Preguntas Recomendadas para Entrevista */}
            {selectedCandidate.recommendedInterviewQuestions && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-indigo-400 block mb-2">
                  Preguntas Guía Recomendadas para la Entrevista:
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {selectedCandidate.recommendedInterviewQuestions.map((q: string, i: number) => (
                    <li key={i}>• {q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Acciones del Promotor */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCandidateStatus(selectedCandidate.id, 'APPROVED', 'GREEN')}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" /> Aprobar (Verde)
                </button>
                <button
                  onClick={() => updateCandidateStatus(selectedCandidate.id, 'PENDING', 'YELLOW')}
                  className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  Marcar Amarillo
                </button>
                <button
                  onClick={() => updateCandidateStatus(selectedCandidate.id, 'REJECTED', 'RED')}
                  className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <XCircle className="h-4 w-4" /> Descartar (Rojo)
                </button>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
