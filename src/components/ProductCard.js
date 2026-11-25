import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/api';

export default function ProductCard({ product }) {
  return (
    <Link to={`/perfume/${product.id}`} className="product">
      <div className="product__media">
        {product.image ? <img src={product.image} alt={product.name} /> : <span className="mono">{product.name[0]}</span>}
      </div>
      <div className="product__info">
        <h3 className="product__name">{product.name}</h3>
        <p className="product__notes">{product.notes.top} · {product.notes.heart} · {product.notes.base}</p>
        <p className="product__price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
