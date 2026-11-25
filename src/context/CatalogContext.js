import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createCategory, createProduct, deleteCategory, deleteProduct,
  getCategories, getProducts, saveCategory, saveProduct,
} from '../utils/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getProducts(), getCategories()])
      .then(([loadedProducts, loadedCategories]) => {
        if (!active) return;
        setProducts(loadedProducts);
        setCategories(loadedCategories);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    products,
    categories,
    loading,
    error,
    getProduct: (id) => products.find((product) => product.id === Number(id)),
    getProducts: (slug) => (slug ? products.filter((product) => product.category === slug) : products),
    getCategory: (slug) => categories.find((category) => category.slug === slug),
    addProduct: async (product) => {
      try {
        const created = await createProduct(product);
        setProducts((current) => [...current, created]);
        setError('');
        return created;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    updateProduct: async (id, patch) => {
      try {
        const updated = await saveProduct(id, patch);
        setProducts((current) => current.map((product) => (product.id === id ? updated : product)));
        setError('');
        return updated;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    removeProduct: async (id) => {
      try {
        await deleteProduct(id);
        setProducts((current) => current.filter((product) => product.id !== id));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    addCategory: async (category) => {
      try {
        const created = await createCategory(category);
        setCategories((current) => [...current, created]);
        setError('');
        return created;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    updateCategory: async (slug, patch) => {
      try {
        const updated = await saveCategory(slug, patch);
        setCategories((current) => current.map((category) => (category.slug === slug ? updated : category)));
        setProducts((current) => current.map((product) => (
          product.category === slug ? { ...product, category: updated.slug } : product
        )));
        setError('');
        return updated;
      } catch (requestError) {
        setError(requestError.message);
        throw requestError;
      }
    },
    removeCategory: async (slug) => {
      try {
        await deleteCategory(slug);
        setCategories((current) => current.filter((category) => category.slug !== slug));
        setError('');
        return true;
      } catch (requestError) {
        if (requestError.status === 409) return false;
        setError(requestError.message);
        throw requestError;
      }
    },
  }), [products, categories, loading, error]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog debe usarse dentro de CatalogProvider');
  return context;
}
