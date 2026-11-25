import { Link, useParams } from 'react-router-dom';
import { getCategory, getProducts } from '../../../utils/api';
import ProductCard from '../../../components/ProductCard';
import SectionHead from '../../../components/SectionHead';
import './CategoryView.css';

export default function CategoryView() {
  const { slug } = useParams();
  const cat = getCategory(slug);
  if (!cat) {
    return (
      <section className="section container" style={{ textAlign: 'center' }}>
        <h2>Esta categoría no existe</h2>
        <p style={{ margin: '24px 0 32px', color: 'var(--vs-mute)' }}>Elegí una de las familias disponibles.</p>
        <Link to="/categorias" className="btn">Ver categorías</Link>
      </section>
    );
  }
  return (
    <section className="section container">
      <SectionHead eyebrow="Categoría" title={cat.name} />
      <p className="cat-intro">{cat.desc}</p>
      <div className="grid">{getProducts(slug).map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
