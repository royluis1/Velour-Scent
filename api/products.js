const { getSql } = require('../server/db');
const { requireAdmin } = require('../server/auth');

const validProduct = (product) =>
  product && typeof product.name === 'string' && product.name.trim() &&
  typeof product.category === 'string' && product.category &&
  Number.isFinite(Number(product.price)) && Number(product.price) > 0;

module.exports = async function handler(req, res) {
  try {
    const sql = getSql();
    const id = req.query.id;

    if (req.method === 'GET') {
      if (id !== undefined) {
        const rows = await sql`SELECT id, name, category, price, notes, "desc", image FROM products WHERE id = ${Number(id)} LIMIT 1`;
        return res.status(200).json(rows[0] || null);
      }
      if (req.query.category) {
        const rows = await sql`SELECT id, name, category, price, notes, "desc", image FROM products WHERE category = ${req.query.category} ORDER BY id`;
        return res.status(200).json(rows);
      }
      const rows = await sql`SELECT id, name, category, price, notes, "desc", image FROM products ORDER BY id`;
      return res.status(200).json(rows);
    }

    if (!requireAdmin(req, res)) return;
    if (req.method === 'POST') {
      const product = req.body;
      if (!validProduct(product)) return res.status(400).json({ error: 'Nombre, categoría y precio mayor que cero son obligatorios.' });
      const categoryRows = await sql`SELECT slug FROM categories WHERE slug = ${product.category} LIMIT 1`;
      if (!categoryRows.length) return res.status(400).json({ error: 'La categoría seleccionada no existe.' });
      const rows = await sql`
        INSERT INTO products (name, category, price, notes, "desc", image)
        VALUES (${product.name.trim()}, ${product.category}, ${Number(product.price)},
          ${JSON.stringify(product.notes || {})}::jsonb, ${product.desc || ''}, ${product.image || null})
        RETURNING id, name, category, price, notes, "desc", image
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PATCH') {
      const product = req.body;
      if (!id || !Number.isInteger(Number(id)) || !validProduct(product)) {
        return res.status(400).json({ error: 'Producto inválido.' });
      }
      const categoryRows = await sql`SELECT slug FROM categories WHERE slug = ${product.category} LIMIT 1`;
      if (!categoryRows.length) return res.status(400).json({ error: 'La categoría seleccionada no existe.' });
      const rows = await sql`
        UPDATE products
        SET name = ${product.name.trim()}, category = ${product.category}, price = ${Number(product.price)},
          notes = ${JSON.stringify(product.notes || {})}::jsonb, "desc" = ${product.desc || ''}, image = ${product.image || null}
        WHERE id = ${Number(id)}
        RETURNING id, name, category, price, notes, "desc", image
      `;
      return rows[0]
        ? res.status(200).json(rows[0])
        : res.status(404).json({ error: 'Producto no encontrado.' });
    }

    if (req.method === 'DELETE') {
      if (!id || !Number.isInteger(Number(id))) return res.status(400).json({ error: 'Identificador inválido.' });
      const rows = await sql`DELETE FROM products WHERE id = ${Number(id)} RETURNING id`;
      return rows.length
        ? res.status(200).json({ deleted: true })
        : res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Método no permitido.' });
  } catch (error) {
    console.error('Error en /api/products.', error);
    return res.status(500).json({ error: 'No se pudieron consultar o guardar los productos.' });
  }
};
