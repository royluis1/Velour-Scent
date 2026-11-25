import { Link } from 'react-router-dom';
import useTitle from '../../hooks/useTitle';

export default function NotFound() {
  useTitle('Página no encontrada');
  return (
    <section className="section container" style={{ textAlign: 'center' }}>
      <h2>Esta página no existe</h2>
      <p style={{ margin: '24px 0 32px', color: 'var(--vs-mute)' }}>Es posible que el enlace haya cambiado.</p>
      <Link to="/" className="btn">Volver al inicio</Link>
    </section>
  );
}
