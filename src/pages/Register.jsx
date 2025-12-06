import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [roles, setRoles] = useState([])
  
  const [form, setForm] = useState({
    nombreCompleto: '',
    documento: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
    idRol: 3 // Por defecto Aprendiz (ID 3 según tu base de datos)
  })

  // Obtener roles disponibles (excepto Administrador y Vigilante)
  useEffect(() => {
    const loadRoles = async () => {
      try {
        // Según tu base de datos:
        // 1 Administrador
        // 2 Instructor
        // 3 Aprendiz
        // 4 Visitante
        // 5 Vigilante
        
        // Solo permitir registro de Aprendiz, Instructor, Visitante
        const rolesDisponibles = [
          { IdRol: 3, NombreRol: 'Aprendiz' },
          { IdRol: 2, NombreRol: 'Instructor' },
          { IdRol: 4, NombreRol: 'Visitante' }
        ]
        setRoles(rolesDisponibles)
      } catch (err) {
        console.error('Error cargando roles:', err)
      }
    }
    loadRoles()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!form.nombreCompleto.trim()) {
      setError('El nombre completo es requerido')
      return false
    }
    if (!form.documento.trim()) {
      setError('El documento es requerido')
      return false
    }
    if (!form.correo.trim()) {
      setError('El correo es requerido')
      return false
    }
    if (!form.telefono.trim()) {
      setError('El teléfono es requerido')
      return false
    }
    if (!form.contrasena) {
      setError('La contraseña es requerida')
      return false
    }
    if (form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden')
      return false
    }
    if (!form.idRol) {
      setError('Debe seleccionar un rol')
      return false
    }
    return true
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const registroData = {
        idRol: parseInt(form.idRol),
        nombreCompleto: form.nombreCompleto,
        documento: form.documento,
        correo: form.correo,
        telefono: form.telefono,
        contrasena: form.contrasena
      }

      console.log('Enviando registro:', registroData)
      const res = await api.request('/auth/register', {
        method: 'POST',
        body: registroData
      })
      
      console.log('[Register] response', res)
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
      navigate('/login')
      
    } catch (err) {
      console.error('[Register] error', err)
      setError(err.message || 'Error en el registro. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card center-card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>Registro - SENA ParkControl</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Crea una cuenta para acceder al sistema de parqueaderos
      </p>
      
      <form onSubmit={submit} className="form">
        <label>Nombre completo *</label>
        <input
          name="nombreCompleto"
          value={form.nombreCompleto}
          onChange={handleChange}
          placeholder="Juan Pérez"
          required
        />
        
        <label>Documento de identidad *</label>
        <input
          name="documento"
          value={form.documento}
          onChange={handleChange}
          placeholder="1234567890"
          required
        />
        
        <label>Correo electrónico *</label>
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="correo@ejemplo.com"
          required
        />
        
        <label>Teléfono *</label>
        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="3001234567"
          required
        />
        
        <label>Tipo de usuario *</label>
        <select
          name="idRol"
          value={form.idRol}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona un rol</option>
          {roles.map(rol => (
            <option key={rol.IdRol} value={rol.IdRol}>
              {rol.NombreRol}
            </option>
          ))}
        </select>
        
        <label>Contraseña *</label>
        <input
          type="password"
          name="contrasena"
          value={form.contrasena}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          required
        />
        
        <label>Confirmar contraseña *</label>
        <input
          type="password"
          name="confirmarContrasena"
          value={form.confirmarContrasena}
          onChange={handleChange}
          placeholder="Repite la contraseña"
          required
        />
        
        {error && (
          <div className="error" style={{ margin: '1rem 0' }}>
            {error}
          </div>
        )}
        
        <button 
          className="btn" 
          type="submit" 
          disabled={loading}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#666' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" style={{ color: '#3498db', textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}