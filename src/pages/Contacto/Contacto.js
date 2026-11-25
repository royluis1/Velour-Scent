import useReveal from '../../hooks/useReveal';
import useTitle from '../../hooks/useTitle';

export default function Contacto() {
  useReveal();
  useTitle('Contacto');
  const whatsappUrl = `https://wa.me/${process.env.REACT_APP_WHATSAPP}`;
  return (
    <section className="section container reveal" style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: 48 }}>Contacto</h1>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 20, color: 'var(--vs-mute)' }}>
        <a href="mailto:hola@velourscent.com">hola@velourscent.com</a>
        <p>Villa Mercedes, San Luis</p>
        <a className="btn" href={whatsappUrl} target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
      </div>
    </section>
  );
}
