import useReveal from '../../../hooks/useReveal';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../../../utils/api';
import SectionHead from '../../../components/SectionHead';
import './CategoriesList.css';

export default function CategoriesList() {
  useReveal();
  return (
    <section className="section container reveal">
      <SectionHead eyebrow="Familias olfativas" title="Categorías" />
      <div className="cat-list">
        {getCategories().map((c) => (
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
