import fs from 'node:fs';
import path from 'node:path';

/**
 * Load .env into process.env (Node scripts do not auto-load .env).
 * @param {string} [envPath]
 */
export function loadEnv(envPath = '.env') {
  const resolved = path.resolve(envPath);
  if (!fs.existsSync(resolved)) return;

  const lines = fs.readFileSync(resolved, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
