import { Routes, Route } from 'react-router-dom';
import './App.css';
import StoreLayout from './components/StoreLayout';
import Home from './pages/Home/Home';
import ProductsList from './pages/Products/ProductsList/ProductsList';
import ProductView from './pages/Products/ProductView/ProductView';
import CategoriesList from './pages/Categories/CategoriesList/CategoriesList';
import CategoryView from './pages/Categories/CategoryView/CategoryView';
import Bolsa from './pages/Bolsa/Bolsa';
import AdminLayout from './admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound/NotFound';
import Maison from './pages/Maison/Maison';
import Contacto from './pages/Contacto/Contacto';
import AdminHome from './admin/pages/AdminHome';
import AdminProducts from './admin/pages/AdminProducts';
import AdminCategories from './admin/pages/AdminCategories';
import AdminProfile from './admin/pages/AdminProfile';
import RequireAuth from './admin/RequireAuth';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/coleccion" element={<ProductsList />} />
          <Route path="/perfume/:id" element={<ProductView />} />
          <Route path="/categorias" element={<CategoriesList />} />
          <Route path="/categoria/:slug" element={<CategoryView />} />
          <Route path="/bolsa" element={<Bolsa />} />
          <Route path="/maison" element={<Maison />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin" element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}