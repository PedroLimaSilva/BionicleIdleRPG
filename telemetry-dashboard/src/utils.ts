import { TelemetrySession } from './types';

export function countByKey<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

export function toChartData(counts: Record<string, number>) {
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function sessionsOnly(data: TelemetrySession[]) {
  return data.filter((d) => !d.error_message);
}

export function sessionsPerDay(data: TelemetrySession[]) {
  const counts = countByKey(data, (d) => d.received_at.slice(0, 10));
  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function uniqueClients(data: TelemetrySession[]) {
  return new Set(data.map((d) => d.client_id).filter(Boolean)).size;
}

export function avgCompletedQuests(data: TelemetrySession[]) {
  const sessions = sessionsOnly(data);
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, d) => sum + (d.game_state.completedQuests?.length ?? 0), 0);
  return Math.round((total / sessions.length) * 10) / 10;
}

export function avgProtodermis(data: TelemetrySession[]) {
  const sessions = sessionsOnly(data);
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, d) => sum + (d.game_state.protodermis ?? 0), 0);
  return Math.round(total / sessions.length);
}

export function avgRecruitedCharacters(data: TelemetrySession[]) {
  const sessions = sessionsOnly(data);
  if (sessions.length === 0) return 0;
  const total = sessions.reduce(
    (sum, d) => sum + (d.game_state.recruitedCharacters?.length ?? 0),
    0
  );
  return Math.round((total / sessions.length) * 10) / 10;
}
