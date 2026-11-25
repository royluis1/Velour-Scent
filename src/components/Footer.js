import { Link } from 'react-router-dom';
import { getCategories } from '../utils/api';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__cols">
          <div>
            <p className="logo" style={{ marginBottom: 20 }}>Velour Scent</p>
            <p className="footer__brand">Perfumes que se sienten antes de verse.</p>
          </div>
          <div>
            <h4 className="label">Colección</h4>
            <ul>{getCategories().map((c) => <li key={c.slug}><Link to={`/categoria/${c.slug}`}>{c.name}</Link></li>)}</ul>
          </div>
          <div>
            <h4 className="label">Tienda</h4>
            <ul><li><Link to="/coleccion">Todos los perfumes</Link></li><li><Link to="/categorias">Categorías</Link></li></ul>
          </div>
          <div>
            <h4 className="label">Contacto</h4>
            <ul><li>hola@velourscent.com</li><li>Villa Mercedes, San Luis</li></ul>
          </div>
        </div>
        <p className="footer__legal">© {new Date().getFullYear()} Velour Scent. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
