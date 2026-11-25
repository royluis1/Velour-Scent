import { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';

const emptyForm = { name: '', desc: '' };
const slugify = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, '-');

export default function AdminCategories() {
  const { categories, products, loading, addCategory, updateCategory, removeCategory } = useCatalog();
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState(null);
  const [error, setError] = useState('');

  const edit = (category) => {
    setEditingSlug(category.slug);
    setForm({ name: category.name, desc: category.desc || '' });
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    const slug = slugify(form.name);
    if (!form.name.trim() || !slug) {
      setError('Ingresá un nombre para la categoría.');
      return;
    }
    if (categories.some((category) => category.slug === slug && category.slug !== editingSlug)) {
      setError('Ya existe una categoría con ese nombre.');
      return;
    }
    const category = { name: form.name.trim(), slug, desc: form.desc.trim() };
    try {
      if (editingSlug === null) await addCategory(category);
      else await updateCategory(editingSlug, category);
      setForm(emptyForm);
      setEditingSlug(null);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const remove = async (category) => {
    if (!window.confirm(`¿Eliminar ${category.name}?`)) return;
    try {
      if (!await removeCategory(category.slug)) setError('No se puede eliminar: tiene productos');
      else setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <>
      <h1>Categorías</h1>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Nombre</th><th>Slug</th><th>Productos</th><th>Acciones</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="4">Cargando categorías...</td></tr>}
            {categories.map((category) => (
              <tr key={category.slug}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{products.filter((product) => product.category === category.slug).length}</td>
                <td>
                  <button type="button" onClick={() => edit(category)}>Editar</button>{' '}
                  <button type="button" className="danger" onClick={() => remove(category)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form onSubmit={submit} style={{ display: 'grid', gap: 20, marginTop: 32, maxWidth: 600 }}>
        <h2 style={{ marginBottom: 0 }}>{editingSlug === null ? 'Nueva categoría' : 'Editar categoría'}</h2>
        <label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Descripción<textarea value={form.desc} onChange={(event) => setForm({ ...form, desc: event.target.value })} /></label>
        {error && <p role="alert">{error}</p>}
        <div>
          <button type="submit">Guardar</button>{' '}
          {editingSlug !== null && <button type="button" onClick={() => { setForm(emptyForm); setEditingSlug(null); setError(''); }}>Cancelar</button>}
        </div>
      </form>
    </>
  );
}
