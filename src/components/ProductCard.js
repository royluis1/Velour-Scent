import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/api';
import ProductImage from './ProductImage';

export default function ProductCard({ product }) {
  const startingPrice = product.variants?.length
    ? Math.min(...product.variants.map((variant) => Number(variant.price)))
    : Number(product.price);
  return (
    <Link to={`/perfume/${product.id}`} className="product">
      <div className="product__media">
        <ProductImage image={product.image} name={product.name} />
      </div>
      <div className="product__info">
        <h3 className="product__name">{product.name}</h3>
        <p className="product__notes">{product.notes.top} · {product.notes.heart} · {product.notes.base}</p>
        <p className="product__price">Desde {formatPrice(startingPrice)}</p>
      </div>
    </Link>
  );
}
