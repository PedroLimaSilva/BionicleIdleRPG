import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export type GlbEntry = { path: string; bytes: number };

export type GlbInventory = {
  count: number;
  files: GlbEntry[];
  totalBytes: number;
};

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const publicDir = join(repoRoot, 'public');

export function collectGlbFilesFromDisk(dir: string = publicDir): GlbEntry[] {
  const entries: GlbEntry[] = [];

  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    return entries;
  }

  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, name.name);
    if (name.isDirectory()) {
      entries.push(...collectGlbFilesFromDisk(fullPath));
    } else if (name.isFile() && name.name.endsWith('.glb')) {
      entries.push({
        bytes: statSync(fullPath).size,
        path: relative(publicDir, fullPath),
      });
    }
  }

  return entries;
}

export function inventoryFromDisk(): GlbInventory {
  const files = collectGlbFilesFromDisk().sort((a, b) => a.path.localeCompare(b.path));
  return {
    count: files.length,
    files,
    totalBytes: files.reduce((sum, f) => sum + f.bytes, 0),
  };
}

function listGlbPathsAtGitRef(ref: string): string[] {
  const output = execSync(`git ls-tree -r --name-only ${ref} -- public`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.glb'));
}

function readGlbBytesAtGitRef(ref: string, repoPath: string): number {
  const buffer = execSync(`git show ${ref}:${repoPath}`, {
    encoding: 'buffer',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return buffer.byteLength;
}

export function inventoryFromGitRef(ref: string): GlbInventory {
  const files: GlbEntry[] = [];

  for (const repoPath of listGlbPathsAtGitRef(ref)) {
    try {
      files.push({
        bytes: readGlbBytesAtGitRef(ref, repoPath),
        path: relative(publicDir, repoPath),
      });
    } catch {
      // File removed or unreadable at this ref; skip.
    }
  }

  files.sort((a, b) => a.path.localeCompare(b.path));
  return {
    count: files.length,
    files,
    totalBytes: files.reduce((sum, f) => sum + f.bytes, 0),
  };
}

export function formatBytes(bytes: number): string {
  const sign = bytes < 0 ? '−' : '';
  const abs = Math.abs(bytes);
  if (abs < 1024) return `${sign}${abs} B`;
  if (abs < 1024 * 1024) return `${sign}${(abs / 1024).toFixed(2)} KiB`;
  return `${sign}${(abs / (1024 * 1024)).toFixed(2)} MiB`;
}

export function formatSignedDelta(deltaBytes: number): string {
  if (deltaBytes === 0) return '0 B';
  const prefix = deltaBytes > 0 ? '+' : '−';
  return `${prefix}${formatBytes(deltaBytes).replace(/^−/, '')}`;
}

function gitRefExists(ref: string): boolean {
  try {
    execSync(`git rev-parse --verify ${ref}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function resolveMergeBaseRef(): string {
  const explicit =
    process.env.GLB_SIZE_BASE_REF?.trim() ||
    (process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : undefined);

  if (explicit && gitRefExists(explicit)) {
    return execSync(`git merge-base HEAD ${explicit}`, { encoding: 'utf8' }).trim();
  }

  for (const branch of ['origin/main', 'origin/master', 'main', 'master']) {
    if (!gitRefExists(branch)) continue;
    return execSync(`git merge-base HEAD ${branch}`, { encoding: 'utf8' }).trim();
  }

  return execSync('git rev-parse HEAD~1', { encoding: 'utf8' }).trim();
}

export type GlbSizeChange = {
  afterBytes: number | null;
  beforeBytes: number | null;
  deltaBytes: number;
  path: string;
};

export function diffInventories(before: GlbInventory, after: GlbInventory): GlbSizeChange[] {
  const beforeByPath = new Map(before.files.map((f) => [f.path, f.bytes]));
  const afterByPath = new Map(after.files.map((f) => [f.path, f.bytes]));
  const paths = new Set([...beforeByPath.keys(), ...afterByPath.keys()]);

  const changes: GlbSizeChange[] = [];
  for (const path of paths) {
    const beforeBytes = beforeByPath.get(path) ?? null;
    const afterBytes = afterByPath.get(path) ?? null;
    const deltaBytes = (afterBytes ?? 0) - (beforeBytes ?? 0);
    if (beforeBytes === afterBytes) continue;
    changes.push({ afterBytes, beforeBytes, deltaBytes, path });
  }

  return changes.sort((a, b) => Math.abs(b.deltaBytes) - Math.abs(a.deltaBytes));
}

export function buildMarkdownReport(before: GlbInventory, after: GlbInventory): string {
  const changes = diffInventories(before, after);
  const totalDelta = after.totalBytes - before.totalBytes;
  const lines: string[] = [
    '## GLB size report',
    '',
    `Compared \`${before.count}\` → \`${after.count}\` file(s) under \`public/\`.`,
    '',
    `**Total:** ${formatBytes(before.totalBytes)} → ${formatBytes(after.totalBytes)} (**${formatSignedDelta(totalDelta)}**)`,
    '',
  ];

  if (changes.length === 0) {
    lines.push('_No per-file size changes (only identical replacements)._');
    return lines.join('\n');
  }

  lines.push('| File | Before | After | Δ |', '| --- | ---: | ---: | ---: |');
  for (const { afterBytes, beforeBytes, deltaBytes, path } of changes) {
    const beforeLabel = beforeBytes === null ? '—' : formatBytes(beforeBytes);
    const afterLabel = afterBytes === null ? '—' : formatBytes(afterBytes);
    lines.push(
      `| \`${path}\` | ${beforeLabel} | ${afterLabel} | ${formatSignedDelta(deltaBytes)} |`
    );
  }

  return lines.join('\n');
}
