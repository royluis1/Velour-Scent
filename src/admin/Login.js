import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './admin.css';

export default function Login() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const ok = await login(password);
      setError(ok ? '' : 'Contraseña incorrecta');
    } catch {
      setError('No se pudo iniciar sesión. Probá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login">
      <form onSubmit={submit} className="login__card">
        <span className="eyebrow login__eyebrow">Acceso privado</span>
        <h1 className="login__brand">Velour Scent</h1>
        <p className="login__hint">Panel de administración</p>

        <label className="login__field">
          <span className="label">Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            className="input login__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </label>

        {error && <p className="login__error" role="alert">{error}</p>}

        <button className="btn btn--solid btn--block" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <Link to="/" className="login__back">← Volver a la tienda</Link>
      </form>
    </main>
  );
}