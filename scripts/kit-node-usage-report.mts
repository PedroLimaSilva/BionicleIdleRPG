/**
 * Markdown kit node usage ranking for PR comments and local checks.
 * Usage: yarn kit-node-usage-report [--markdown] [--base-ref origin/master]
 */
import {
  buildMarkdownReport,
  resolveMergeBaseRef,
  usageSnapshotFromGitRef,
  usageSnapshotFromWorkspace,
} from './kit-node-usage.ts';

const markdown = process.argv.includes('--markdown');
const baseRefArg = process.argv.find((arg) => arg.startsWith('--base-ref='))?.split('=')[1];

const mergeBase = baseRefArg ?? resolveMergeBaseRef();
const after = usageSnapshotFromWorkspace();
const before = usageSnapshotFromGitRef(mergeBase);
const report = buildMarkdownReport(after, before);

if (markdown) {
  console.log(report);
} else {
  console.log(report);
  console.log('');
  console.log(`(merge-base: ${mergeBase})`);
}
