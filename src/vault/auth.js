import { getAdminToken } from './config.js';

/**
 * @param {Request} request
 * @returns {{ ok: true } | { ok: false, status: number, message: string }}
 */
export function requireAdminAuth(request) {
  const token = getAdminToken();
  if (!token) {
    return {
      ok: false,
      status: 503,
      message: 'VAULT_ADMIN_TOKEN is not configured on the server',
    };
  }

  const header = request.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const queryToken = new URL(request.url).searchParams.get('token') || '';

  if (bearer === token || queryToken === token) {
    return { ok: true };
  }

  return { ok: false, status: 401, message: 'Unauthorized' };
}

/**
 * @param {string | undefined} token
 */
export function isValidAdminToken(token) {
  const expected = getAdminToken();
  return Boolean(expected && token && token === expected);
}
