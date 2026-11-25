import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/api';

export default function AdminHome() {
  const { products, categories, loading } = useCatalog();
  const average = products.length
    ? products.reduce((sum, product) => sum + Number(product.price), 0) / products.length
    : 0;
  const latest = [...products].reverse().slice(0, 5);

  return (
    <>
      <h1>Resumen</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="stat"><span>Productos</span><strong>{products.length}</strong></div>
        <div className="stat"><span>Categorías</span><strong>{categories.length}</strong></div>
        <div className="stat"><span>Precio promedio</span><strong>{formatPrice(Math.round(average))}</strong></div>
      </div>
      <h2>Últimos productos</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : latest.length === 0 ? (
        <p>Todavía no hay productos. Creá el primero con el botón de arriba.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th></tr></thead>
            <tbody>
              {latest.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{categories.find((category) => category.slug === product.category)?.name || '—'}</td>
                  <td>{formatPrice(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
