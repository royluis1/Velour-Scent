const { getSql } = require('../server/db');
const { requireAdmin } = require('../server/auth');

const hasYear = (value) => value !== undefined && value !== null && String(value).trim() !== '';
const validVariants = (variants) => Array.isArray(variants) && variants.length > 0 &&
  variants.every((variant) => variant &&
    Number.isInteger(Number(variant.ml)) && Number(variant.ml) > 0 &&
    Number.isFinite(Number(variant.price)) && Number(variant.price) > 0 &&
    Number.isInteger(Number(variant.stock)) && Number(variant.stock) >= 0) &&
  new Set(variants.map((variant) => Number(variant.ml))).size === variants.length;
const validProduct = (product) =>
  product && typeof product.name === 'string' && product.name.trim() &&
  typeof product.category === 'string' && product.category &&
  validVariants(product.variants) &&
  (!hasYear(product.year) || (Number.isInteger(Number(product.year)) && Number(product.year) > 0));
const optionalText = (value) => (typeof value === 'string' && value.trim() ? value.trim() : null);
const optionalYear = (value) => (hasYear(value) ? Number(value) : null);
const productPrice = (variants) => Math.min(...variants.map((variant) => Number(variant.price)));
const normalizeProduct = (product) => {
  const variants = Array.isArray(product.variants) && product.variants.length
    ? product.variants
    : [{ ml: 100, price: Number(product.price), stock: 10 }];
  return { ...product, price: productPrice(variants), variants };
};

module.exports = async function handler(req, res) {
  try {
    const sql = getSql();
    const id = req.query.id;

    if (req.method === 'GET') {
      if (id !== undefined) {
        const rows = await sql`
          SELECT id, name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
          FROM products WHERE id = ${Number(id)} LIMIT 1
        `;
        return res.status(200).json(rows[0] ? normalizeProduct(rows[0]) : null);
      }
      if (req.query.category) {
        const rows = await sql`
          SELECT id, name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
          FROM products WHERE category = ${req.query.category} ORDER BY id
        `;
        return res.status(200).json(rows.map(normalizeProduct));
      }
      const rows = await sql`
        SELECT id, name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
        FROM products ORDER BY id
      `;
      return res.status(200).json(rows.map(normalizeProduct));
    }

    if (!requireAdmin(req, res)) return;
    if (req.method === 'POST') {
      const product = req.body;
      if (!validProduct(product)) return res.status(400).json({ error: 'Ingresá nombre, categoría y variantes válidas, sin repetir ML.' });
      const categoryRows = await sql`SELECT slug FROM categories WHERE slug = ${product.category} LIMIT 1`;
      if (!categoryRows.length) return res.status(400).json({ error: 'La categoría seleccionada no existe.' });
      const rows = await sql`
        INSERT INTO products (
          name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
        )
        VALUES (${product.name.trim()}, ${product.category}, ${productPrice(product.variants)},
          ${JSON.stringify(product.variants)}::jsonb,
          ${JSON.stringify(product.notes || {})}::jsonb, ${product.desc || ''}, ${product.image || null},
          ${optionalText(product.concentration)}, ${optionalText(product.gender)}, ${optionalYear(product.year)},
          ${optionalText(product.longevity)}, ${optionalText(product.sillage)}, ${optionalText(product.ingredients)})
        RETURNING id, name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
      `;
      return res.status(201).json(normalizeProduct(rows[0]));
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
        SET name = ${product.name.trim()}, category = ${product.category},
          price = ${productPrice(product.variants)}, variants = ${JSON.stringify(product.variants)}::jsonb,
          notes = ${JSON.stringify(product.notes || {})}::jsonb, "desc" = ${product.desc || ''}, image = ${product.image || null},
          concentration = ${optionalText(product.concentration)}, gender = ${optionalText(product.gender)},
          year = ${optionalYear(product.year)}, longevity = ${optionalText(product.longevity)},
          sillage = ${optionalText(product.sillage)}, ingredients = ${optionalText(product.ingredients)}
        WHERE id = ${Number(id)}
        RETURNING id, name, category, price, variants, notes, "desc", image, concentration, gender, year, longevity, sillage, ingredients
      `;
      return rows[0]
        ? res.status(200).json(normalizeProduct(rows[0]))
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
