import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';

const dir = 'C:/Users/hp/Downloads/distribution website details/FINAL DISTRIBUTION';
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.docx'));

function extractDocx(filePath) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-'));
  const zipCopy = path.join(tmpDir, 'doc.zip');
  fs.copyFileSync(filePath, zipCopy);
  execSync(`tar -xf "${zipCopy}" -C "${tmpDir}"`, { stdio: 'pipe' });
  const xml = fs.readFileSync(path.join(tmpDir, 'word', 'document.xml'), 'utf8');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  let text = xml.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '');
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

for (const file of files.sort()) {
  const full = path.join(dir, file);
  console.log('\n' + '='.repeat(80));
  console.log('FILE:', file);
  console.log('='.repeat(80));
  console.log(extractDocx(full));
}
