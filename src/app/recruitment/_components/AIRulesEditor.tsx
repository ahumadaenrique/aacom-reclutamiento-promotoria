'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Save, Sliders, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export const AIRulesEditor: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recruitment/ai-rules');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error cargando reglas de IA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/recruitment/ai-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        alert('¡Cerebro de IA Parametrizado con éxito! Las reglas fueron aplicadas.');
      }
    } catch (err) {
      alert('Error guardando reglas');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-slate-400">Cargando Cerebro de Inteligencia Artificial...</div>;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400" /> Cerebro de Inteligencia Artificial Parametrizable
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Modifica el Prompt del Sistema de Gemini, los pesos de evaluación y las reglas de Semáforo sin tocar código.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar y Aplicar Reglas'}
        </button>
      </div>

      {/* Prompt del Sistema */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-sky-400" /> System Prompt Principal (Instrucción Mástra de Gemini AI)
        </label>
        <textarea
          rows={5}
          value={data.settings.systemPrompt}
          onChange={(e) =>
            setData({
              ...data,
              settings: { ...data.settings, systemPrompt: e.target.value },
            })
          }
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Umbrales de Semáforo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-emerald-400 mb-1">
            Umbral Semáforo Verde 🟢 (Score Mínimo)
          </label>
          <input
            type="number"
            min={50}
            max={100}
            value={data.settings.greenThreshold}
            onChange={(e) =>
              setData({
                ...data,
                settings: { ...data.settings, greenThreshold: parseFloat(e.target.value) },
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-amber-400 mb-1">
            Umbral Semáforo Amarillo 🟡 (Revisión Excepcional)
          </label>
          <input
            type="number"
            min={30}
            max={80}
            value={data.settings.yellowThreshold}
            onChange={(e) =>
              setData({
                ...data,
                settings: { ...data.settings, yellowThreshold: parseFloat(e.target.value) },
              })
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono"
          />
        </div>
      </div>

      {/* Reglas y Pesos */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-400" /> Matriz de Ponderación y Reglas de Negocio
        </h3>

        <div className="space-y-3">
          {data.rules.map((rule: any, index: number) => (
            <div key={rule.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-100">{rule.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rule.category === 'MANDATORY'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {rule.category === 'MANDATORY' ? 'Indispensable' : 'Excepción Amarillo'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{rule.description}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Peso de Puntuación</span>
                  <input
                    type="number"
                    value={rule.weight}
                    onChange={(e) => {
                      const updatedRules = [...data.rules];
                      updatedRules[index].weight = parseFloat(e.target.value) || 0;
                      setData({ ...data, rules: updatedRules });
                    }}
                    className="w-20 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-100 font-mono text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
