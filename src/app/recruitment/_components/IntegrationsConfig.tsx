'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, Key, Save, CheckCircle2, ShieldCheck, RefreshCw, Send, Globe, Link as LinkIcon, Building2, Briefcase, Cpu } from 'lucide-react';

export const IntegrationsConfig: React.FC = () => {
  const [integrations, setIntegrations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recruitment/integrations');
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.data);
      }
    } catch (err) {
      console.error('Error fetching integrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const saveIntegration = async (type: string, config: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/recruitment/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, config }),
      });
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.data);
        alert(`Configuración de ${type.toUpperCase()} guardada con éxito.`);
      }
    } catch (err) {
      alert('Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  const simulateWebhookPayload = async (provider: 'linkedin' | 'occ') => {
    setTestingWebhook(true);
    try {
      const endpoint = provider === 'linkedin' ? '/api/recruitment/webhooks/linkedin' : '/api/recruitment/webhooks/occ';
      const payload = provider === 'linkedin'
        ? {
            applicantName: 'Roberto Gómez (Importado LinkedIn)',
            email: 'roberto.gomez@linkedin.com',
            phone: '+525533221100',
            currentRole: 'Banca Patrimonial / Private Banking',
            university: 'Tec de Monterrey',
            income: '>80k',
            hasCar: true,
          }
        : {
            name: 'Fernanda Ortiz (Importada OCC)',
            email: 'fernanda.ortiz@occ.com',
            phone: '+525544332211',
            experienceArea: 'Asesoría Inmobiliaria Residencial (Medio-Alto)',
            university: 'Universidad Anáhuac',
            income: '50k-80k',
            hasVehicle: true,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(`✅ Simulación de Webhook ${provider.toUpperCase()} exitosa. El candidato "${payload.applicantName || payload.name}" fue ingresado al CRM y evaluado por el Agente Screener.`);
      }
    } catch (err: any) {
      alert('Error probando webhook: ' + err.message);
    } finally {
      setTestingWebhook(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Cargando integraciones...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
          <Globe className="h-3.5 w-3.5" /> Conexiones & Canales Oficiales
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configuración de Llaves de API & Webhooks Oficiales
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">
          Conecta tus llaves empresariales de Twilio, Gemini AI, LinkedIn Jobs API y OCC Mundial Employer API para habilitar el reclutamiento autónomo libre de banneos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* 1. LinkedIn Jobs API Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg">
                in
              </div>
              <div>
                <h3 className="font-bold text-white text-base">LinkedIn Jobs & Talent API (Oficial)</h3>
                <span className="text-[11px] text-slate-400">Publicación autónoma de vacantes e Ingestión de postulaciones via Webhook</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% LIBRE DE BANNEOS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">LinkedIn Client ID</label>
              <input
                type="text"
                value={integrations?.linkedin?.clientId || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    linkedin: { ...integrations.linkedin, clientId: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">LinkedIn Client Secret</label>
              <input
                type="password"
                value={integrations?.linkedin?.clientSecret || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    linkedin: { ...integrations.linkedin, clientSecret: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
            <span className="text-slate-400 font-bold block">URL del Webhook de Ingestión Automática para LinkedIn:</span>
            <code className="text-sky-400 block font-mono select-all">
              {integrations?.linkedin?.webhookUrl || 'https://aacom-reclutamiento-promotoria.vercel.app/api/recruitment/webhooks/linkedin'}
            </code>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => simulateWebhookPayload('linkedin')}
              disabled={testingWebhook}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Simular Ingestión de Candidato de LinkedIn
            </button>

            <button
              onClick={() => saveIntegration('linkedin', integrations.linkedin)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Guardar Conector LinkedIn
            </button>
          </div>
        </div>

        {/* 2. OCC Mundial Employer API Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg">
                OCC
              </div>
              <div>
                <h3 className="font-bold text-white text-base">OCC Mundial Employer API (Oficial)</h3>
                <span className="text-[11px] text-slate-400">Sincronización de vacantes e importación directa de postulantes</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              100% LIBRE DE BANNEOS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">OCC Employer API Key</label>
              <input
                type="text"
                value={integrations?.occ?.apiKey || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    occ: { ...integrations.occ, apiKey: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">OCC Secret Key</label>
              <input
                type="password"
                value={integrations?.occ?.secretKey || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    occ: { ...integrations.occ, secretKey: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] space-y-1">
            <span className="text-slate-400 font-bold block">URL del Webhook de Ingestión Automática para OCC Mundial:</span>
            <code className="text-indigo-400 block font-mono select-all">
              {integrations?.occ?.webhookUrl || 'https://aacom-reclutamiento-promotoria.vercel.app/api/recruitment/webhooks/occ'}
            </code>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => simulateWebhookPayload('occ')}
              disabled={testingWebhook}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" /> Simular Ingestión de Candidato de OCC
            </button>

            <button
              onClick={() => saveIntegration('occ', integrations.occ)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Guardar Conector OCC
            </button>
          </div>
        </div>

        {/* 3. Gemini / Multi-Model AI Selector Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Sparkles className="h-5 w-5" /> Selector de Modelo de Inteligencia Artificial (Engine Selector)
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Futureproof Multi-LLM
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gemini / AI API Key</label>
              <input
                type="password"
                value={integrations?.gemini?.apiKey || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    gemini: { ...integrations.gemini, apiKey: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Modelo de IA Seleccionado</label>
              <select
                value={integrations?.gemini?.model || 'gemini-3.6-flash'}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    gemini: { ...integrations.gemini, model: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (High) - Rápido & Ultra-preciso (Recomendado)</option>
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Medium)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
                <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (Estándar)</option>
                <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro (Razonamiento Complejo)</option>
                <option value="claude-3-5-sonnet">Claude Sonnet 3.5 / 4.6 (Thinking)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => saveIntegration('gemini', integrations.gemini)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Guardar Modelo de IA Seleccionado
            </button>
          </div>
        </div>

        {/* 4. Twilio SMS Configuration Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <MessageSquare className="h-5 w-5" /> Twilio SMS Credentials (Modo Pruebas Activado)
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Simulación Sin Costo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Account SID</label>
              <input
                type="text"
                value={integrations?.twilio?.accountSid || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    twilio: { ...integrations.twilio, accountSid: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Auth Token</label>
              <input
                type="password"
                value={integrations?.twilio?.authToken || ''}
                onChange={(e) =>
                  setIntegrations({
                    ...integrations,
                    twilio: { ...integrations.twilio, authToken: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => saveIntegration('twilio', integrations.twilio)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="h-3.5 w-3.5" /> Guardar Llaves Twilio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
