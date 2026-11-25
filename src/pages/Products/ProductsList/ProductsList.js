import useReveal from '../../../hooks/useReveal';
import { useState } from 'react';
import { useCatalog } from '../../../context/CatalogContext';
import useTitle from '../../../hooks/useTitle';
import ProductCard from '../../../components/ProductCard';
import SectionHead from '../../../components/SectionHead';
import './ProductsList.css';

export default function ProductsList() {
  useReveal();
  useTitle('Colección');
  const { getProducts, categories } = useCatalog();
  const [active, setActive] = useState('');
  const items = getProducts(active);
  return (
    <section className="section container reveal">
      <SectionHead eyebrow="Colección" title="Todos los perfumes" />
      <div className="filters">
        <button className={!active ? 'active' : ''} onClick={() => setActive('')}>Todos</button>
        {categories.map((c) => (
          <button key={c.slug} className={active === c.slug ? 'active' : ''} onClick={() => setActive(c.slug)}>{c.name}</button>
        ))}
      </div>
      <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
