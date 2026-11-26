ALTER TABLE products
  ADD COLUMN IF NOT EXISTS variants JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE products
SET variants = jsonb_build_array(
  jsonb_build_object('ml', 100, 'price', price, 'stock', 10)
)
WHERE jsonb_array_length(variants) = 0;
