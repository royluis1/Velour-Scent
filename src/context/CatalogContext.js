import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { categories as seedCategories, products as seedProducts } from '../utils/api';

const CatalogContext = createContext(null);
const KEY = 'vs_catalog';

// Persistencia de demo: en producción debe reemplazarse por una API/base de datos real.
function readCatalog() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    if (stored && Array.isArray(stored.products) && Array.isArray(stored.categories)) return stored;
  } catch {
    return { products: seedProducts, categories: seedCategories };
  }
  return { products: seedProducts, categories: seedCategories };
}

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(readCatalog);
  const { products, categories } = catalog;

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(catalog));
  }, [catalog]);

  const value = useMemo(() => ({
    products,
    categories,
    getProduct: (id) => products.find((product) => product.id === Number(id)),
    getProducts: (slug) => (slug ? products.filter((product) => product.category === slug) : products),
    getCategory: (slug) => categories.find((category) => category.slug === slug),
    addProduct: (product) => {
      const created = { ...product, id: Date.now() };
      setCatalog((current) => ({ ...current, products: [...current.products, created] }));
      return created;
    },
    updateProduct: (id, patch) => setCatalog((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === id ? { ...product, ...patch } : product)),
    })),
    removeProduct: (id) => setCatalog((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    })),
    addCategory: (category) => setCatalog((current) => ({
      ...current,
      categories: [...current.categories, category],
    })),
    updateCategory: (slug, patch) => setCatalog((current) => ({
      ...current,
      categories: current.categories.map((category) => (category.slug === slug ? { ...category, ...patch } : category)),
      products: current.products.map((product) => (
        product.category === slug ? { ...product, category: patch.slug || slug } : product
      )),
    })),
    removeCategory: (slug) => {
      if (products.some((product) => product.category === slug)) return false;
      setCatalog((current) => ({
        ...current,
        categories: current.categories.filter((category) => category.slug !== slug),
      }));
      return true;
    },
  }), [products, categories]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return context;
}
