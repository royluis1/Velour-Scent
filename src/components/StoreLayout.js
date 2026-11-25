import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function StoreLayout() {
  const [count, setCount] = useState(0);
  return (
    <div className="store">
      <Header count={count} />
      <main><Outlet context={{ addToCart: () => setCount((c) => c + 1) }} /></main>
      <Footer />
    </div>
  );
}
