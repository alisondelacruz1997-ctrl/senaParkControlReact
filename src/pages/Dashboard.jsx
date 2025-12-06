import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getToken } from '../services/auth';
import jwt_decode from "jwt-decode";

export default function Dashboard() {
  const [summary, setSummary] = useState({ usuarios: 0, vehiculos: 0, dentro: 0 });
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Obtener datos del token
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Token inválido:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        // ADMINISTRADOR → puede ver todo
        if (user.idRol === 1 || user.idRolName === "Administrador") {
          const users = await api.request('/users', { method: 'GET' });
          const veh = await api.request('/vehicles', { method: 'GET' });
          const mov = await api.request('/movimientos', { method: 'GET' });

          const dentro = mov.filter(m => m.Estado === "dentro").length;

          setSummary({
            usuarios: users.length,
            vehiculos: veh.length,
            dentro
          });
        }

        // VIGILANTE → movimientos del día
        else if (user.idRolName === "Vigilante") {
          const mov = await api.request('/movimientos', { method: 'GET' });
          const dentro = mov.filter(m => m.Estado === "dentro").length;

          setSummary({
            dentro,
            usuarios: null,
            vehiculos: null
          });
        }

        // APRENDIZ / INSTRUCTOR / VISITANTE → solo sus vehículos
        else {
          // CAMBIO AQUÍ: usar solo '/vehicles/user' sin ID
          const veh = await api.request('/vehicles/user', { method: 'GET' });
          setSummary({
            vehiculos: veh.length,
            usuarios: null,
            dentro: null
          });
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    load();
  }, [user]);

  if (!user) return <div className="container"><h1>Cargando...</h1></div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <h3>Bienvenido, {user.nombre} — Rol: {user.idRolName}</h3>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {/* ADMINISTRADOR */}
        {(user.idRol === 1 || user.idRolName === "Administrador") && (
          <>
            <div className="card small">
              <h3>Usuarios registrados</h3>
              <div className="big">{summary.usuarios ?? '-'}</div>
            </div>

            <div className="card small">
              <h3>Vehículos registrados</h3>
              <div className="big">{summary.vehiculos ?? '-'}</div>
            </div>

            <div className="card small">
              <h3>Vehículos dentro del parqueadero</h3>
              <div className="big">{summary.dentro ?? '-'}</div>
            </div>
          </>
        )}

        {/* VIGILANTE */}
        {user.idRolName === "Vigilante" && (
          <div className="card small">
            <h3>Vehículos actualmente dentro</h3>
            <div className="big">{summary.dentro ?? '-'}</div>
          </div>
        )}

        {/* APRENDIZ / INSTRUCTOR / VISITANTE */}
        {["Aprendiz", "Instructor", "Visitante"].includes(user.idRolName) && (
          <div className="card small">
            <h3>Mis vehículos registrados</h3>
            <div className="big">{summary.vehiculos ?? '-'}</div>
          </div>
        )}
      </div>
    </div>
  );
}