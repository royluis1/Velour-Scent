import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter><CartProvider><CatalogProvider><AuthProvider><App /></AuthProvider></CatalogProvider></CartProvider></BrowserRouter>
);
