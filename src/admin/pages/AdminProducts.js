import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/api';

const emptyForm = {
  name: '', category: '', price: '', desc: '',
  notes: { top: '', heart: '', base: '' }, image: '',
};

export default function AdminProducts() {
  const { products, categories, loading, addProduct, updateProduct, removeProduct } = useCatalog();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const edit = (product) => {
    setEditingId(product.id);
    setShowForm(true);
    setForm({
      name: product.name || '',
      category: product.category || categories[0]?.slug || '',
      price: product.price ?? '',
      desc: product.desc || '',
      notes: { top: product.notes?.top || '', heart: product.notes?.heart || '', base: product.notes?.base || '' },
      image: product.image || '',
    });
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0) {
      setError('Ingresá un nombre y un precio mayor que cero.');
      return;
    }
    const product = { ...form, name: form.name.trim(), price };
    try {
      if (editingId === null) await addProduct(product);
      else await updateProduct(editingId, product);
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`¿Eliminar ${product.name}?`)) return;
    try {
      await removeProduct(product.id);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <>
      <h1>Productos</h1>
      <button className="primary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setError(''); setShowForm(true); }}>Nuevo producto</button>
      {loading ? (
        <p style={{ marginTop: 24 }}>Cargando productos...</p>
      ) : !products.length ? (
        <p style={{ marginTop: 24 }}>Todavía no hay productos. Creá el primero con el botón de arriba.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: 24 }}>
          <table>
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{categories.find((category) => category.slug === product.category)?.name || '—'}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>
                    <button type="button" onClick={() => edit(product)}>Editar</button>{' '}
                    <button type="button" className="danger" onClick={() => remove(product)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showForm && <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginTop: 32, maxWidth: 850 }}>
        <h2 style={{ gridColumn: '1 / -1', marginBottom: 0 }}>{editingId === null ? 'Nuevo producto' : 'Editar producto'}</h2>
        <label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Categoría
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
            <option value="">Elegí una categoría</option>
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
        </label>
        <label>Precio<input type="number" min="0.01" step="0.01" required value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
        <label>URL de imagen<input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
        <label style={{ gridColumn: '1 / -1' }}>Descripción<textarea value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} /></label>
        <label>Notas de salida<input value={form.notes.top} onChange={(event) => setForm({ ...form, notes: { ...form.notes, top: event.target.value } })} /></label>
        <label>Notas de corazón<input value={form.notes.heart} onChange={(event) => setForm({ ...form, notes: { ...form.notes, heart: event.target.value } })} /></label>
        <label>Notas de fondo<input value={form.notes.base} onChange={(event) => setForm({ ...form, notes: { ...form.notes, base: event.target.value } })} /></label>
        {error && <p role="alert" style={{ gridColumn: '1 / -1' }}>{error}</p>}
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Guardar</button>{' '}
          <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); setError(''); }}>Cancelar</button>
        </div>
      </form>}
    </>
  );
}
