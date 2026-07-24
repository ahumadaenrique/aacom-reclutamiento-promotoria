'use client';

import React, { useState } from 'react';
import { Car, DollarSign, Briefcase, Award, Send, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

const INDUSTRY_OPTIONS = [
  'Asesoría Inmobiliaria Residencial (Medio-Alto)',
  'Asesoría Inmobiliaria Comercial e Industrial',
  'Banca Patrimonial / Private Banking',
  'Banca Comercial / Pymes',
  'Seguros y Fianzas',
  'Ventas Autos Premium (BMW, Audi, Porsche, Mercedes)',
  'Ventas Autos Comercial / Flotillas',
  'Ventas Software B2B / SaaS',
  'Ventas Hardware y Telecomunicaciones B2B',
  'Industria Farmacéutica / Salud',
  'Dispositivos y Equipamiento Médico',
  'Servicios Financieros / Fintech',
  'Fondos de Inversión y Capital de Riesgo',
  'Maquinaria e Industria Pesada',
  'Alimentos y Bebidas B2B / Distribución',
  'Logística, Cadena de Suministro y Transporte',
  'Consultoría de Negocios y Estrategia',
  'Bienes de Consumo / Retail Grandes Cuentas',
  'Comercio Exterior y Aduanas',
  'Educación Ejecutiva y Capacitación',
  'Desarrollo Urbano y Construcción',
  'Servicios de Publicidad, Marketing y Medios',
  'Asesoria Jurídica, Fiscal o Contable',
  'Otra Industria Comercial',
];

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
    background: 'Banca Patrimonial / Private Banking',
    targetUniversity: '',
    previousIncomeRange: '30k-50k',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/recruitment/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
      }
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
          Convocatoria Socio Comercial AACOM
        </div>
        <h2 className="text-2xl font-bold text-white">Formulario de Postulación Comercial</h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Buscamos talentos comerciales con visión empresarial para desarrollar una cartera de alto valor.
        </p>
      </div>

      {!submitted ? (
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil (WhatsApp) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+52 55 1234 5678"
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

          {/* Movilidad & Esquema Comercial (Redacción Amable) */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
              <Award className="h-4 w-4" /> Modalidad y Respaldo Operativo
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Movilidad (Redacción Amable sin "Requerido") */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-sky-400" />
                    ¿Cuentas con automóvil propio para traslados?
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.hasCar}
                    onChange={(e) => setFormData({ ...formData, hasCar: e.target.checked })}
                    className="h-4 w-4 accent-sky-500 rounded"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Facilita las visitas corporativas presenciales y atención personalizada.
                </p>
              </div>

              {/* Esquema 100% Comisionista */}
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-200 cursor-pointer">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    ¿Buscas un esquema 100% variable de altas comisiones?
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.commissionOnly}
                    onChange={(e) => setFormData({ ...formData, commissionOnly: e.target.checked })}
                    className="h-4 w-4 accent-emerald-500 rounded"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ideal para profesionales motivados por metas de ingresos superiores a $50,000 MXN sin tope.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Respaldo Financiero */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Respaldo financiero para la curva de arranque inicial
                </label>
                <select
                  value={formData.financialBufferMonths}
                  onChange={(e) =>
                    setFormData({ ...formData, financialBufferMonths: parseInt(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value={1}>1 a 2 meses</option>
                  <option value={3}>3 meses (Recomendado)</option>
                  <option value={4}>4 meses o más (Ideal)</option>
                </select>
              </div>

              {/* Experiencia Comercial */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Años de experiencia en ventas o gestión comercial
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

          {/* Industria de Origen & Nivel de Ingresos Previo */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Historial de Trayectoria Comercial
            </h3>

            {/* Combobox de Industria de Origen con Amplias Opciones */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-sky-400" /> Industria Comercial de Origen o Experiencia Principal
              </label>
              <select
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nivel de Ingreso Mensual Previo (Sustituye la pregunta agresiva de contactos) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Último nivel de ingresos mensuales promedio
                </label>
                <select
                  value={formData.previousIncomeRange}
                  onChange={(e) => setFormData({ ...formData, previousIncomeRange: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                >
                  <option value="<15k">Menos de $15,000 MXN / mes</option>
                  <option value="15k-30k">$15,000 a $30,000 MXN / mes</option>
                  <option value="30k-50k">$30,000 a $50,000 MXN / mes</option>
                  <option value="50k-80k">$50,000 a $80,000 MXN / mes</option>
                  <option value=">80k">Más de $80,000 MXN / mes</option>
                </select>
              </div>

              {/* Universidad de Egreso */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Universidad de egreso o formación profesional
                </label>
                <input
                  type="text"
                  value={formData.targetUniversity}
                  onChange={(e) => setFormData({ ...formData, targetUniversity: e.target.value })}
                  placeholder="Ej. Tec de Monterrey, ITAM, Anáhuac, Ibero, UNAM, ITESO..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Resumen breve de trayectoria / Comentarios adicionales
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Comparte tus logros comerciales más relevantes o un extracto de tu currículum..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
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
                <Send className="h-4 w-4" /> Enviar Postulación a la Promotoría
              </>
            )}
          </button>
        </form>
      ) : (
        /* Confirmación Amable para el Candidato (Sin revelar calificaciones ni semáforos) */
        <div className="py-12 text-center space-y-4 animate-fadeIn">
          <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-white">¡Postulación Recibida con Éxito!</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
            Gracias por tu interés en sumarte como Socio Comercial. En breve, un consultor de la **Promotoría AACOM** revisará tu perfil y se pondrá en contacto contigo a través de WhatsApp o correo electrónico.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  city: 'Ciudad de México',
                  hasCar: true,
                  financialBufferMonths: 3,
                  commissionOnly: true,
                  salesExperienceYears: 3,
                  background: 'Banca Patrimonial / Private Banking',
                  targetUniversity: '',
                  previousIncomeRange: '30k-50k',
                  notes: '',
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Enviar otra postulación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
