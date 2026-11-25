const { createAdminToken, passwordMatches } = require('../server/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    console.error('ADMIN_PASSWORD y ADMIN_SESSION_SECRET deben configurarse server-side.');
    return res.status(500).json({ error: 'La autenticación no está configurada.' });
  }
  if (!passwordMatches(req.body && req.body.password)) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  try {
    return res.status(200).json({ token: createAdminToken() });
  } catch (error) {
    console.error('No se pudo crear la sesión admin.', error);
    return res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
};
