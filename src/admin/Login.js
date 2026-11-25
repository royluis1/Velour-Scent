import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!login(password)) {
      setError('Contraseña incorrecta');
      return;
    }
    setError('');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: 'min(100%, 380px)', display: 'grid', gap: 24, textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--vs-serif)', fontSize: '2rem', letterSpacing: '.18em', textTransform: 'uppercase' }}>Velour Scent</h1>
        <label style={{ textAlign: 'left' }}>Contraseña
          <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p role="alert">{error}</p>}
        <button className="btn btn--solid" type="submit">Entrar</button>
      </form>
    </main>
  );
}
