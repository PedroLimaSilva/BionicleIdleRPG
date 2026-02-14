#!/usr/bin/env tsx
/**
 * Check for unused CSS classes in the codebase.
 * Uses PurgeCSS to analyze built CSS against content files (TSX, HTML).
 *
 * Run after build: yarn build && yarn check:unused-css
 * Or standalone: yarn check:unused-css (will run build if dist/ is missing)
 *
 * Fails with exit code 1 if unused CSS classes are found.
 */

import { PurgeCSS } from 'purgecss';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const SRC_DIR = join(process.cwd(), 'src');
const DIST_DIR = join(process.cwd(), 'dist');
const INDEX_HTML = join(process.cwd(), 'index.html');

function globFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules') {
          results.push(...globFiles(fullPath, pattern));
        }
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results;
}

async function main(): Promise<void> {
  // Find built CSS files in dist/ (run build if missing)
  let cssFiles = globFiles(DIST_DIR, /\.css$/);
  if (cssFiles.length === 0) {
    console.log('No CSS in dist/. Running build first...');
    execSync('yarn build', { stdio: 'inherit' });
    cssFiles = globFiles(DIST_DIR, /\.css$/);
  }
  if (cssFiles.length === 0) {
    console.error('No CSS files found in dist/ after build.');
    process.exit(1);
  }

  // Gather all content files (where class names appear)
  const contentPaths = [
    INDEX_HTML,
    ...globFiles(SRC_DIR, /\.(tsx?|jsx?|html)$/),
  ];
  const contentFiles = contentPaths.filter((f) => {
    try {
      return existsSync(f) && statSync(f).isFile();
    } catch {
      return false;
    }
  });

  const purgeCSSResult = await new PurgeCSS().purge({
    content: contentFiles.map((file) => ({
      raw: readFileSync(file, 'utf-8'),
      extension: file.endsWith('.html') ? 'html' : 'tsx',
    })),
    css: cssFiles.map((file) => ({ raw: readFileSync(file, 'utf-8') })),
    rejected: true,
    // Safelist: classes used dynamically (template literals) that PurgeCSS
    // cannot detect through static analysis
    safelist: {
      standard: [
        // Element themes (element-${matoran.element})
        /^element-(Light|Stone|Water|Fire|Ice|Earth|Air|Shadow)$/,
        // Layout/orientation
        'portrait',
        'landscape',
        'active',
        'hidden',
        // Requirement chips
        'met',
        'missing',
        // Recruitment
        'has-enough',
        'not-enough',
        'top',
        'bottom',
        // Chronicle
        'chronicle-entry--unlocked',
        'chronicle-entry--locked',
        // Battle
        'healing',
        'focused',
        'missing',
        /^float-(up|down|left|right)$/,
        // Productivity effects (JobStatusBadge, JobCard) - CSS uses lowercase
        'Boosted',
        'Penalized',
        'Neutral',
        'Idle',
        'boosted',
        'penalized',
        'working',
        // Settings toggle
        'on',
        // Job card
        'code-style',
      ],
      // Safelist selectors matching these patterns (e.g. parent/child, dynamic)
      greedy: [
        /krana-color--/,
        /krana-collection__slot/,
        /chronicle-modal/,
        /model-display/,
        /job-label/,
        /job-rate/,
        /item-icon/,
        /available-quests__title/,
        /route--/,
        /#canvas-mount/,
        /main-content/,
      ],
      // Preserve element selectors and pseudo-classes
      deep: [
        /^h[1-6]$/,
        /:hover/,
        /:focus/,
        /:active/,
        /:disabled/,
        /::before/,
        /::after/,
      ],
    },
  });

  const allRejected: { file: string; selectors: string[] }[] = [];
  for (let i = 0; i < purgeCSSResult.length; i++) {
    const result = purgeCSSResult[i];
    const rejected = (result as { rejected?: string[] }).rejected;
    if (rejected && rejected.length > 0) {
      allRejected.push({
        file: cssFiles[i] ?? `css-${i}`,
        selectors: rejected,
      });
    }
  }

  if (allRejected.length === 0) {
    console.log('✓ No unused CSS classes found.');
    process.exit(0);
  }

  console.error('\n❌ Unused CSS classes detected:\n');
  for (const { file, selectors } of allRejected) {
    const relativePath = file.replace(process.cwd() + '/', '');
    console.error(`  ${relativePath}:`);
    for (const sel of selectors) {
      console.error(`    - ${sel}`);
    }
    console.error('');
  }
  console.error(
    'Remove these unused classes or add them to the safelist in tools/check-unused-css.ts if they are used dynamically.\n',
  );
  process.exit(1);
}

main().catch((err) => {
  console.error('Error running unused CSS check:', err);
  process.exit(1);
});
