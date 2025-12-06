import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../services/auth'
import jwt_decode from "jwt-decode"

export default function Nav({ updateAuth }) {
  const navigate = useNavigate()
  const token = getToken()
  let user = null

  if (token) {
    try {
      user = jwt_decode(token)
    } catch (err) {
      console.error("Token inválido:", err)
    }
  }

  const onLogout = () => { 
    clearToken()
    // Disparar evento para actualizar estado en App.jsx
    window.dispatchEvent(new Event('authChange'))
    navigate('/')
    // Forzar recarga completa para asegurar estado limpio
    window.location.reload()
  }

  return (
    <nav className="nav">
      <div className="brand">SENA ParkControl</div>
      <div className="links">

        <NavLink to="/dashboard">Dashboard</NavLink>

        {/* SOLO ADMIN */}
        {(user?.idRol === 1 || user?.idRolName === "Administrador") && (
          <>
            <NavLink to="/users">Usuarios</NavLink>
            <NavLink to="/reportes">Reportes</NavLink>
          </>
        )}

        {/* VIGILANTE - ya tiene acceso a Movimientos por la ruta general abajo */}
        {user?.idRolName === "Vigilante" && (
          <NavLink to="/reportes">Reportes</NavLink>
        )}

        {/* TODOS los roles pueden ver Movimientos (pero con permisos diferentes) */}
        <NavLink to="/movimientos">Movimientos</NavLink>

        {/* APRENDIZ / INSTRUCTOR / VISITANTE */}
        {["Aprendiz", "Instructor", "Visitante", "Administrador", "Vigilante"]
          .includes(user?.idRolName) && (
            <NavLink to="/vehicles">Vehículos</NavLink>
        )}

        <button onClick={onLogout} className="btn-logout">Cerrar sesión</button>
      </div>
    </nav>
  )
}