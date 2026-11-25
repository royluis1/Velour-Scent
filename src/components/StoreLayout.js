import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCatalog } from '../context/CatalogContext';

export default function StoreLayout() {
  const { error } = useCatalog();
  return (
    <div className="store">
      <Header />
      {error && <p role="alert" className="container" style={{ paddingTop: 16, color: 'var(--vs-mute)' }}>{error}</p>}
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
