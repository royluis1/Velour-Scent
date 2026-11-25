const crypto = require('crypto');

function secureEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function passwordMatches(password) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && typeof password === 'string' && secureEqual(password, expected));
}

function createAdminToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET no está configurado en el entorno server-side.');
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
  const signature = crypto.createHmac('sha256', secret).update(String(expiresAt)).digest('hex');
  return `${expiresAt}.${signature}`;
}

function isAdminRequest(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const [expiresAt, signature] = token.split('.');
  if (!secret || !expiresAt || !signature || Number(expiresAt) <= Date.now()) return false;
  const expected = crypto.createHmac('sha256', secret).update(expiresAt).digest('hex');
  return secureEqual(signature, expected);
}

function requireAdmin(req, res) {
  if (isAdminRequest(req)) return true;
  res.status(401).json({ error: 'Sesión de administración inválida o vencida.' });
  return false;
}

module.exports = { createAdminToken, passwordMatches, requireAdmin };
