import useReveal from '../../../hooks/useReveal';
import { Link } from 'react-router-dom';
import { useCatalog } from '../../../context/CatalogContext';
import useTitle from '../../../hooks/useTitle';
import SectionHead from '../../../components/SectionHead';
import './CategoriesList.css';

export default function CategoriesList() {
  useReveal();
  useTitle('Categorías');
  const { categories, getProducts } = useCatalog();
  return (
    <section className="section container reveal">
      <SectionHead eyebrow="Familias olfativas" title="Categorías" />
      <div className="cat-list">
        {categories.map((c) => (
          <Link key={c.slug} to={`/categoria/${c.slug}`} className="cat-row">
            <h3>{c.name}</h3>
            <p>{c.desc}</p>
            <span className="label">{getProducts(c.slug).length} perfumes</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
