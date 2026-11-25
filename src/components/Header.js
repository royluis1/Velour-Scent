import { Link, NavLink } from 'react-router-dom';

export default function Header({ count }) {
  return (
    <header className="header">
      <div className="container header__in">
        <nav className="nav">
          <NavLink to="/coleccion">Colección</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
        </nav>
        <Link to="/" className="logo">Velour Scent</Link>
        <div className="header__right"><Link to="/coleccion">Bolsa ({count})</Link></div>
      </div>
    </header>
  );
}
