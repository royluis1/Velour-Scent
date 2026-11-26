import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/api';
import useTitle from '../../hooks/useTitle';
import ProductImage from '../../components/ProductImage';
import PriceOdometer from '../../components/PriceOdometer';
import './Bolsa.css';

export default function Bolsa() {
  useTitle('Tu bolsa');
  const { items, remove, setQty, total, count } = useCart();
  const buildMessage = () =>
    'Hola, quiero hacer este pedido:\n' +
    items.map((x) => `• ${x.name} ${x.ml} ml × ${x.qty} — ${formatPrice(x.price * x.qty)}`).join('\n') +
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
          <div className="bag__row" key={`${x.id}|${x.ml}`}>
            <div className="bag__media"><ProductImage image={x.image} name={x.name} fallbackStyle={{ fontSize: '3rem' }} /></div>
            <div className="bag__info"><h3>{x.name}</h3><p className="label">{x.ml} ml</p></div>
            <div className="bag__qty">
              <button onClick={() => setQty(x.id, x.ml, x.qty - 1)} aria-label={`Menos ${x.name} ${x.ml} ml`}>−</button>
              <span>{x.qty}</span>
              <button onClick={() => setQty(x.id, x.ml, x.qty + 1)} aria-label={`Más ${x.name} ${x.ml} ml`} disabled={x.qty >= x.stock}>+</button>
            </div>
            <div className="bag__price"><PriceOdometer value={x.price * x.qty} /></div>
            <button className="bag__remove" onClick={() => remove(x.id, x.ml)} aria-label={`Quitar ${x.name} ${x.ml} ml`}>×</button>
          </div>
        ))}
      </div>
      <div className="bag__foot"><span className="label">Total</span><span className="bag__total"><PriceOdometer value={total} /></span></div>
      <button className="btn btn--solid btn--block" style={{ marginTop: 32 }} onClick={checkout}>Finalizar compra</button>
    </section>
  );
}
