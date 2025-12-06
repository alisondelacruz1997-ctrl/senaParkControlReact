import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Opcional: puedes crear estilos específicos

export default function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

const handleRegister = () => {
  navigate('/register'); // Cambia esto
};

  return (
    <div className="home-container">
      {/* Header/Hero Section */}
      <header className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">SENA ParkControl</h1>
          <p className="hero-subtitle">
            Sistema inteligente de gestión de parqueaderos del SENA
          </p>
          <p className="hero-description">
            Controla el acceso de vehículos, gestiona usuarios y genera reportes 
            de forma eficiente y segura para tu centro de formación.
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-large" 
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            <button 
              className="btn btn-secondary btn-large" 
              onClick={handleRegister}
            >
              Registrarse
            </button>
          </div>
        </div>
        
        <div className="hero-image">
          {/* Puedes agregar una imagen o ícono aquí */}
          <div className="placeholder-image">
            🚗 🏢 🔐
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Características principales</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Gestión de Usuarios</h3>
            <p>Administra diferentes tipos de usuarios: Aprendices, Instructores, Administradores y Vigilantes.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Control de Vehículos</h3>
            <p>Registro y seguimiento de vehículos autorizados para ingresar al parqueadero.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Reportes Detallados</h3>
            <p>Genera reportes por fechas, tipos de vehículos y accesos para análisis estadístico.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Seguridad</h3>
            <p>Autenticación segura por roles y registro de todos los movimientos en el sistema.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works">
        <h2>¿Cómo funciona?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Registro</h3>
            <p>Los usuarios registran sus vehículos en el sistema</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Acceso</h3>
            <p>Los vigilantes controlan entrada/salida mediante la placa</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Monitoreo</h3>
            <p>Los administradores supervisan la actividad en tiempo real</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Reportes</h3>
            <p>Generación de informes para optimización del espacio</p>
          </div>
        </div>
      </section>

      {/* Footer/CTA Section */}
      <footer className="home-footer">
        <h2>¿Listo para comenzar?</h2>
        <p>Únete a nuestra comunidad y optimiza la gestión de tu parqueadero</p>
        <div className="footer-buttons">
          <button className="btn btn-primary btn-large" onClick={handleLogin}>
            Ingresar al Sistema
          </button>
        </div>
        
        <div className="footer-info">
          <p>© {new Date().getFullYear()} SENA ParkControl - Todos los derechos reservados</p>
          <p className="footer-note">
            Sistema desarrollado para centros de formación del SENA
          </p>
        </div>
      </footer>
    </div>
  );
}