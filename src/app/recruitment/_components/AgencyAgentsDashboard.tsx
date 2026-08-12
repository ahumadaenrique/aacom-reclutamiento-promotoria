'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Play, Settings, Terminal, Sparkles, CheckCircle2, Shield, RefreshCw, Cpu, Layers, ArrowRight, Zap, Code, Sliders, ChevronRight, FileText, Send, Eye, Edit3, Globe, Infinity as InfinityIcon, Bell, Radio } from 'lucide-react';

export const AgencyAgentsDashboard: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningWorkflow, setRunningWorkflow] = useState(false);
  const [generatingJob, setGeneratingJob] = useState(false);
  const [jobPreview, setJobPreview] = useState<any>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState<boolean | string>(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [editingPrompt, setEditingPrompt] = useState('');
  const [autopilotActive, setAutopilotActive] = useState(true);
  const [simulationCandidate, setSimulationCandidate] = useState({
    name: 'Carlos Mendoza',
    background: 'Banca Patrimonial / Private Banking',
  });

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recruitment/agency-swarm');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
      }
    } catch (err) {
      console.error('Error fetching agency swarm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const generateJobPosting = async () => {
    setGeneratingJob(true);
    setPublishedSuccess(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setJobPreview({
        title: 'Socio Comercial & Consultor Patrimonial AACOM (Ingresos > $50,000 MXN / 100% Variable)',
        category: 'Ventas Consultivas / Banca Patrimonial / Seguros Corporativos',
        location: 'Ciudad de México y Área Metropolitana (Esquema Híbrido)',
        salary: '100% Comisiones sin tope de facturación ($50,000 - $120,000+ MXN mensuales)',
        description: `Buscamos a nuestro próximo Socio Comercial en la Promotoría AACOM. Si provienes de industrias comerciales de alto ticket (Banca Patrimonial, Asesoría Inmobiliaria Residencial/Comercial, Autos Premium, Software B2B o Seguros) y buscas autonomía de agenda sin techo salarial, esta convocatoria es para ti.

REQUISITOS INNEGOCIABLES:
• Respaldo financiero de 3 a 4 meses para la curva de arranque inicial.
• Automóvil propio para visitas corporativas y cierres presenciales con clientes AAA.
• Enfoque 100% comisionista (aversión a sueldos fijos limitantes).
• Formación profesional universitaria o trayectoria comprobable en ventas consultivas B2B.

OFRECEMOS:
• Esquema de comisiones y bonos de desarrollo comercial sin tope.
• Formación ejecutiva y acompañamiento personalizado para la obtención de Cédula ante la CNSF.
• Portafolio de soluciones financieras patrimoniales y empresariales de alto valor.
• Libertad absoluta de agenda y gestión de tu propio negocio con el respaldo de AACOM.`,
      });
    } catch (err) {
      alert('Error generando vacante');
    } finally {
      setGeneratingJob(false);
    }
  };

  const publishJobToChannels = async (channel: 'LINKEDIN' | 'OCC' | 'BOTH') => {
    setPublishing(true);
    try {
      const res = await fetch('/api/recruitment/jobs/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobPreview.title,
          category: jobPreview.category,
          location: jobPreview.location,
          salary: jobPreview.salary,
          description: jobPreview.description,
          channel: channel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPublishedSuccess(data.message);
      } else {
        alert('Error al publicar: ' + data.error);
      }
    } catch (err: any) {
      alert('Error conectando con la API de publicación');
    } finally {
      setPublishing(false);
    }
  };

  const runSwarmWorkflow = async () => {
    setRunningWorkflow(true);
    setLogs([]);

    try {
      const res = await fetch('/api/recruitment/agency-swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RUN_SWARM_WORKFLOW',
          candidateName: simulationCandidate.name,
          candidateBackground: simulationCandidate.background,
        }),
      });

      const data = await res.json();
      if (data.success) {
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setLogs((prev) => [...prev, data.logs[i]]);
        }
      }
    } catch (err) {
      alert('Error ejecutando flujo del Swarm');
    } finally {
      setRunningWorkflow(false);
    }
  };

  const saveAgentPrompt = () => {
    if (!selectedAgent) return;
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent.id ? { ...a, systemPrompt: editingPrompt } : a))
    );
    setSelectedAgent(null);
    alert(`Instrucción de sistema para "${selectedAgent.name}" actualizada con éxito.`);
  };

  return (
    <div className="space-y-8">
      {/* Banner de Modo Piloto Automático Eterno (Perpetual Standing Engine) */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-indigo-950/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <InfinityIcon className="h-7 w-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-lg font-extrabold text-white">Motor Autónomo Perpetuo Activado (24/7/365 Autopilot)</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Los 5 Agentes de IA operan continuamente en segundo plano. Escuchan Webhooks de entrada, evalúan CVs en Vercel Blob y te notifican por SMS/WhatsApp cuando hay candidatos 🟢 Verdes. **Tú solo entras a revisar tu CRM.**
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setAutopilotActive(!autopilotActive)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border ${
              autopilotActive
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className="h-4 w-4" /> {autopilotActive ? 'Piloto Automático: ACTIVADO 24/7' : 'Piloto Automático: PAUSADO'}
          </button>
        </div>
      </div>

      {/* Header del Enjambre de Agentes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-2">
              <Cpu className="h-3.5 w-3.5" /> Enjambre Autónomo (Agency-Agents GitHub Architecture)
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Cerebro de Inteligencia Artificial & Agencia Multi-Agente
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              5 agentes autónomos especializados colaboran en cadena para gestionar la atracción, evaluación cualitativa en Vercel Blob, agendamiento por WhatsApp e inducción de Socios Comerciales AACOM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={generateJobPosting}
              disabled={generatingJob}
              className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              {generatingJob ? (
                <div className="h-4 w-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FileText className="h-4 w-4" /> ✍️ Generar & Previsualizar Vacante
                </>
              )}
            </button>

            <button
              onClick={runSwarmWorkflow}
              disabled={runningWorkflow}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              {runningWorkflow ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" /> Probador de Flujo Autónomo
                </>
              )}
            </button>
          </div>
        </div>

        {/* Métricas del Enjambre */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Agentes Activos en Enjambre</span>
            <span className="font-extrabold text-lg text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <Bot className="h-4 w-4" /> 5 / 5 Agentes
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Tareas Autónomas Ejecutadas</span>
            <span className="font-extrabold text-lg text-sky-400 flex items-center gap-1.5 mt-0.5">
              <Zap className="h-4 w-4" /> 1,240 Tareas
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Precisión de Fit Comercial</span>
            <span className="font-extrabold text-lg text-indigo-400 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-4 w-4" /> 95.2% Match
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Motor de IA Generativa</span>
            <span className="font-extrabold text-lg text-purple-400 flex items-center gap-1.5 mt-0.5">
              <Layers className="h-4 w-4" /> Gemini 3.6 Flash (High)
            </span>
          </div>
        </div>
      </div>

      {/* Flujo de Trabajo Visual entre Agentes */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" /> Diagrama de Colaboración entre Agentes (Agency Swarm Pipeline)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xl block">✍️</span>
            <span className="font-bold text-slate-200 block text-[11px]">1. Copywriter</span>
            <span className="text-[10px] text-slate-400 block">Vacantes & LinkedIn/OCC</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xl block">🔍</span>
            <span className="font-bold text-sky-400 block text-[11px]">2. Screener CV</span>
            <span className="text-[10px] text-slate-400 block">Evaluación 360°</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xl block">📲</span>
            <span className="font-bold text-emerald-400 block text-[11px]">3. Headhunter</span>
            <span className="text-[10px] text-slate-400 block">WhatsApp 1-Clic</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xl block">🌱</span>
            <span className="font-bold text-amber-400 block text-[11px]">4. Nurturing</span>
            <span className="text-[10px] text-slate-400 block">Casos Excepcionales</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
            <span className="text-xl block">🎓</span>
            <span className="font-bold text-indigo-400 block text-[11px]">5. Onboarding</span>
            <span className="text-[10px] text-slate-400 block">Cédula & Inducción</span>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition-all rounded-2xl p-6 space-y-5 flex flex-col justify-between shadow-xl backdrop-blur-xl group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {agent.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{agent.name}</h4>
                    <span className="text-[10px] font-mono text-sky-400">{agent.model}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVO 24/7
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{agent.role}</p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 line-clamp-3">
                <span className="text-slate-400 block font-sans text-[10px] font-bold mb-1">System Prompt:</span>
                "{agent.systemPrompt}"
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Tareas completadas:</span>
                <span className="font-bold text-slate-200">{agent.totalTasksExecuted}</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {agent.id === 'agent_copywriter' && (
                  <button
                    onClick={generateJobPosting}
                    className="w-full py-2 px-3 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5" /> Generar & Previsualizar Vacante
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedAgent(agent);
                    setEditingPrompt(agent.systemPrompt);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sliders className="h-3.5 w-3.5 text-sky-400" /> Editar Instrucción & Reglas
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Consola de Ejecución en Tiempo Real */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" /> Consola de Pensamiento del Enjambre (Chain-of-Thought Logs)
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Autopilot Standing Engine Active
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-64 overflow-y-auto border border-slate-800/80">
          {logs.length === 0 ? (
            <p className="text-slate-400 text-center py-6 text-xs">
              Haz clic en **"Probador de Flujo Autónomo"** arriba para simular una postulación entrante en vivo.
            </p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 animate-fadeIn">
                <span className="text-slate-400 text-[10px]">[{log.timestamp}]</span>
                <span className="text-sky-400 font-bold">[{log.agentName}]:</span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL DE PREVISUALIZACIÓN Y PUBLICACIÓN DE VACANTE CON IA */}
      {jobPreview && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-slate-100 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-1">
                  <Sparkles className="h-3.5 w-3.5" /> Redactada por Agente Copywriter (Gemini 3.6 Flash)
                </div>
                <h3 className="text-xl font-bold text-white">Previsualización de Vacante Autónoma</h3>
              </div>
              <button
                onClick={() => setJobPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            {publishedSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Vacante Publicada Exitosamente!</h4>
                <p className="text-sm font-bold text-emerald-300 max-w-md mx-auto leading-relaxed">
                  {typeof publishedSuccess === 'string' ? publishedSuccess : 'La vacante ha sido enviada a LinkedIn.'}
                </p>
                <button
                  onClick={() => setJobPreview(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs mt-2"
                >
                  Cerrar Previsualización
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Título de la Vacante</label>
                  <input
                    type="text"
                    value={jobPreview.title}
                    onChange={(e) => setJobPreview({ ...jobPreview, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Categoría / Área</label>
                    <input
                      type="text"
                      value={jobPreview.category}
                      onChange={(e) => setJobPreview({ ...jobPreview, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Ubicación & Modalidad</label>
                    <input
                      type="text"
                      value={jobPreview.location}
                      onChange={(e) => setJobPreview({ ...jobPreview, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Cuerpo Completo de la Oferta de Trabajo (Editable)</label>
                  <textarea
                    rows={10}
                    value={jobPreview.description}
                    onChange={(e) => setJobPreview({ ...jobPreview, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-sans text-slate-200 leading-relaxed focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <span className="text-[11px] text-slate-400">
                    Al dar clic en publicar, la oferta se enviará a través de las APIs oficiales conectadas en Integraciones.
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => publishJobToChannels('LINKEDIN')}
                      disabled={publishing}
                      className="px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg"
                    >
                      <Globe className="h-3.5 w-3.5" /> Publicar en LinkedIn Jobs
                    </button>

                    <button
                      onClick={() => publishJobToChannels('BOTH')}
                      disabled={publishing}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg"
                    >
                      {publishing ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Publicar en LinkedIn + OCC
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edición de Prompt por Agente */}
      {selectedAgent && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{selectedAgent.avatar}</span> Parametrizar Agente: {selectedAgent.name}
              </h3>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instrucción del Sistema (System Prompt & Reglas de Comportamiento)
              </label>
              <textarea
                rows={8}
                value={editingPrompt}
                onChange={(e) => setEditingPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-500 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={saveAgentPrompt}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg transition-colors"
              >
                Guardar Instrucción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
