'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Play, Settings, Terminal, Sparkles, CheckCircle2, Shield, RefreshCw, Cpu, Layers, ArrowRight, Zap, Code, Sliders, ChevronRight } from 'lucide-react';

export const AgencyAgentsDashboard: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningWorkflow, setRunningWorkflow] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [editingPrompt, setEditingPrompt] = useState('');
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
        // Simulación animada paso a paso del flujo autónomo
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

          <button
            onClick={runSwarmWorkflow}
            disabled={runningWorkflow}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            {runningWorkflow ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" /> Ejecutar Flujo Autónomo del Swarm
              </>
            )}
          </button>
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
              <Zap className="h-4 w-4" /> 908 Tareas
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Precisión de Fit Comercial</span>
            <span className="font-extrabold text-lg text-indigo-400 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="h-4 w-4" /> 94.8% Match
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Motor de IA Generativa</span>
            <span className="font-extrabold text-lg text-purple-400 flex items-center gap-1.5 mt-0.5">
              <Layers className="h-4 w-4" /> Gemini 1.5 Flash
            </span>
          </div>
        </div>
      </div>

      {/* Flujo de Trabajo Visual entre Agentes (Swarm Workflow Pipeline) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" /> Diagrama de Colaboración entre Agentes (Agency Swarm Pipeline)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1 relative">
            <span className="text-xl block">✍️</span>
            <span className="font-bold text-slate-200 block text-[11px]">1. Copywriter</span>
            <span className="text-[10px] text-slate-400 block">Estrategia & Copys</span>
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

      {/* Grid de Tarjetas de Agentes (Agency-Agents GitHub Style) */}
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
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> ACTIVO
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
        ))}
      </div>

      {/* Consola de Ejecución en Tiempo Real (Chain of Thought Log) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" /> Consola de Pensamiento del Enjambre (Chain-of-Thought Logs)
          </span>
          <span className="text-[10px] font-mono text-slate-400">Status: Idle / Ready</span>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 max-h-64 overflow-y-auto border border-slate-800/80">
          {logs.length === 0 ? (
            <p className="text-slate-400 text-center py-6 text-xs">
              Haz clic en **"Ejecutar Flujo Autónomo del Swarm"** arriba para ver a los agentes colaborar en tiempo real.
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
