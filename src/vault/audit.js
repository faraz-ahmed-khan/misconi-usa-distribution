import fs from 'node:fs';
import path from 'node:path';
import { getVaultRoot } from './config.js';

/**
 * @param {import('./types.js').AuditEvent} event
 */
export function appendAuditEvent(event) {
  const auditPath = path.join(getVaultRoot(), 'audit.jsonl');
  fs.mkdirSync(path.dirname(auditPath), { recursive: true });
  fs.appendFileSync(auditPath, `${JSON.stringify(event)}\n`, 'utf8');
}

/**
 * @param {number} [limit]
 * @returns {import('./types.js').AuditEvent[]}
 */
export function readAuditEvents(limit = 100) {
  const auditPath = path.join(getVaultRoot(), 'audit.jsonl');
  if (!fs.existsSync(auditPath)) return [];

  const lines = fs.readFileSync(auditPath, 'utf8').trim().split(/\r?\n/).filter(Boolean);
  const slice = limit > 0 ? lines.slice(-limit) : lines;
  return slice.map((line) => JSON.parse(line));
}
