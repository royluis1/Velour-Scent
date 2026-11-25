import { request } from './api';

describe('API request responses', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('returns null for a 204 or an empty successful response', async () => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ status: 204, ok: true, text: async () => '' })
      .mockResolvedValueOnce({ status: 200, ok: true, text: async () => '  ' });

    await expect(request('/api/test')).resolves.toBeNull();
    await expect(request('/api/test')).resolves.toBeNull();
  });

  it('throws an ApiError with the HTTP status when the server returns HTML', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 502,
      ok: false,
      text: async () => '<html>Bad Gateway</html>',
    });

    await expect(request('/api/test')).rejects.toMatchObject({
      name: 'ApiError',
      status: 502,
      message: 'El servidor devolvió una respuesta no JSON (HTTP 502).',
    });
  });

  it('throws an ApiError with the HTTP status for an empty error response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 503,
      ok: false,
      text: async () => '',
    });

    await expect(request('/api/test')).rejects.toMatchObject({
      name: 'ApiError',
      status: 503,
      message: 'El servidor respondió sin contenido (HTTP 503).',
    });
  });
});
