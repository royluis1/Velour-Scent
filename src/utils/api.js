// Datos de ejemplo. Para conectar a una API real, reemplazá estas funciones por fetch()
// (por ejemplo la misma fuente que usa el panel admin) y hacelas async.
const categories = [
  { slug: 'floral', name: 'Floral', desc: 'Pétalos, rocío y flores blancas al caer la tarde.' },
  { slug: 'amaderado', name: 'Amaderado', desc: 'Cedro, vetiver y humo suave de madera.' },
  { slug: 'oriental', name: 'Oriental', desc: 'Ámbar, especias tibias y resinas profundas.' },
];

const products = [
  { id: 1, name: 'Noir Velours', category: 'oriental', price: 185, notes: { top: 'Pimienta rosa', heart: 'Rosa negra', base: 'Ámbar' }, desc: 'Un oriental nocturno de textura aterciopelada. Abre con especias suaves y se asienta en un fondo cálido de ámbar y vainilla oscura.' },
  { id: 2, name: 'Maison Santal', category: 'amaderado', price: 210, notes: { top: 'Bergamota', heart: 'Sándalo', base: 'Cedro' }, desc: 'Sándalo cremoso sobre una base de cedro seco. Sobrio, cercano a la piel y de larga estela.' },
  { id: 3, name: 'Éclat de Jasmin', category: 'floral', price: 165, notes: { top: 'Pera', heart: 'Jazmín', base: 'Almizcle' }, desc: 'Jazmín luminoso con un corazón cremoso y un fondo limpio de almizcle blanco.' },
  { id: 4, name: 'Ombre Vetiver', category: 'amaderado', price: 195, notes: { top: 'Pomelo', heart: 'Vetiver', base: 'Pachulí' }, desc: 'Vetiver terroso y fresco, con un fondo de pachulí que se vuelve más profundo con las horas.' },
  { id: 5, name: 'Rose Cendrée', category: 'floral', price: 175, notes: { top: 'Lichi', heart: 'Rosa de mayo', base: 'Incienso' }, desc: 'Una rosa envuelta en incienso, entre lo romántico y lo ceremonial.' },
  { id: 6, name: 'Ambre Sombre', category: 'oriental', price: 220, notes: { top: 'Cardamomo', heart: 'Labdanum', base: 'Vainilla' }, desc: 'Ámbar resinoso y especiado, de una calidez densa que se queda en la ropa.' },
];

export const sizes = [30, 50, 100];
export const getCategories = () => categories;
export const getCategory = (slug) => categories.find((c) => c.slug === slug);
export const getProducts = (slug) => (slug ? products.filter((p) => p.category === slug) : products);
export const getProduct = (id) => products.find((p) => p.id === Number(id));
export const formatPrice = (n) => `USD ${n}`;

// Foto del hero (ej: '/img/hero.jpg' en public/img/). Con null se usa el fondo degradado.
export const heroImage = null;
// Fotos de producto: agregá image: '/img/noir-velours.jpg' a cada producto de arriba.
