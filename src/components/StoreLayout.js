import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCatalog } from '../context/CatalogContext';
import CatalogFeedback from './CatalogFeedback';

export default function StoreLayout() {
  const { loading, error } = useCatalog();
  return (
    <div className="store">
      <Header />
      <CatalogFeedback loading={loading} error={error} />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
