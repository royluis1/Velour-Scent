import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/api';
import useTitle from '../../hooks/useTitle';
import './Bolsa.css';

export default function Bolsa() {
  useTitle('Tu bolsa');
  const { items, remove, setQty, total, count } = useCart();
  const buildMessage = () =>
    'Hola, quiero hacer este pedido:\n' +
    items.map((x) => `• ${x.name} ${x.size} ml × ${x.qty} — ${formatPrice(x.price * x.qty)}`).join('\n') +
    `\n\nTotal: ${formatPrice(total)}`;
  const checkout = () => {
    const url = `https://wa.me/${process.env.REACT_APP_WHATSAPP}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, '_blank', 'noopener');
  };
  if (!count) return (
    <section className="section container" style={{ textAlign: 'center' }}>
      <h2>Tu bolsa está vacía</h2>
      <p style={{ margin: '24px 0 32px', color: 'var(--vs-mute)' }}>Todavía no elegiste ninguna esencia.</p>
      <Link to="/coleccion" className="btn">Ver colección</Link>
    </section>
  );
  return (
    <section className="section container">
      <h2 style={{ marginBottom: 48 }}>Tu bolsa</h2>
      <div className="bag">
        {items.map((x) => (
          <div className="bag__row" key={`${x.id}-${x.size}`}>
            <div className="bag__media">{x.image ? <img src={x.image} alt={x.name} /> : <span className="mono" style={{ fontSize: '3rem' }}>{x.name[0]}</span>}</div>
            <div className="bag__info"><h3>{x.name}</h3><p className="label">{x.size} ml</p></div>
            <div className="bag__qty">
              <button onClick={() => setQty(x.id, x.size, x.qty - 1)} aria-label="Menos">−</button>
              <span>{x.qty}</span>
              <button onClick={() => setQty(x.id, x.size, x.qty + 1)} aria-label="Más">+</button>
            </div>
            <div className="bag__price">{formatPrice(x.price * x.qty)}</div>
            <button className="bag__remove" onClick={() => remove(x.id, x.size)} aria-label="Quitar">×</button>
          </div>
        ))}
      </div>
      <div className="bag__foot"><span className="label">Total</span><span className="bag__total">{formatPrice(total)}</span></div>
      <button className="btn btn--solid btn--block" style={{ marginTop: 32 }} onClick={checkout}>Finalizar compra</button>
    </section>
  );
}
