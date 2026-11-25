import useReveal from '../../../hooks/useReveal';
import { Link, useParams } from 'react-router-dom';
import { useCatalog } from '../../../context/CatalogContext';
import useTitle from '../../../hooks/useTitle';
import ProductCard from '../../../components/ProductCard';
import SectionHead from '../../../components/SectionHead';
import './CategoryView.css';

export default function CategoryView() {
  useReveal();
  const { slug } = useParams();
  const { getCategory, getProducts, loading, error } = useCatalog();
  const cat = getCategory(slug);
  useTitle(cat ? cat.name : loading ? '' : error ? 'Error al cargar categoría' : 'Categoría no encontrada');
  if (loading || error) return null;
  if (!cat) {
    return (
      <section className="section container reveal" style={{ textAlign: 'center' }}>
        <h2>Esta categoría no existe</h2>
        <p style={{ margin: '24px 0 32px', color: 'var(--vs-mute)' }}>Elegí una de las familias disponibles.</p>
        <Link to="/categorias" className="btn">Ver categorías</Link>
      </section>
    );
  }
  return (
    <section className="section container reveal">
      <SectionHead eyebrow="Categoría" title={cat.name} />
      <p className="cat-intro">{cat.desc}</p>
      {getProducts(slug).length
        ? <div className="grid">{getProducts(slug).map((p) => <ProductCard key={p.id} product={p} />)}</div>
        : <p style={{ textAlign: 'center', color: 'var(--vs-mute)' }}>Todavía no hay perfumes en esta categoría.</p>}
    </section>
  );
}
