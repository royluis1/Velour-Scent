import useReveal from '../../hooks/useReveal';
import useTitle from '../../hooks/useTitle';

export default function Maison() {
  useReveal();
  useTitle('La casa');
  return (
    <section className="section container reveal" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: 48 }}>La casa</h1>
      <div style={{ maxWidth: '60ch', margin: '0 auto', display: 'grid', gap: 28, color: 'var(--vs-mute)', lineHeight: 1.8 }}>
        <p>Velour Scent es una casa de perfumería de autor, creada para quienes eligen dejar una presencia sutil.</p>
        <p>Sus composiciones recorren maderas oscuras, flores blancas y ámbar con una intimidad que permanece.</p>
        <p>Cada esencia invita a habitar la noche a través de una memoria propia.</p>
      </div>
    </section>
  );
}
