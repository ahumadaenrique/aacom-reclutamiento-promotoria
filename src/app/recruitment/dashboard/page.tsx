import { CRMTable } from '../_components/CRMTable';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Dashboard de Reclutamiento AACOM & Trineo de Candidatos
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gestión automatizada de candidatos clasificados por Semáforo (🟢 Verde Aprobado, 🟡 Amarillo Revisión Excepcional, 🔴 Rojo Descartado).
          </p>
        </div>
      </div>

      <CRMTable />
    </div>
  );
}
