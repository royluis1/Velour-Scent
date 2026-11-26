import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/api';

const emptyForm = {
  name: '', category: '', desc: '',
  notes: { top: '', heart: '', base: '' }, image: '',
  concentration: '', gender: '', year: '', longevity: '', sillage: '', ingredients: '',
  variants: [{ ml: '30', price: '', stock: '0', featured: true }],
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
      desc: product.desc || '',
      notes: { top: product.notes?.top || '', heart: product.notes?.heart || '', base: product.notes?.base || '' },
      image: product.image || '',
      concentration: product.concentration || '',
      gender: product.gender || '',
      year: product.year ?? '',
      longevity: product.longevity || '',
      sillage: product.sillage || '',
      ingredients: product.ingredients || '',
      variants: (product.variants || []).map((variant) => ({
        ml: String(variant.ml),
        price: String(variant.price),
        stock: String(variant.stock),
        featured: Boolean(variant.featured),
      })),
    });
    setError('');
  };

  const updateVariant = (index, key, value) => setForm((current) => ({
    ...current,
    variants: current.variants.map((variant, variantIndex) => (
      variantIndex === index ? { ...variant, [key]: value } : variant
    )),
  }));

  const addVariant = () => setForm((current) => ({
    ...current,
    variants: [...current.variants, { ml: '', price: '', stock: '0', featured: false }],
  }));

  const submit = async (event) => {
    event.preventDefault();
    const variants = form.variants.map((variant) => ({
      ml: Number(variant.ml),
      price: Number(variant.price),
      stock: Number(variant.stock),
      featured: variant.featured,
    }));
    const validVariants = variants.length > 0 && variants.every((variant, index) =>
      Number.isInteger(variant.ml) && variant.ml > 0 &&
      Number.isFinite(variant.price) && variant.price > 0 &&
      String(form.variants[index].stock).trim() !== '' &&
      Number.isInteger(variant.stock) && variant.stock >= 0
    );
    if (!form.name.trim() || !validVariants) {
      setError('Ingresá un nombre y variantes con ML entero, precio mayor que cero y stock entero no negativo.');
      return;
    }
    if (new Set(variants.map((variant) => variant.ml)).size !== variants.length) {
      setError('No puede repetirse el ML en un mismo producto.');
      return;
    }
    const product = {
      ...form,
      name: form.name.trim(),
      variants,
      price: Math.min(...variants.map((variant) => variant.price)),
    };
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
                  <td>Desde {formatPrice(product.price)}</td>
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
        <label>URL de imagen<input type="url" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} /></label>
        <fieldset className="admin-variants" style={{ gridColumn: '1 / -1' }}>
          <legend>Variantes por tamaño</legend>
          {form.variants.map((variant, index) => (
            <div className="admin-variant" key={index}>
              <label>ML<input type="number" min="1" step="1" required value={variant.ml} onChange={(event) => updateVariant(index, 'ml', event.target.value)} /></label>
              <label>Precio<input type="number" min="0.01" step="1" required value={variant.price} onChange={(event) => updateVariant(index, 'price', event.target.value)} /></label>
              <label>Stock<input type="number" min="0" step="1" required value={variant.stock} onChange={(event) => updateVariant(index, 'stock', event.target.value)} /></label>
              <label className="admin-variant__featured">
                <input type="checkbox" checked={variant.featured} onChange={(event) => updateVariant(index, 'featured', event.target.checked)} />
                Destacada
              </label>
              <button type="button" className="danger" onClick={() => setForm((current) => ({
                ...current,
                variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
              }))}>Quitar</button>
            </div>
          ))}
          <button type="button" onClick={addVariant}>Agregar tamaño</button>
        </fieldset>
        <label style={{ gridColumn: '1 / -1' }}>Descripción<textarea value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} /></label>
        <label>Notas de salida<input value={form.notes.top} onChange={(event) => setForm({ ...form, notes: { ...form.notes, top: event.target.value } })} /></label>
        <label>Notas de corazón<input value={form.notes.heart} onChange={(event) => setForm({ ...form, notes: { ...form.notes, heart: event.target.value } })} /></label>
        <label>Notas de fondo<input value={form.notes.base} onChange={(event) => setForm({ ...form, notes: { ...form.notes, base: event.target.value } })} /></label>
        <label>Concentración<input value={form.concentration} onChange={(event) => setForm({ ...form, concentration: event.target.value })} /></label>
        <label>Género
          <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
            <option value="">Sin especificar</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Unisex">Unisex</option>
          </select>
        </label>
        <label>Año<input type="number" step="1" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} /></label>
        <label>Duración<input value={form.longevity} onChange={(event) => setForm({ ...form, longevity: event.target.value })} /></label>
        <label>Estela<input value={form.sillage} onChange={(event) => setForm({ ...form, sillage: event.target.value })} /></label>
        <label style={{ gridColumn: '1 / -1' }}>Ingredientes<textarea value={form.ingredients} onChange={(event) => setForm({ ...form, ingredients: event.target.value })} /></label>
        {error && <p role="alert" style={{ gridColumn: '1 / -1' }}>{error}</p>}
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit">Guardar</button>{' '}
          <button type="button" onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(false); setError(''); }}>Cancelar</button>
        </div>
      </form>}
    </>
  );
}
