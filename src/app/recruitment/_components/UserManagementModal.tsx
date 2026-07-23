'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Lock, Shield, UserX, UserCheck, RefreshCw, KeyRound } from 'lucide-react';

export const UserManagementModal: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'RECRUITER',
    tempPassword: 'AAcom2026!',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/recruitment/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/recruitment/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        alert('Usuario creado con éxito. Contraseña temporal asignada.');
        setNewUser({ name: '', email: '', role: 'RECRUITER', tempPassword: 'AAcom2026!' });
        setShowAddForm(false);
        fetchUsers();
      }
    } catch (err) {
      alert('Error creando usuario');
    }
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/recruitment/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (err) {
      alert('Error cambiando estado');
    }
  };

  const resetUserPassword = async (id: string) => {
    if (!confirm('¿Resetear la contraseña de este usuario? Deberá cambiarla al iniciar sesión.')) return;
    try {
      const res = await fetch('/api/recruitment/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resetPassword: true }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Contraseña temporal reseteada a: ResetPassword2026!');
        fetchUsers();
      }
    } catch (err) {
      alert('Error reseteando contraseña');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-sky-400" /> Administración de Usuarios y Seguridad
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de roles (Admin, Reclutador, Candidato), alta/baja, suspensión y cambio obligatorio de contraseña temporal.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20"
        >
          <UserPlus className="h-4 w-4" /> {showAddForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {/* Formulario de Alta de Usuario */}
      {showAddForm && (
        <form onSubmit={handleCreateUser} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4 animate-fadeIn">
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider">Alta de Nuevo Usuario</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Rol Asignado</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
              >
                <option value="ADMIN">Administrador (Acceso Total)</option>
                <option value="RECRUITER">Reclutador / Consultor</option>
                <option value="CANDIDATE">Candidato</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1">Contraseña Temporal</label>
              <input
                type="text"
                value={newUser.tempPassword}
                onChange={(e) => setNewUser({ ...newUser, tempPassword: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
          >
            Guardar Usuario y Forzar Cambio de Clave
          </button>
        </form>
      )}

      {/* Tabla de Usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estatus</th>
              <th className="px-4 py-3">Cambio Clave Obligatorio</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-100">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>

                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {u.role}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : u.status === 'SUSPENDED'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {u.status === 'ACTIVE' ? 'Activo' : u.status === 'SUSPENDED' ? 'Suspendido' : 'Inactivo'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {u.mustChangePassword ? (
                    <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                      <KeyRound className="h-3.5 w-3.5" /> Pendiente Cambio Clave
                    </span>
                  ) : (
                    <span className="text-emerald-400 text-[11px]">✅ Clave Definida</span>
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.status === 'ACTIVE' ? (
                      <button
                        onClick={() => updateUserStatus(u.id, 'SUSPENDED')}
                        className="px-2.5 py-1 rounded bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-medium transition-colors"
                      >
                        Suspender
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUserStatus(u.id, 'ACTIVE')}
                        className="px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-medium transition-colors"
                      >
                        Activar
                      </button>
                    )}

                    <button
                      onClick={() => resetUserPassword(u.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                      title="Resetear a contraseña temporal"
                    >
                      Reset Clave
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
