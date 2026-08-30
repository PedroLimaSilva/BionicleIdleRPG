/**
 * Markdown inventory of character rig animation clips (for PR comments and local checks).
 * Usage: yarn animation-clip-report [--markdown]
 */
import { buildMarkdownReport } from './animation-clips.ts';

const markdown = process.argv.includes('--markdown');
const report = buildMarkdownReport();

if (markdown) {
  console.log(report);
} else {
  console.log(report);
  console.log('');
  console.log('(Run with --markdown for CI/PR comment output.)');
}
