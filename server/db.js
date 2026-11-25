const { neon } = require('@neondatabase/serverless');

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está configurado en el entorno server-side.');
  return neon(process.env.DATABASE_URL);
}

module.exports = { getSql };
