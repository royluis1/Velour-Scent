const adminTokenKey = 'vs_admin';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function request(path, options = {}, admin = false) {
  const headers = { Accept: 'application/json', ...options.headers };
  if (options.body) headers['Content-Type'] = 'application/json';
  if (admin) {
    const token = sessionStorage.getItem(adminTokenKey);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(path, { ...options, headers });
  const text = await response.text();
  if (response.status === 204 || !text.trim()) {
    if (!response.ok) {
      throw new ApiError(`El servidor respondió sin contenido (HTTP ${response.status}).`, response.status);
    }
    return null;
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError(`El servidor devolvió una respuesta no JSON (HTTP ${response.status}).`, response.status);
  }
  if (!response.ok) {
    const message = data && typeof data.error === 'string'
      ? data.error
      : `No se pudo completar la solicitud (HTTP ${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return data;
}

export const getProducts = (slug) =>
  request(`/api/products${slug ? `?category=${encodeURIComponent(slug)}` : ''}`);
export const getProduct = (id) => request(`/api/products?id=${encodeURIComponent(id)}`);
export const getCategories = () => request('/api/categories');
export const getCategory = (slug) => request(`/api/categories?slug=${encodeURIComponent(slug)}`);

export const loginAdmin = (password) =>
  request('/api/auth', { method: 'POST', body: JSON.stringify({ password }) });
export const createProduct = (product) =>
  request('/api/products', { method: 'POST', body: JSON.stringify(product) }, true);
export const saveProduct = (id, patch) =>
  request(`/api/products?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) }, true);
export const deleteProduct = (id) =>
  request(`/api/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }, true);
export const createCategory = (category) =>
  request('/api/categories', { method: 'POST', body: JSON.stringify(category) }, true);
export const saveCategory = (slug, patch) =>
  request(`/api/categories?slug=${encodeURIComponent(slug)}`, { method: 'PATCH', body: JSON.stringify(patch) }, true);
export const deleteCategory = (slug) =>
  request(`/api/categories?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' }, true);

export const formatPrice = (n) => `$ ${Math.round(Number(n) || 0).toLocaleString('es-AR')}`;

// Fotos previstas en public/img/: hero.jpg, noir-velours.jpg, maison-santal.jpg,
// eclat-de-jasmin.jpg, ombre-vetiver.jpg, rose-cendree.jpg y ambre-sombre.jpg.
// Usar retrato 4:5, fondo oscuro, frasco bien iluminado y sin fondo blanco.
export const heroImage = null;
