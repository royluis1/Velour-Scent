import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function StoreLayout() {
  return (
    <div className="store">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}
