import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'vs_cart';

function validCartItem(item) {
  return item && Number.isInteger(Number(item.id)) && Number(item.id) > 0 &&
    typeof item.name === 'string' && item.name.trim() &&
    Number.isInteger(Number(item.ml)) && Number(item.ml) > 0 &&
    Number.isFinite(Number(item.price)) && Number(item.price) > 0 &&
    Number.isInteger(Number(item.qty)) && Number(item.qty) > 0 &&
    (item.image == null || typeof item.image === 'string') &&
    (item.stock == null || (Number.isInteger(Number(item.stock)) && Number(item.stock) >= 0));
}

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.map((item) => ({
      ...item,
      ml: Number(item.ml || item.size),
      id: Number(item.id),
      price: Number(item.price),
      qty: Number(item.qty),
      stock: item.stock == null ? null : Number(item.stock),
    })).filter(validCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);
  const [toastMessage, setToastMessage] = useState('');
  const animations = useRef(new Set());
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (error) {
      console.error('No se pudo guardar la bolsa en este dispositivo.', error);
    }
  }, [items]);

  useEffect(() => () => {
    animations.current.forEach((animation) => animation.cancel());
    clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(''), 2500);
  }, []);

  const bumpCart = useCallback(() => {
    const target = document.querySelector('[data-cart-target]');
    if (!target) return;
    target.classList.remove('cart-bump');
    void target.offsetWidth;
    target.classList.add('cart-bump');
  }, []);

  const flyToCart = useCallback((product, sourceElement) => {
    const target = document.querySelector('[data-cart-target]');
    const sourceImage = sourceElement?.querySelector('img');
    if (!target || !product.image || !sourceImage) {
      bumpCart();
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof sourceImage.animate !== 'function') {
      bumpCart();
      return;
    }

    const source = sourceImage.getBoundingClientRect();
    const destination = target.getBoundingClientRect();
    const size = Math.min(96, source.width, source.height);
    const startX = source.left + (source.width - size) / 2;
    const startY = source.top + (source.height - size) / 2;
    const dx = destination.left + destination.width / 2 - (startX + size / 2);
    const dy = destination.top + destination.height / 2 - (startY + size / 2);
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = '';
    image.className = 'cart-flight';
    Object.assign(image.style, {
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${size}px`,
      height: `${size}px`,
    });
    document.body.append(image);

    const motionStyles = window.getComputedStyle(document.documentElement);
    const duration = Number.parseFloat(motionStyles.getPropertyValue('--vs-cart-flight-duration'));
    const arc = Number.parseFloat(motionStyles.getPropertyValue('--vs-cart-flight-arc'));
    const easing = motionStyles.getPropertyValue('--vs-cart-flight-ease').trim();
    const frames = Array.from({ length: 25 }, (_, index) => {
      const progress = index / 24;
      return {
        transform: `translate(${dx * progress}px, ${dy * progress - Math.sin(progress * Math.PI) * arc}px) rotate(${progress * 220}deg) scale(${1 - progress * 0.84})`,
        opacity: 1 - progress * progress * 0.4,
      };
    });
    const animation = image.animate(frames, {
      duration,
      easing,
      fill: 'forwards',
    });
    animations.current.add(animation);
    animation.onfinish = () => {
      image.remove();
      animations.current.delete(animation);
      bumpCart();
    };
    animation.oncancel = () => {
      image.remove();
      animations.current.delete(animation);
    };
  }, [bumpCart]);

  const add = useCallback((product, variant, sourceElement, qty = 1) => {
    if (!variant || variant.stock < 1 || qty > variant.stock) return false;
    const existing = items.find((item) => item.id === product.id && item.ml === variant.ml);
    if (existing && existing.qty + qty > variant.stock) return false;
    setItems((previous) => {
      const index = previous.findIndex((item) => item.id === product.id && item.ml === variant.ml);
      if (index >= 0) {
        const updated = [...previous];
        updated[index] = { ...updated[index], qty: updated[index].qty + qty };
        return updated;
      }
      return [...previous, {
        id: product.id,
        name: product.name,
        price: Number(variant.price),
        image: product.image || null,
        ml: Number(variant.ml),
        stock: Number(variant.stock),
        qty,
      }];
    });
    flyToCart(product, sourceElement);
    showToast(`${product.name} · ${variant.ml} ml agregado a tu bolsa`);
    return true;
  }, [flyToCart, items, showToast]);

  const remove = (id, ml) => setItems((prev) => prev.filter((item) => !(item.id === id && item.ml === ml)));
  const setQty = (id, ml, qty) => setItems((prev) => prev.map((item) => (
    item.id === id && item.ml === ml
      ? { ...item, qty: Math.max(1, Math.min(Number(qty), Number(item.stock) || Number.MAX_SAFE_INTEGER)) }
      : item
  )));
  const clear = () => setItems([]);
  const count = items.reduce((n, x) => n + x.qty, 0);
  const total = items.reduce((n, x) => n + x.price * x.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count, total, toastMessage }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
