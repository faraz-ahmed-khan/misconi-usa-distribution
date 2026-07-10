import path from 'node:path';

/**
 * @returns {string}
 */
export function getVaultRoot() {
  const relative = process.env.MPI_VAULT_DIR || 'data/vault/staging';
  return path.isAbsolute(relative)
    ? relative
    : path.join(/* turbopackIgnore: true */ process.cwd(), relative);
}

/**
 * @returns {string}
 */
export function getApprovalsPath() {
  const relative = process.env.MPI_VAULT_APPROVALS_PATH || 'data/vault/approvals.json';
  return path.isAbsolute(relative)
    ? relative
    : path.join(/* turbopackIgnore: true */ process.cwd(), relative);
}

/**
 * @returns {string | undefined}
 */
export function getAdminToken() {
  return process.env.VAULT_ADMIN_TOKEN || undefined;
}

export const VAULT_ENV = 'staging';
