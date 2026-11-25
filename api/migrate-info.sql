ALTER TABLE products ADD COLUMN IF NOT EXISTS concentration TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS longevity TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sillage TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT;

UPDATE products SET image = '/img/noir-velours.jpg' WHERE id = 1;
UPDATE products SET image = '/img/maison-santal.jpg' WHERE id = 2;
UPDATE products SET image = '/img/eclat-de-jasmin.jpg' WHERE id = 3;
UPDATE products SET image = '/img/ombre-vetiver.jpg' WHERE id = 4;
UPDATE products SET image = '/img/rose-cendree.jpg' WHERE id = 5;
UPDATE products SET image = '/img/ambre-sombre.jpg' WHERE id = 6;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Pimienta rosa, rosa negra y ámbar sobre una base cálida de vainilla oscura.'
WHERE id = 1;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Bergamota fresca, sándalo cremoso y cedro seco con matices amaderados.'
WHERE id = 2;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Pera jugosa y jazmín blanco sobre un fondo suave de almizcle limpio.'
WHERE id = 3;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Pomelo brillante, vetiver terroso y pachulí de carácter profundo.'
WHERE id = 4;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Lichi delicado y rosa de mayo envueltos en un velo de incienso.'
WHERE id = 5;

UPDATE products
SET concentration = 'Eau de Parfum', gender = 'Unisex', year = 2025,
    longevity = '8–10 h', sillage = 'Moderada',
    ingredients = 'Cardamomo cálido, ládano resinoso y vainilla en un acorde ambarado.'
WHERE id = 6;
