const { getSql } = require('../server/db');
const { requireAdmin } = require('../server/auth');

const validCategory = (category) =>
  category && typeof category.slug === 'string' && category.slug.trim() &&
  typeof category.name === 'string' && category.name.trim();

module.exports = async function handler(req, res) {
  try {
    const sql = getSql();
    const slug = req.query.slug;

    if (req.method === 'GET') {
      if (slug !== undefined) {
        const rows = await sql`SELECT slug, name, "desc" FROM categories WHERE slug = ${slug} LIMIT 1`;
        return res.status(200).json(rows[0] || null);
      }
      const rows = await sql`SELECT slug, name, "desc" FROM categories ORDER BY name`;
      return res.status(200).json(rows);
    }

    if (!requireAdmin(req, res)) return;
    if (req.method === 'POST') {
      const category = req.body;
      if (!validCategory(category)) return res.status(400).json({ error: 'Nombre y slug son obligatorios.' });
      const rows = await sql`
        INSERT INTO categories (slug, name, "desc")
        VALUES (${category.slug.trim()}, ${category.name.trim()}, ${category.desc || ''})
        RETURNING slug, name, "desc"
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PATCH') {
      const category = req.body;
      if (!slug || !validCategory(category)) return res.status(400).json({ error: 'Categoría inválida.' });
      const rows = await sql`
        UPDATE categories SET slug = ${category.slug.trim()}, name = ${category.name.trim()}, "desc" = ${category.desc || ''}
        WHERE slug = ${slug}
        RETURNING slug, name, "desc"
      `;
      return rows[0]
        ? res.status(200).json(rows[0])
        : res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    if (req.method === 'DELETE') {
      if (!slug) return res.status(400).json({ error: 'Slug inválido.' });
      const productRows = await sql`SELECT EXISTS (SELECT 1 FROM products WHERE category = ${slug}) AS has_products`;
      if (productRows[0].has_products) {
        return res.status(409).json({ error: 'No se puede eliminar: tiene productos' });
      }
      const rows = await sql`DELETE FROM categories WHERE slug = ${slug} RETURNING slug`;
      return rows.length
        ? res.status(200).json({ deleted: true })
        : res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('Error en /api/categories.', error);
    if (error.code === '23503') {
      return res.status(409).json({ error: 'No se puede eliminar: tiene productos' });
    }
    return res.status(500).json({ error: 'No se pudieron consultar o guardar las categorías.' });
  }
};
