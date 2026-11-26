import useReveal from '../../../hooks/useReveal';
import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { useCatalog } from '../../../context/CatalogContext';
import useTitle from '../../../hooks/useTitle';
import ProductCard from '../../../components/ProductCard';
import ProductImage from '../../../components/ProductImage';
import SectionHead from '../../../components/SectionHead';
import SplitText from '../../../components/SplitText';
import PriceOdometer from '../../../components/PriceOdometer';
import './ProductView.css';

function defaultVariant(variants) {
  return variants.find((variant) => variant.featured && variant.stock > 0) ||
    [...variants].filter((variant) => variant.stock > 0).sort((a, b) => a.ml - b.ml)[0] ||
    variants.find((variant) => variant.featured) ||
    [...variants].sort((a, b) => a.ml - b.ml)[0];
}

export default function ProductView() {
  useReveal();
  const { id } = useParams();
  const { add } = useCart();
  const [selection, setSelection] = useState({ productId: null, ml: null });
  const mediaRef = useRef(null);
  const { getProduct, getProducts, getCategory, loading, error } = useCatalog();
  const p = getProduct(id);
  const variants = p
    ? (p.variants?.length ? p.variants : [{ ml: 100, price: p.price, stock: 10 }])
    : [];
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

  const selectedMl = selection.productId === p.id ? selection.ml : null;
  const selectedVariant = variants.find((variant) => Number(variant.ml) === Number(selectedMl)) || defaultVariant(variants);
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
        <div className="detail__media" ref={mediaRef}>
          <ProductImage image={p.image} name={p.name} />
        </div>
        <div className="detail__info">
          <Link to={`/categoria/${p.category}`} className="eyebrow">{getCategory(p.category)?.name}</Link>
          <h1><SplitText key={p.id} text={p.name} /></h1>
          <p className="detail__price"><PriceOdometer key={p.id} value={selectedVariant.price} /></p>
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
          <div className="sizes" role="group" aria-label="Elegí el tamaño">
            {variants.map((variant) => (
              <button
                key={variant.ml}
                type="button"
                className={`size${Number(selectedVariant.ml) === Number(variant.ml) ? ' active' : ''}${variant.stock < 1 ? ' size--out' : ''}`}
                aria-pressed={Number(selectedVariant.ml) === Number(variant.ml)}
                disabled={variant.stock < 1}
                onClick={() => setSelection({ productId: p.id, ml: Number(variant.ml) })}
              >
                {variant.ml} ml
                {variant.stock < 1 && <span className="size__stock">Sin stock</span>}
              </button>
            ))}
          </div>
          <button
            className="btn btn--solid btn--block detail__add"
            type="button"
            disabled={selectedVariant.stock < 1}
            onClick={() => add(p, selectedVariant, mediaRef.current)}
          >
            {selectedVariant.stock < 1
              ? 'Sin stock'
              : <>AGREGAR · <PriceOdometer value={selectedVariant.price} /></>}
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
