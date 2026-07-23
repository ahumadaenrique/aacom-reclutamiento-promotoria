'use client';

import React, { useState } from 'react';
import { TrafficLightBadge } from './TrafficLightBadge';
import { Car, DollarSign, Briefcase, Award, Send, CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

export const JobApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Ciudad de México',
    hasCar: true,
    financialBufferMonths: 3,
    commissionOnly: true,
    salesExperienceYears: 3,
    background: 'Banca',
    targetUniversity: '',
    highNetWorthAccess: true,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/recruitment/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      alert('Error enviando postulación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-6 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          Test de Elegibilidad en Tiempo Real
        </div>
        <h2 className="text-2xl font-bold text-white">Postulación: Socio Comercial Ideal AACOM</h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Completa los campos para recibir tu evaluación instantánea con nuestro motor de Inteligencia Artificial.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Personales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Ej. Carlos Mendoza"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="carlos@ejemplo.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono (WhatsApp) *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+525512345678"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad de Residencia</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Filtros de Hierro & Requisitos */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <Award className="h-4 w-4" /> Filtros de Hierro y Respaldo Operativo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Movilidad */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-sky-400" />
                  ¿Cuentas con automóvil propio?
                </span>
                <input
                  type="checkbox"
                  checked={formData.hasCar}
                  onChange={(e) => setFormData({ ...formData, hasCar: e.target.checked })}
                  className="h-4 w-4 accent-sky-500 rounded"
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Requerido para visitas a empresas y cierres corporativos de alto valor.
              </p>
            </div>

            {/* Esquema Variable */}
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  ¿Aceptas esquema 100% comisiones sin tope?
                </span>
                <input
                  type="checkbox"
                  checked={formData.commissionOnly}
                  onChange={(e) => setFormData({ ...formData, commissionOnly: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500 rounded"
                />
              </label>
              <p className="text-[11px] text-slate-400 mt-1">
                Huyes del sueldo fijo porque limita tu capacidad de facturación ($50,000+ MXN).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Respaldo Financiero */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Respaldo Financiero (Meses de colchón para la curva de arranque)
              </label>
              <select
                value={formData.financialBufferMonths}
                onChange={(e) =>
                  setFormData({ ...formData, financialBufferMonths: parseInt(e.target.value) })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value={0}>Menos de 1 mes (Insuficiente)</option>
                <option value={1}>1 a 2 meses</option>
                <option value={3}>3 meses (Respaldo recomendando)</option>
                <option value={4}>4 meses o más (Ideal)</option>
              </select>
            </div>

            {/* Experiencia Comercial */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Años de experiencia en Ventas Consultivas / Cartera
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={formData.salesExperienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, salesExperienceYears: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Background y Factor Excepcional */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Historial & Red de Contactos (Factores de Excepción)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industria de Origen</label>
              <select
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              >
                <option value="Banca">Ex-ejecutivo Bancario / Patrimonial</option>
                <option value="Inmobiliaria">Asesor Inmobiliario (Medio-Alto)</option>
                <option value="Autos Premium">Ventas Autos Premium (BMW, Audi, Porsche)</option>
                <option value="Tech B2B">Ventas Tecnología B2B / Software</option>
                <option value="Otro">Otra Industria Comercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Universidad de Egreso (Si aplica)
              </label>
              <input
                type="text"
                value={formData.targetUniversity}
                onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
                placeholder="Ej. Tec de Monterrey, ITAM, Anáhuac, ITESO, Ibero..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
              <span>¿Tienes acceso o red de contactos activa con dueños de empresas / ejecutivos?</span>
              <input
                type="checkbox"
                checked={formData.highNetWorthAccess}
                onChange={(e) => setFormData({ ...formData, highNetWorthAccess: e.target.checked })}
                className="h-4 w-4 accent-indigo-500 rounded"
              />
            </label>
            <p className="text-[11px] text-slate-400 mt-1">
              *Factor clave de excepción: Si no tienes auto propio actualmente pero cuentas con esta red o prestigio universitario, podrías calificar para revisión manual en Semáforo Amarillo 🟡.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Resumen de Trayectoria / Notas del CV
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Menciona tus logros comerciales más relevantes o copia un extracto de tu CV..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" /> Evaluar Postulación en Tiempo Real
            </>
          )}
        </button>
      </form>

      {/* Resultado Instantáneo */}
      {result && (
        <div className="mt-8 pt-6 border-t border-slate-800 animate-fadeIn">
          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Resultado de la Evaluación Autónoma</h3>
              <TrafficLightBadge
                status={result.data.status}
                score={result.data.score}
                size="lg"
              />
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed mb-4">
              <p className="font-semibold text-sky-400 mb-1">Diagnóstico de Inteligencia Artificial:</p>
              <p>{result.data.aiAnalysis}</p>
              {result.data.manualReviewReason && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                  <strong>Detalle de Excepción:</strong> {result.data.manualReviewReason}
                </div>
              )}
            </div>

            {/* Puntos de Fuerza y Riesgos */}
            {result.data.strengths && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle className="h-4 w-4" /> Fortalezas Detectadas:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {result.data.strengths.map((s: string, idx: number) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Factores a Validar:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {result.data.riskAlerts?.map((r: string, idx: number) => (
                      <li key={idx}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
