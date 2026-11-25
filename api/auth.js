const { createAdminToken, passwordMatches } = require('../server/auth');

const attemptsByIp = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

// Best-effort per warm serverless instance; a shared store is needed for a global limit.
function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  return (forwardedFor && forwardedFor.split(',')[0].trim()) ||
    req.headers['x-real-ip'] ||
    (req.socket && req.socket.remoteAddress) ||
    'unknown';
}

function isLockedOut(ip, now) {
  const state = attemptsByIp.get(ip);
  if (!state) return false;
  if (state.lockedUntil > now) return true;
  if (state.lockedUntil || now - state.startedAt >= WINDOW_MS) attemptsByIp.delete(ip);
  return false;
}

function recordFailure(ip, now) {
  const current = attemptsByIp.get(ip);
  const state = !current || now - current.startedAt >= WINDOW_MS
    ? { startedAt: now, failures: 0 }
    : current;
  state.failures += 1;
  if (state.failures >= MAX_ATTEMPTS) state.lockedUntil = now + LOCKOUT_MS;
  attemptsByIp.set(ip, state);
  return state.lockedUntil > now;
}

function clearExpiredAttempts(now) {
  for (const [ip, state] of attemptsByIp) {
    const expiresAt = state.lockedUntil || state.startedAt + WINDOW_MS;
    if (expiresAt <= now) attemptsByIp.delete(ip);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido.' });
  }
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    console.error('ADMIN_PASSWORD y ADMIN_SESSION_SECRET deben configurarse server-side.');
    return res.status(500).json({ error: 'La autenticación no está configurada.' });
  }
  const ip = getClientIp(req);
  const now = Date.now();
  clearExpiredAttempts(now);
  if (isLockedOut(ip, now)) {
    res.setHeader('Retry-After', String(Math.ceil(LOCKOUT_MS / 1000)));
    return res.status(429).json({ error: 'Demasiados intentos. Esperá unos minutos antes de volver a probar.' });
  }
  if (!passwordMatches(req.body && req.body.password)) {
    if (recordFailure(ip, now)) {
      res.setHeader('Retry-After', String(Math.ceil(LOCKOUT_MS / 1000)));
      return res.status(429).json({ error: 'Demasiados intentos. Esperá unos minutos antes de volver a probar.' });
    }
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  attemptsByIp.delete(ip);
  try {
    return res.status(200).json({ token: createAdminToken() });
  } catch (error) {
    console.error('No se pudo crear la sesión admin.', error);
    return res.status(500).json({ error: 'No se pudo iniciar sesión.' });
  }
};
