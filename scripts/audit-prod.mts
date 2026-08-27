import { spawnSync } from 'node:child_process';

type Severity = 'critical' | 'high' | 'moderate' | 'low' | 'info';

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  high: 3,
  moderate: 2,
  low: 1,
  info: 0,
};

const minSeverity = (process.argv[2] ?? 'critical') as Severity;
const minRank = SEVERITY_RANK[minSeverity] ?? SEVERITY_RANK.critical;

const result = spawnSync('yarn', ['audit', '--groups', 'dependencies', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim();
const advisories = output
  .split('\n')
  .map((line) => {
    try {
      return JSON.parse(line) as {
        type?: string;
        data?: { advisory?: { module_name?: string; severity?: Severity; title?: string } };
      };
    } catch {
      return null;
    }
  })
  .filter((entry) => entry?.type === 'auditAdvisory');

const failing = advisories.filter((entry) => {
  const severity = entry?.data?.advisory?.severity;
  if (!severity) return false;
  return (SEVERITY_RANK[severity] ?? 0) >= minRank;
});

if (failing.length === 0) {
  console.log(`No production dependency advisories at or above "${minSeverity}".`);
  process.exit(0);
}

console.error(
  `Found ${failing.length} production dependency advisories at or above "${minSeverity}":`,
);
for (const entry of failing) {
  const advisory = entry?.data?.advisory;
  console.error(`- [${advisory?.severity}] ${advisory?.module_name}: ${advisory?.title}`);
}
process.exit(1);
