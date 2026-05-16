/**
 * Sum byte sizes of all .glb files under public/ (recursive).
 * Usage: yarn sum-glb-sizes [--json]
 */
import { formatBytes, inventoryFromDisk } from './glb-sizes.ts';

const jsonOutput = process.argv.includes('--json');
const { count, files, totalBytes } = inventoryFromDisk();
const sorted = [...files].sort((a, b) => b.bytes - a.bytes);

if (jsonOutput) {
  console.log(JSON.stringify({ count, files: sorted, totalBytes }, null, 2));
  process.exit(0);
}

console.log(`public/ — ${count} .glb file(s)\n`);
for (const { bytes, path } of sorted) {
  console.log(`${formatBytes(bytes).padStart(12)}  ${path}`);
}
console.log(`${'─'.repeat(60)}`);
console.log(`${formatBytes(totalBytes).padStart(12)}  total`);
