import { Routes, Route } from 'react-router-dom';
import './App.css';
import StoreLayout from './components/StoreLayout';
import Home from './pages/Home/Home';
import ProductsList from './pages/Products/ProductsList/ProductsList';
import ProductView from './pages/Products/ProductView/ProductView';
import CategoriesList from './pages/Categories/CategoriesList/CategoriesList';
import CategoryView from './pages/Categories/CategoryView/CategoryView';
import Bolsa from './pages/Bolsa/Bolsa';

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/coleccion" element={<ProductsList />} />
        <Route path="/perfume/:id" element={<ProductView />} />
        <Route path="/categorias" element={<CategoriesList />} />
        <Route path="/categoria/:slug" element={<CategoryView />} />
        <Route path="/bolsa" element={<Bolsa />} />
      </Route>
      {/* El dashboard admin va aparte bajo /admin/* */}
    </Routes>
  );
}
