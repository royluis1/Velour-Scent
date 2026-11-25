import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header__in">
        <button className="burger" aria-label="Abrir menú" onClick={() => setOpen(true)}>☰</button>
        <nav className="nav">
          <NavLink to="/coleccion">Colección</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
        </nav>
        <Link to="/" className="logo">Velour Scent</Link>
        <div className="header__right"><Link to="/bolsa">Bolsa ({count})</Link></div>
      </div>
      {open && (
        <div className="drawer" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="drawer__backdrop" />
          <nav className="drawer__panel">
            <button className="drawer__close" aria-label="Cerrar">×</button>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/coleccion">Colección</NavLink>
            <NavLink to="/categorias">Categorías</NavLink>
            <NavLink to="/bolsa">Bolsa ({count})</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
