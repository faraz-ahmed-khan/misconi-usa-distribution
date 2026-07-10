import path from 'node:path';
import { loadEnv } from '../intake/utils/load-env.js';

let envLoaded = false;

export function ensureVaultEnv() {
  if (!envLoaded) {
    loadEnv(path.resolve(process.cwd(), '.env'));
    envLoaded = true;
  }
}

/**
 * @param {unknown} data
 * @param {number} [status]
 */
export function jsonResponse(data, status = 200) {
  return Response.json(data, { status });
}

/**
 * @param {string} message
 * @param {number} [status]
 */
export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}
