import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(form.username, form.password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('nombre', res.data.nombre);
      localStorage.setItem('rol', res.data.rol);
      navigate('/dashboard');
    } catch {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logos-row">
            <img src="/logo_cecyte.png" alt="CECyTE" className="login-img-logo" />
          </div>
          <h1>Sistema de Reportes Generales</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="login-field">
            <label>Usuario:</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="Ingresa tu usuario"
              required
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>Contraseña:</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : '🚀 Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
