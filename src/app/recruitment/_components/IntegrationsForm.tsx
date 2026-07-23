'use client';

import React, { useState, useEffect } from 'react';
import { Key, MessageSquare, Cpu, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export const IntegrationsForm: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchIntegrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recruitment/integrations');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error cargando integraciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/recruitment/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        alert('Credenciales e integraciones actualizadas correctamente.');
      }
    } catch (err) {
      alert('Error guardando credenciales');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Cargando llaves de Twilio y Gemini...</div>;
  }

  return (
    <form onSubmit={handleSave} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-sky-400" /> Configuración de Llaves e Integraciones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Conecta tus servicios de **Twilio SMS** y **Google Gemini AI** para notificaciones en vivo y análisis automatizado de CVs.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar Llaves'}
        </button>
      </div>

      {/* Integración Twilio SMS */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-400" /> Twilio SMS API (Notificaciones de Reclutamiento)
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Conexión Lista
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Twilio Account SID</label>
            <input
              type="text"
              value={data.twilio.accountSid}
              onChange={(e) =>
                setData({
                  ...data,
                  twilio: { ...data.twilio, accountSid: e.target.value },
                })
              }
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Twilio Auth Token</label>
            <input
              type="password"
              value={data.twilio.authToken}
              onChange={(e) =>
                setData({
                  ...data,
                  twilio: { ...data.twilio, authToken: e.target.value },
                })
              }
              placeholder="••••••••••••••••••••••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Número Emisor Twilio (From Phone)</label>
            <input
              type="text"
              value={data.twilio.fromPhone}
              onChange={(e) =>
                setData({
                  ...data,
                  twilio: { ...data.twilio, fromPhone: e.target.value },
                })
              }
              placeholder="+18005550199"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Teléfono Admin / Notificaciones Alertas</label>
            <input
              type="text"
              value={data.twilio.adminNotifyPhone}
              onChange={(e) =>
                setData({
                  ...data,
                  twilio: { ...data.twilio, adminNotifyPhone: e.target.value },
                })
              }
              placeholder="+525512345678"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Integración Gemini AI */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-sky-400" /> Google Gemini AI API (Motor de Evaluación de CVs)
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Conexión Activa
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Gemini API Key</label>
            <input
              type="password"
              value={data.gemini.apiKey}
              onChange={(e) =>
                setData({
                  ...data,
                  gemini: { ...data.gemini, apiKey: e.target.value },
                })
              }
              placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Modelo Seleccionado</label>
            <select
              value={data.gemini.model}
              onChange={(e) =>
                setData({
                  ...data,
                  gemini: { ...data.gemini, model: e.target.value },
                })
              }
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultrarrápido - Recomendado)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Razonamiento Complejo)</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};
