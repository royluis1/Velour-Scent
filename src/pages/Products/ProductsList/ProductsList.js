import { useState } from 'react';
import { getProducts, getCategories } from '../../../utils/api';
import ProductCard from '../../../components/ProductCard';
import SectionHead from '../../../components/SectionHead';
import './ProductsList.css';

export default function ProductsList() {
  const [active, setActive] = useState('');
  const items = getProducts(active);
  return (
    <section className="section container">
      <SectionHead eyebrow="Colección" title="Todos los perfumes" />
      <div className="filters">
        <button className={!active ? 'active' : ''} onClick={() => setActive('')}>Todos</button>
        {getCategories().map((c) => (
          <button key={c.slug} className={active === c.slug ? 'active' : ''} onClick={() => setActive(c.slug)}>{c.name}</button>
        ))}
      </div>
      <div className="grid">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </section>
  );
}
