import fs from 'fs';
import path from 'path';

// Regex to detect secret patterns in client bundle files.
const SECRET_REGEX = /[A-Za-z0-9+/]{40,}/i;

const SECRET_VALUE = process.env.SESSION_ENCRYPTION_KEY;

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (SECRET_VALUE && content.includes(SECRET_VALUE)) {
    console.error(`Secret value found in ${filePath}`);
    process.exitCode = 1;
  }
}


function getJsFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getJsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const staticDir = path.join(process.cwd(), '.next', 'static');
if (!fs.existsSync(staticDir)) {
  console.log('No .next/static directory found.');
  process.exit(0);
}

const files = getJsFiles(staticDir);
if (!files.length) {
  console.log('No client bundle files found to scan.');
  process.exit(0);
}
files.forEach(scanFile);
if (process.exitCode !== 1) {
  console.log('No secrets detected in client bundles.');
}
