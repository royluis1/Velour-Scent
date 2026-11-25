import { NavLink, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';
import './admin.css';

const links = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/categories', label: 'Categorías' },
  { to: '/admin/profile', label: 'Perfil' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const { error } = useCatalog();
  return (
    <div className="admin">
      <aside className="admin__side">
        <Link to="/admin" className="admin__logo">Velour Scent</Link>
        <nav className="admin__nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>
        <Link to="/" className="admin__back">Ver tienda</Link>
        <button className="admin__logout" type="button" onClick={logout}>Cerrar sesión</button>
      </aside>
      <div className="admin__main">
        <header className="admin__top"><span className="eyebrow">Panel de administración</span></header>
        <div className="admin__content">
          {error && <p role="alert" style={{ marginBottom: 24 }}>{error}</p>}
          <Outlet />
        </div>
      </div>
    </div>
  );
}