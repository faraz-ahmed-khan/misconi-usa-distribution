import fs from 'node:fs';
import path from 'node:path';
import { getVaultRoot } from './config.js';

function vaultPath(...segments) {
  return path.join(getVaultRoot(), ...segments);
}

function ensureVaultDirs() {
  fs.mkdirSync(vaultPath('suppliers'), { recursive: true });
  fs.mkdirSync(vaultPath('products'), { recursive: true });
  fs.mkdirSync(vaultPath('indexes'), { recursive: true });
}

/**
 * @param {string} ubid
 */
export function productFileName(ubid) {
  return `${ubid.replace(/[^a-zA-Z0-9._-]+/g, '_')}.json`;
}

/**
 * @returns {import('./types.js').VaultManifest | null}
 */
export function readManifest() {
  const file = vaultPath('manifest.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * @returns {import('./types.js').VaultIndexes | null}
 */
export function readIndexes() {
  const file = vaultPath('indexes', 'lookup.json');
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * @param {string} ubidOrKey UBID, SKU, or MPI ID
 * @returns {import('./types.js').VaultProduct | null}
 */
export function readProduct(ubidOrKey) {
  const indexes = readIndexes();

  const direct = vaultPath('products', productFileName(ubidOrKey));
  if (fs.existsSync(direct)) {
    return JSON.parse(fs.readFileSync(direct, 'utf8'));
  }

  const fromSku = indexes?.bySku[ubidOrKey];
  if (fromSku) {
    const file = vaultPath('products', productFileName(fromSku));
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  const fromMpi = indexes?.byMpiId[ubidOrKey];
  if (fromMpi) {
    const file = vaultPath('products', productFileName(fromMpi));
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  return null;
}

/**
 * @param {string} sku
 */
export function readProductBySku(sku) {
  const indexes = readIndexes();
  const ubid = indexes?.bySku[sku];
  if (!ubid) return null;
  return readProduct(ubid);
}

/**
 * @param {string} regCode
 */
export function readProductsByReg(regCode) {
  const indexes = readIndexes();
  const ubids = indexes?.byReg[regCode] || [];
  return ubids.map((ubid) => readProduct(ubid)).filter(Boolean);
}

/**
 * @param {string} msiId
 * @returns {import('./types.js').VaultSupplier | null}
 */
export function readSupplier(msiId) {
  const file = vaultPath('suppliers', `${msiId}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * @param {string} msiId
 */
export function readSupplierProducts(msiId) {
  const indexes = readIndexes();
  const ubids = indexes?.bySupplier[msiId] || [];
  return ubids.map((ubid) => readProduct(ubid)).filter(Boolean);
}

/**
 * @param {import('./types.js').VaultSupplier[]} suppliers
 * @param {import('./types.js').VaultProduct[]} products
 * @param {import('./types.js').VaultIndexes} indexes
 * @param {import('./types.js').VaultManifest} manifest
 */
export function writeVaultSnapshot({ suppliers, products, indexes, manifest }) {
  ensureVaultDirs();

  const productsDir = vaultPath('products');
  const suppliersDir = vaultPath('suppliers');

  for (const file of fs.readdirSync(productsDir)) {
    if (file.endsWith('.json')) fs.unlinkSync(path.join(productsDir, file));
  }
  for (const file of fs.readdirSync(suppliersDir)) {
    if (file.endsWith('.json')) fs.unlinkSync(path.join(suppliersDir, file));
  }

  for (const supplier of suppliers) {
    fs.writeFileSync(
      vaultPath('suppliers', `${supplier.msiId}.json`),
      JSON.stringify(supplier, null, 2)
    );
  }

  for (const product of products) {
    fs.writeFileSync(
      vaultPath('products', productFileName(product.ubid)),
      JSON.stringify(product, null, 2)
    );
  }

  fs.writeFileSync(vaultPath('indexes', 'lookup.json'), JSON.stringify(indexes, null, 2));
  fs.writeFileSync(vaultPath('manifest.json'), JSON.stringify(manifest, null, 2));
}

/**
 * @returns {boolean}
 */
export function vaultExists() {
  return fs.existsSync(vaultPath('manifest.json'));
}
