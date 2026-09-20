/**
 * Diagnose GLB texture / UV mismatches that make `yarn compress` (Draco) crash
 * with `Cannot read properties of null (reading 'setTexCoord')`.
 *
 * Usage: yarn diagnose-glb-draco public/Bohrok.glb
 */
import { resolve } from 'node:path';
import { readGlbJsonFromPath } from '../src/rendering/3d/kit/nodes/readGlbJson.ts';
import {
  diagnoseGlbDracoIssues,
  formatGlbDracoDiagnostics,
} from '../src/rendering/3d/glbDracoDiagnostics.ts';

const glbPath = process.argv[2];

if (!glbPath) {
  console.error('Usage: yarn diagnose-glb-draco <path/to/model.glb>');
  process.exit(1);
}

const absolute = resolve(glbPath);
const issues = diagnoseGlbDracoIssues(readGlbJsonFromPath(absolute));
const report = formatGlbDracoDiagnostics(glbPath, issues);

if (issues.length === 0) {
  console.log(report);
  process.exit(0);
}

console.error(report);
process.exit(1);
