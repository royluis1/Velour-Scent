import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../../utils/api';
import ProductCard from '../../components/ProductCard';
import SectionHead from '../../components/SectionHead';
import './Home.css';

export default function Home() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <span className="eyebrow">Nueva colección</span>
          <h1>El perfume es la forma más íntima de presencia.</h1>
          <p>Seis esencias hechas para la noche: maderas oscuras, flores blancas y ámbar sobre terciopelo.</p>
          <div className="hero__cta">
            <Link to="/coleccion" className="btn btn--solid">Descubrir colección</Link>
            <Link to="/categorias" className="btn">Ver categorías</Link>
          </div>
        </div>
      </section>

      <section className="section container">
        <SectionHead eyebrow="Selección" title="Esencias destacadas" />
        <div className="grid">{getProducts().slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="section container manifesto">
        <p>No perfumamos la piel. Perfumamos el momento en que alguien se da vuelta.</p>
      </section>

      <section className="container home-cats">
        {getCategories().map((c) => (
          <Link key={c.slug} to={`/categoria/${c.slug}`} className="home-cat">
            <h3>{c.name}</h3>
            <span className="label">Explorar</span>
          </Link>
        ))}
      </section>

      <section className="section newsletter">
        <div className="container">
          <SectionHead eyebrow="Cartas privadas" title="Recibí las novedades primero" />
          {sent ? (
            <p className="label">Gracias. Te escribimos pronto.</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}>
              <input className="input" type="email" required placeholder="Tu correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" type="submit">Suscribirme</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
