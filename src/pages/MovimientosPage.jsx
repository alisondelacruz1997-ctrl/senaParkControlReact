import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { getToken } from '../services/auth'
import jwt_decode from "jwt-decode"

export default function MovimientosPage() {

  const [placa, setPlaca] = useState('')
  const [movimientos, setMovimientos] = useState([])

  // Obtener rol del token
  const token = getToken()
  let user = null
  if (token) {
    try {
      user = jwt_decode(token)
    } catch (err) {
      console.error("Token inválido", err)
    }
  }

  const canEdit = user?.idRolName === "Administrador" || user?.idRolName === "Vigilante"
  const isBasicRole = ["Aprendiz", "Instructor", "Visitante"].includes(user?.idRolName)

    async function entrada() {
    try {
        let v;

        if (canEdit) {
        // ADMIN y VIGILANTE -> pueden usar todos los vehículos
        v = await api.request('/vehicles', { method: 'GET' })
        } else {
        // Roles básicos -> solo sus vehículos
        v = await api.request('/vehicles/user', { method: 'GET' })
        }

        const found = v.find(x => x.Placa === placa)

        if (!found) {
        return alert('Placa no encontrada en el sistema')
        }

        await api.request('/movimientos/entrada', {
        method: 'POST',
        body: { idVehiculo: found.IdVehiculo }
        })

        alert('Entrada registrada')
        loadRange()
    } catch (err) {
        alert(err.message)
    }
    }


  async function salida() {
    try {
      await api.request('/movimientos/salida', { method: 'POST', body: { placa } })
      alert('Salida registrada')
      loadRange()
    } catch (err) { alert(err.message) }
  }

  async function loadRange() {
    try {
      const data = await api.request('/movimientos/range?start=' + new Date().toISOString().slice(0, 10) + '&end=' + new Date().toISOString().slice(0, 10), { method: 'GET' })
      setMovimientos(data)
    } catch (err) { console.error(err) }
  }

  useEffect(() => { loadRange() }, [])

  return (
    <div className="container">
      <h1>Movimientos</h1>

      {/* SOLO ADMIN/VIGILANTE PUEDEN EDITAR */}
      {canEdit && (
        <div className="card">
          <label>Placa</label>
          <input value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())} />

          <div className="row">
            <button className="btn" onClick={entrada}>Registrar entrada</button>
            <button className="btn outline" onClick={salida}>Registrar salida</button>
          </div>
        </div>
      )}

      {/* SOLO APRENDIZ/INSTRUCTOR/VISITANTE → mensaje informativo */}
      {isBasicRole && (
        <div className="alert info">
          Solo puedes visualizar tus movimientos. Para registrar entrada/salida debe hacerlo un vigilante.
        </div>
      )}

      <h2>Movimientos (hoy)</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map(m => (
            <tr key={m.IdMovimiento}>
              <td>{m.Placa}</td>
              <td>{m.FechaEntrada}</td>
              <td>{m.FechaSalida ?? '-'}</td>
              <td>{m.Estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
