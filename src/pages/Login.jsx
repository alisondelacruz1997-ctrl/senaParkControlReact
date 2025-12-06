import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { saveToken } from '../services/auth'


export default function Login() {
const navigate = useNavigate()
const [correo, setCorreo] = useState('')
const [contrasena, setContrasena] = useState('')
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)


const submit = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  try {
    const res = await api.request('/auth/login', { method: 'POST', body: { correo, contrasena } });
    console.log('[Login] response', res);
    if (!res || !res.token) {
      throw new Error('Respuesta inválida del servidor');
    }
    saveToken(res.token);
    // Forzamos recarga para que App vuelva a leer localStorage y actualice isAuth
    window.location.href = '/dashboard';
  } catch (err) {
    console.error('[Login] error', err);
    setError(err.message || 'Error en login');
  } finally {
    setLoading(false);
  }
};



return (
<div className="card center-card">
<h2>SENA ParkControl</h2>
<form onSubmit={submit} className="form">
<label>Email</label>
<input value={correo} onChange={e=>setCorreo(e.target.value)} placeholder="correo@ejemplo.com" required />
<label>Contraseña</label>
<input type="password" value={contrasena} onChange={e=>setContrasena(e.target.value)} required />
{error && <div className="error">{error}</div>}
<button className="btn" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
</form>
</div>
)
}