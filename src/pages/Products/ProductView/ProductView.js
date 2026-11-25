import useReveal from '../../../hooks/useReveal';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { getProduct, getProducts, getCategory, sizes, formatPrice } from '../../../utils/api';
import ProductCard from '../../../components/ProductCard';
import SectionHead from '../../../components/SectionHead';
import './ProductView.css';

export default function ProductView() {
  useReveal();
  const { id } = useParams();
  const { add } = useCart();
  const [size, setSize] = useState(50);
  const [added, setAdded] = useState(false);
  const p = getProduct(id);

  if (!p) {
    return (
      <section className="section container reveal" style={{ textAlign: 'center' }}>
        <h2>Este perfume no existe</h2>
        <p style={{ margin: '24px 0 32px', color: 'var(--vs-mute)' }}>Volvé a la colección para ver los disponibles.</p>
        <Link to="/coleccion" className="btn">Ver colección</Link>
      </section>
    );
  }

  const related = getProducts(p.category).filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <>
      <section className="section container detail reveal">
        <div className="detail__media">
          {p.image ? <img src={p.image} alt={p.name} /> : <span className="mono">{p.name[0]}</span>}
        </div>
        <div className="detail__info">
          <Link to={`/categoria/${p.category}`} className="eyebrow">{getCategory(p.category).name}</Link>
          <h1>{p.name}</h1>
          <p className="detail__price">{formatPrice(p.price)}</p>
          <p className="detail__desc">{p.desc}</p>
          <div className="notes">
            <div><span className="label">Salida</span>{p.notes.top}</div>
            <div><span className="label">Corazón</span>{p.notes.heart}</div>
            <div><span className="label">Fondo</span>{p.notes.base}</div>
          </div>
          <div className="sizes">
            {sizes.map((s) => <button key={s} className={`size ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s} ml</button>)}
          </div>
          <button className="btn btn--solid btn--block" onClick={() => { add(p, size); setAdded(true); }}>
            {added ? 'Añadido a la bolsa' : 'Añadir a la bolsa'}
          </button>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section container reveal">
          <SectionHead title="También te puede gustar" />
          <div className="grid">{related.map((x) => <ProductCard key={x.id} product={x} />)}</div>
        </section>
      )}
    </>
  );
}
