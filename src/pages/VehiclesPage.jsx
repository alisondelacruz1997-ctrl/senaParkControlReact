import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function VehiclesPage({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({ placa: '', tipo: 'carro', modelo: '', color: '' });
  const [error, setError] = useState(null);

  const isAdminOrVigilante = ["Administrador", "Vigilante"].includes(user?.idRolName);

  async function load() {
    try {
      let data;

      if (isAdminOrVigilante) {
        // admin y vigilante -> todos los vehículos
        data = await api.request('/vehicles', { method: 'GET' });
      } else {
        // resto -> solo los suyos
        data = await api.request('/vehicles/user', { method: 'GET' });
      }

      setVehicles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function submit(e) {
    e.preventDefault();
    try {
      await api.request('/vehicles', { method: 'POST', body: { ...form } });
      setForm({ placa: '', tipo: 'carro', modelo: '', color: '' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm('Eliminar vehículo?')) return;
    try {
      await api.request('/vehicles/' + id, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>Vehículos</h1>
      {error && <div className="error">{error}</div>}

      {/* Form solo para roles que pueden registrar vehículos */}
      {["Aprendiz", "Instructor", "Visitante", "Administrador", "Vigilante"].includes(user?.idRolName) && (
        <form className="form-inline" onSubmit={submit}>
          <input
            placeholder="Placa"
            value={form.placa}
            onChange={e => setForm({ ...form, placa: e.target.value.toUpperCase() })}
            required
          />

          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
            <option value="bicicleta">Bicicleta</option>
          </select>

          <input
            placeholder="Modelo"
            value={form.modelo}
            onChange={e => setForm({ ...form, modelo: e.target.value })}
          />

          <input
            placeholder="Color"
            value={form.color}
            onChange={e => setForm({ ...form, color: e.target.value })}
          />

          <button className="btn">Agregar</button>
        </form>
      )}

<table className="table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Placa</th>
      <th>Tipo</th>
      <th>Modelo</th>
      <th>Color</th>

      {isAdminOrVigilante && (
        <>
          <th>Propietario</th>
          <th>Correo</th>
          <th>Rol</th>
        </>
      )}

      {isAdminOrVigilante && <th>Acciones</th>}
    </tr>
  </thead>

  <tbody>
    {vehicles.map(v => (
      <tr key={v.IdVehiculo}>
        <td>{v.IdVehiculo}</td>
        <td>{v.Placa}</td>
        <td>{v.Tipo}</td>
        <td>{v.Modelo}</td>
        <td>{v.Color}</td>

        {isAdminOrVigilante && (
          <>
            <td>{v.NombreCompleto}</td>
            <td>{v.Correo}</td>
            <td>{v.NombreRol}</td>
          </>
        )}

        {isAdminOrVigilante && (
          <td>
            <button className="btn small" onClick={() => remove(v.IdVehiculo)}>
              Eliminar
            </button>
          </td>
        )}
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
