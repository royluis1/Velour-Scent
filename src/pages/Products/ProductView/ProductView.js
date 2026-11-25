import useReveal from '../../../hooks/useReveal';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { sizes, formatPrice } from '../../../utils/api';
import { useCatalog } from '../../../context/CatalogContext';
import useTitle from '../../../hooks/useTitle';
import ProductCard from '../../../components/ProductCard';
import ProductImage from '../../../components/ProductImage';
import SectionHead from '../../../components/SectionHead';
import './ProductView.css';

export default function ProductView() {
  useReveal();
  const { id } = useParams();
  const { add } = useCart();
  const [size, setSize] = useState(50);
  const [added, setAdded] = useState(false);
  const { getProduct, getProducts, getCategory, loading, error } = useCatalog();
  const p = getProduct(id);
  useTitle(p ? p.name : loading ? '' : error ? 'Error al cargar perfume' : 'Perfume no encontrado');

  if (loading || error) return null;
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
  const facts = [
    { label: 'Concentración', value: p.concentration },
    { label: 'Género', value: p.gender },
    { label: 'Año', value: p.year },
    { label: 'Duración', value: p.longevity },
    { label: 'Estela', value: p.sillage },
  ].filter((fact) => fact.value !== null && fact.value !== undefined && String(fact.value).trim());
  return (
    <>
      <section className="section container detail reveal">
        <div className="detail__media">
          <ProductImage image={p.image} name={p.name} />
        </div>
        <div className="detail__info">
          <Link to={`/categoria/${p.category}`} className="eyebrow">{getCategory(p.category)?.name}</Link>
          <h1>{p.name}</h1>
          <p className="detail__price">{formatPrice(p.price)}</p>
          <p className="detail__desc">{p.desc}</p>
          <div className="notes">
            <div><span className="label">Salida</span>{p.notes.top}</div>
            <div><span className="label">Corazón</span>{p.notes.heart}</div>
            <div><span className="label">Fondo</span>{p.notes.base}</div>
          </div>
          {facts.length > 0 && (
            <section className="detail__facts" aria-labelledby="product-facts-title">
              <h2 id="product-facts-title">Ficha</h2>
              <dl>
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="label">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {p.ingredients && p.ingredients.trim() && (
            <section className="detail__ingredients" aria-labelledby="product-ingredients-title">
              <h2 id="product-ingredients-title">Ingredientes</h2>
              <p>{p.ingredients}</p>
            </section>
          )}
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
