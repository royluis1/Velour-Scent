import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'vs_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = (p, size, qty = 1) => setItems((prev) => {
    const i = prev.findIndex((x) => x.id === p.id && x.size === size);
    if (i > -1) { const c = [...prev]; c[i] = { ...c[i], qty: c[i].qty + qty }; return c; }
    return [...prev, { id: p.id, name: p.name, price: p.price, image: p.image || null, size, qty }];
  });
  const remove = (id, size) => setItems((prev) => prev.filter((x) => !(x.id === id && x.size === size)));
  const setQty = (id, size, qty) => setItems((prev) => prev.map((x) => (x.id === id && x.size === size ? { ...x, qty: Math.max(1, qty) } : x)));
  const clear = () => setItems([]);
  const count = items.reduce((n, x) => n + x.qty, 0);
  const total = items.reduce((n, x) => n + x.price * x.qty, 0);

  return <CartContext.Provider value={{ items, add, remove, setQty, clear, count, total }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
