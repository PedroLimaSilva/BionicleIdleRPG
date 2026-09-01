/**
 * Inspect one character GLB against the animation inventory.
 * Usage: yarn animation-clip-inspect Toa_Metru/Vakama.glb
 *        yarn animation-clip-inspect public/Toa_Metru/Vakama.glb --markdown
 */
import { buildGlbInspectMarkdown, inspectGlb } from './animation-clips.ts';

const args = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
const markdown = process.argv.includes('--markdown');
const glbPath = args[0];

if (!glbPath) {
  console.error('Usage: yarn animation-clip-inspect <path/to/model.glb> [--markdown]');
  console.error('Example: yarn animation-clip-inspect Toa_Metru/Vakama.glb');
  process.exit(1);
}

const result = inspectGlb(glbPath);
const report = buildGlbInspectMarkdown(result);

if (markdown) {
  console.log(report);
} else {
  console.log(report);
  console.log('');
  console.log('(Run with --markdown for CI/PR comment output.)');
}

if (!result.rig) {
  process.exit(2);
}
