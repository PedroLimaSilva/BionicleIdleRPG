import { execSync } from 'node:child_process';
import {
  buildKitUsageSnapshot,
  parseAttachmentKitNodeCounts,
  parseKitNodeRegistry,
  type KitUsageSnapshot,
} from '../src/game/kit/nodes/kitNodeUsageReport';

export {
  buildMarkdownReport,
  usageSnapshotFromWorkspace,
} from '../src/game/kit/nodes/kitNodeUsageReport';

const ATTACHMENTS_PREFIX = 'src/game/kit/attachments/';
const KIT_2001_NODES_PATH = 'src/game/kit/nodes/kit2001Nodes.ts';
const KIT_2003_NODES_PATH = 'src/game/kit/nodes/kit2003Nodes.ts';

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
    process.env.KIT_NODE_BASE_REF?.trim() ||
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

function readFileAtRef(ref: string, repoPath: string): string | null {
  try {
    return execSync(`git show ${ref}:${repoPath}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch {
    return null;
  }
}

function listAttachmentFilesAtRef(ref: string): string[] {
  try {
    const output = execSync(`git ls-tree -r --name-only ${ref} -- ${ATTACHMENTS_PREFIX}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.endsWith('.ts'));
  } catch {
    return [];
  }
}

function mergeCounts(target: Map<string, number>, source: Map<string, number>): void {
  for (const [name, count] of source) {
    target.set(name, (target.get(name) ?? 0) + count);
  }
}

export function usageSnapshotFromGitRef(ref: string): KitUsageSnapshot | null {
  const registry2001Source = readFileAtRef(ref, KIT_2001_NODES_PATH);
  const registry2003Source = readFileAtRef(ref, KIT_2003_NODES_PATH);
  if (!registry2001Source || !registry2003Source) return null;

  const registry2001 = parseKitNodeRegistry(registry2001Source);
  const registry2003 = parseKitNodeRegistry(registry2003Source);

  const counts2001 = new Map<string, number>();
  const counts2003 = new Map<string, number>();

  for (const path of listAttachmentFilesAtRef(ref)) {
    const source = readFileAtRef(ref, path);
    if (!source) continue;
    const fileCounts = parseAttachmentKitNodeCounts(source, registry2001, registry2003);
    for (const [glbName, count] of fileCounts) {
      const in2001 = Object.values(registry2001).includes(glbName);
      const in2003 = Object.values(registry2003).includes(glbName);
      if (in2001) mergeCounts(counts2001, new Map([[glbName, count]]));
      if (in2003) mergeCounts(counts2003, new Map([[glbName, count]]));
    }
  }

  return buildKitUsageSnapshot(counts2001, counts2003, registry2001, registry2003);
}
