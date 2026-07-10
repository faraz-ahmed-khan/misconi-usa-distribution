import fs from 'node:fs';
import path from 'node:path';
import { getApprovalsPath } from './config.js';

/**
 * @returns {{ pending: import('./types.js').VaultApproval[], history: import('./types.js').VaultApproval[] }}
 */
function defaultStore() {
  return { pending: [], history: [] };
}

/**
 * @returns {{ pending: import('./types.js').VaultApproval[], history: import('./types.js').VaultApproval[] }}
 */
export function readApprovalsStore() {
  const file = getApprovalsPath();
  if (!fs.existsSync(file)) return defaultStore();
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return {
    pending: data.pending || [],
    history: data.history || [],
  };
}

/**
 * @param {{ pending: import('./types.js').VaultApproval[], history: import('./types.js').VaultApproval[] }} store
 */
export function writeApprovalsStore(store) {
  const file = getApprovalsPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(store, null, 2));
}

/**
 * @param {string} id
 */
export function findApproval(id) {
  const store = readApprovalsStore();
  return (
    store.pending.find((a) => a.id === id) ||
    store.history.find((a) => a.id === id) ||
    null
  );
}

/**
 * @param {import('./types.js').VaultApproval} approval
 */
export function saveApproval(approval) {
  const store = readApprovalsStore();
  store.pending = store.pending.filter((a) => a.id !== approval.id);
  store.history = store.history.filter((a) => a.id !== approval.id);

  if (approval.status === 'pending') {
    store.pending.push(approval);
  } else {
    store.history.unshift(approval);
  }

  writeApprovalsStore(store);
  return approval;
}

/**
 * @returns {import('./types.js').VaultApproval[]}
 */
export function listPendingApprovals() {
  return readApprovalsStore().pending;
}

/**
 * @returns {string}
 */
export function createApprovalId() {
  return `APR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
