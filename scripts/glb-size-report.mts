/**
 * Markdown diff of .glb sizes vs merge-base (for PR comments and local checks).
 * Usage: yarn glb-size-report [--markdown] [--base-ref origin/main]
 */
import {
  buildMarkdownReport,
  inventoryFromDisk,
  inventoryFromGitRef,
  resolveMergeBaseRef,
} from './glb-sizes.ts';

const markdown = process.argv.includes('--markdown');
const baseRefArg = process.argv.find((arg) => arg.startsWith('--base-ref='))?.split('=')[1];

const mergeBase = baseRefArg ?? resolveMergeBaseRef();
const before = inventoryFromGitRef(mergeBase);
const after = inventoryFromDisk();
const report = buildMarkdownReport(before, after);

if (markdown) {
  console.log(report);
} else {
  console.log(report);
  console.log('');
  console.log(`(merge-base: ${mergeBase})`);
}
