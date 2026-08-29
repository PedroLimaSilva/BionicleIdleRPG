/**
 * Biweekly release helper: compute semver, generate changelog entries, update package.json.
 *
 * Usage:
 *   yarn release:plan [--date YYYY-MM-DD]     Print planned version (no writes)
 *   yarn release:notes [--since vX.Y.Z]       Print changelog section for merged PRs
 *   yarn release:bump [--date YYYY-MM-DD]       Bump package.json + prepend CHANGELOG.md
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

interface ReleaseConfig {
  anchorDate: string;
  intervalDays: number;
  kickoffVersion: string;
  baselineVersion: string;
  baselineTag: string | null;
}

interface MergedPullRequest {
  number: number;
  title: string;
  mergedAt: string;
}

const ROOT = new URL('..', import.meta.url).pathname;
const CONFIG_PATH = `${ROOT}/release.config.json`;
const CATEGORIES_PATH = `${ROOT}/release.categories.json`;
const PACKAGE_PATH = `${ROOT}/package.json`;
const CHANGELOG_PATH = `${ROOT}/CHANGELOG.md`;

interface ReleaseCategoryRule {
  name: string;
  patterns: string[];
}

interface ReleaseCategoryCompiled {
  name: string;
  patterns: RegExp[];
}

function readConfig(): ReleaseConfig {
  return JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as ReleaseConfig;
}

function parseUtcDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatUtcDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000
  );
}

function isReleaseSaturday(date: Date, config: ReleaseConfig): boolean {
  if (date.getUTCDay() !== 6) return false;
  const anchor = parseUtcDate(config.anchorDate);
  const deltaDays = utcDayNumber(date) - utcDayNumber(anchor);
  return deltaDays >= 0 && deltaDays % config.intervalDays === 0;
}

/** 1-based index of this release among biweekly release Saturdays in the same UTC month. */
function releaseIndexInMonth(date: Date, config: ReleaseConfig): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  let index = 0;
  const cursor = new Date(Date.UTC(year, month, 1));
  while (cursor.getUTCMonth() === month) {
    if (isReleaseSaturday(cursor, config)) {
      index += 1;
      if (
        cursor.getUTCFullYear() === date.getUTCFullYear() &&
        cursor.getUTCMonth() === date.getUTCMonth() &&
        cursor.getUTCDate() === date.getUTCDate()
      ) {
        return index;
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  throw new Error(`Release date ${formatUtcDate(date)} is not a scheduled release Saturday`);
}

export function computeVersion(date: Date, config: ReleaseConfig = readConfig()): string {
  if (formatUtcDate(date) === config.anchorDate && config.kickoffVersion) {
    return config.kickoffVersion;
  }
  if (!isReleaseSaturday(date, config)) {
    throw new Error(
      `${formatUtcDate(date)} is not a biweekly release Saturday (anchor ${config.anchorDate})`
    );
  }
  const month = date.getUTCMonth() + 1;
  const patch = releaseIndexInMonth(date, config);
  return `0.${month}.${patch}`;
}

export function planRelease(date: Date, config: ReleaseConfig = readConfig()) {
  const releaseDay = isReleaseSaturday(date, config);
  return {
    date: formatUtcDate(date),
    isReleaseDay: releaseDay,
    version: releaseDay ? computeVersion(date, config) : null,
  };
}

function runGh(args: string[]): string {
  const result = spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error(`gh ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

function latestReleaseTag(): string | null {
  const tags = runGh([
    'release',
    'list',
    '--limit',
    '1',
    '--json',
    'tagName',
    '--jq',
    '.[0].tagName',
  ]);
  return tags.length > 0 ? tags : null;
}

function mergedPullRequestsSince(sinceRef: string | null): MergedPullRequest[] {
  const json = runGh([
    'pr',
    'list',
    '--state',
    'merged',
    '--limit',
    '500',
    '--json',
    'number,title,mergedAt',
  ]);
  const prs = JSON.parse(json) as MergedPullRequest[];
  if (!sinceRef) {
    return prs.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
  }

  let sinceIso: string | null = null;
  if (sinceRef.startsWith('v') && /^v\d/.test(sinceRef)) {
    try {
      sinceIso = runGh([
        'release',
        'view',
        sinceRef,
        '--json',
        'publishedAt',
        '--jq',
        '.publishedAt',
      ]);
    } catch {
      sinceIso = null;
    }
  }

  const filtered = sinceIso
    ? prs.filter((pr) => pr.mergedAt > sinceIso!)
    : prs.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));

  return filtered.sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));
}

function readCategories(): ReleaseCategoryCompiled[] {
  const categories = JSON.parse(readFileSync(CATEGORIES_PATH, 'utf8')) as ReleaseCategoryRule[];
  return categories.map((category) => ({
    name: category.name,
    patterns: category.patterns.map((pattern) => new RegExp(pattern, 'i')),
  }));
}

export function categorizePullRequest(
  title: string,
  categories: ReleaseCategoryCompiled[]
): string {
  for (const category of categories) {
    if (category.patterns.some((pattern) => pattern.test(title))) {
      return category.name;
    }
  }
  return 'Other';
}

function groupPullRequestsByCategory(prs: MergedPullRequest[]): Map<string, MergedPullRequest[]> {
  const categories = readCategories();
  const groups = new Map<string, MergedPullRequest[]>();
  for (const category of categories) {
    groups.set(category.name, []);
  }
  groups.set('Other', []);

  for (const pr of prs) {
    const category = categorizePullRequest(pr.title, categories);
    groups.get(category)!.push(pr);
  }

  return groups;
}

function formatPullRequestLine(pr: MergedPullRequest): string {
  return `- #${pr.number} ${pr.title}`;
}

function formatChangelogSection(
  version: string,
  date: string,
  sinceLabel: string,
  prs: MergedPullRequest[]
): string {
  const groups = groupPullRequestsByCategory(prs);
  const categoryOrder = [...readCategories().map((category) => category.name), 'Other'];
  const lines = [`## [${version}] - ${date}`, '', `Merged since ${sinceLabel}:`, ''];

  for (const category of categoryOrder) {
    const entries = groups.get(category) ?? [];
    if (entries.length === 0) continue;
    lines.push(`### ${category}`, '', ...entries.map(formatPullRequestLine), '');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function readPackageVersion(): string {
  const pkg = JSON.parse(readFileSync(PACKAGE_PATH, 'utf8')) as { version: string };
  return pkg.version;
}

function writePackageVersion(version: string): void {
  const raw = readFileSync(PACKAGE_PATH, 'utf8');
  const updated = raw.replace(/("version"\s*:\s*")[^"]+(")/, `$1${version}$2`);
  writeFileSync(PACKAGE_PATH, updated);
}

function replaceChangelogSection(version: string, section: string): void {
  const header =
    '# Changelog\n\nBiweekly releases land every other Saturday. See [docs/RELEASES.md](docs/RELEASES.md).\n\n';
  const existing = readFileSync(CHANGELOG_PATH, 'utf8');
  const sectionPattern = new RegExp(
    `## \\[${version.replace(/\./g, '\\.')}\\][\\s\\S]*?(?=\\n## \\[|$)`
  );
  if (!sectionPattern.test(existing)) {
    throw new Error(`Could not find changelog section for ${version}`);
  }
  const updated = existing.replace(sectionPattern, section.trimEnd());
  if (!updated.startsWith('# Changelog')) {
    writeFileSync(CHANGELOG_PATH, `${header}${updated}`);
    return;
  }
  writeFileSync(CHANGELOG_PATH, updated.endsWith('\n') ? updated : `${updated}\n`);
}

function prependChangelog(section: string): void {
  const header =
    '# Changelog\n\nBiweekly releases land every other Saturday. See [docs/RELEASES.md](docs/RELEASES.md).\n\n';
  let existing = '';
  try {
    existing = readFileSync(CHANGELOG_PATH, 'utf8');
  } catch {
    existing = header;
  }
  if (!existing.startsWith('# Changelog')) {
    existing = `${header}${existing}`;
  }
  const body = existing.replace(/^# Changelog[^\n]*\n(?:\n[^\n]*\n)?\n?/, '');
  writeFileSync(CHANGELOG_PATH, `${header}${section}${body}`);
}

function resolveSinceRef(explicitSince: string | undefined, config: ReleaseConfig): string {
  if (explicitSince) return explicitSince;
  const tag = latestReleaseTag();
  if (tag) return tag;
  return config.baselineVersion;
}

function resolveDateArg(): Date {
  const idx = process.argv.indexOf('--date');
  const iso = idx >= 0 ? process.argv[idx + 1] : formatUtcDate(new Date());
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new Error('Expected --date YYYY-MM-DD');
  }
  return parseUtcDate(iso);
}

const command = process.argv[2];

if (command === 'plan') {
  const config = readConfig();
  const date = resolveDateArg();
  console.log(JSON.stringify(planRelease(date, config), null, 2));
  process.exit(0);
}

if (command === 'notes') {
  const config = readConfig();
  const sinceIdx = process.argv.indexOf('--since');
  const sinceRef = resolveSinceRef(sinceIdx >= 0 ? process.argv[sinceIdx + 1] : undefined, config);
  const date = resolveDateArg();
  const version = computeVersion(date, config);
  const prs = mergedPullRequestsSince(sinceRef === config.baselineVersion ? null : sinceRef);
  console.log(formatChangelogSection(version, formatUtcDate(date), sinceRef, prs));
  process.exit(0);
}

if (command === 'bump') {
  const config = readConfig();
  const date = resolveDateArg();
  const version = computeVersion(date, config);
  const current = readPackageVersion();
  if (current === version) {
    console.log(`package.json already at ${version}`);
    process.exit(0);
  }
  const sinceIdx = process.argv.indexOf('--since');
  const sinceRef = resolveSinceRef(sinceIdx >= 0 ? process.argv[sinceIdx + 1] : undefined, config);
  const prs = mergedPullRequestsSince(sinceRef === config.baselineVersion ? null : sinceRef);
  const section = formatChangelogSection(version, formatUtcDate(date), sinceRef, prs);
  writePackageVersion(version);
  prependChangelog(section);
  console.log(`Bumped ${current} -> ${version} and updated CHANGELOG.md (${prs.length} entries)`);
  process.exit(0);
}

if (command === 'refresh') {
  const config = readConfig();
  const versionIdx = process.argv.indexOf('--version');
  const version = versionIdx >= 0 ? process.argv[versionIdx + 1] : readPackageVersion();
  const sinceIdx = process.argv.indexOf('--since');
  const sinceRef = resolveSinceRef(sinceIdx >= 0 ? process.argv[sinceIdx + 1] : undefined, config);
  const dateIdx = process.argv.indexOf('--date');
  const date =
    dateIdx >= 0 ? process.argv[dateIdx + 1] : formatUtcDate(parseUtcDate(config.anchorDate));
  const prs = mergedPullRequestsSince(sinceRef === config.baselineVersion ? null : sinceRef);
  const section = formatChangelogSection(version, date, sinceRef, prs);
  replaceChangelogSection(version, section);
  console.log(`Refreshed CHANGELOG.md section for ${version} (${prs.length} entries)`);
  process.exit(0);
}

console.error(
  'Usage: tsx scripts/release.mts <plan|notes|bump|refresh> [--date YYYY-MM-DD] [--since vX.Y.Z] [--version X.Y.Z]'
);
process.exit(1);
