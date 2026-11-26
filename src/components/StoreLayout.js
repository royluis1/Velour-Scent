import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCatalog } from '../context/CatalogContext';
import { useCart } from '../context/CartContext';
import CatalogFeedback from './CatalogFeedback';

export default function StoreLayout() {
  const { loading, error } = useCatalog();
  const { toastMessage } = useCart();
  return (
    <div className="store">
      <Header />
      <CatalogFeedback loading={loading} error={error} />
      <main><Outlet /></main>
      <Footer />
      <div className={`store-toast${toastMessage ? ' store-toast--visible' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}
