import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { TelemetrySession } from '../types';
import {
  countByKey,
  toChartData,
  sessionsPerDay,
  sessionsOnly,
  uniqueClients,
  avgCompletedQuests,
  avgProtodermis,
  avgRecruitedCharacters,
} from '../utils';

const COLORS = ['#ffd700', '#61dafb', '#ff6b6b', '#51cf66', '#845ef7', '#ff922b', '#20c997', '#e64980'];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function OverviewPage({ data }: { data: TelemetrySession[] }) {
  const sessions = sessionsOnly(data);
  const errors = data.filter((d) => d.error_message);
  const versionData = toChartData(countByKey(sessions, (d) => d.app_version));
  const dailyData = sessionsPerDay(sessions);
  const questDistribution = toChartData(
    countByKey(sessions, (d) => String(d.game_state.completedQuests?.length ?? 0))
  ).sort((a, b) => Number(a.name) - Number(b.name));

  return (
    <div className="page">
      <h1>Overview</h1>

      <div className="stat-grid">
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard label="Unique Clients" value={uniqueClients(sessions)} />
        <StatCard label="Error Reports" value={errors.length} />
        <StatCard label="Avg Quests Completed" value={avgCompletedQuests(sessions)} />
        <StatCard label="Avg Protodermis" value={avgProtodermis(sessions)} />
        <StatCard label="Avg Characters" value={avgRecruitedCharacters(sessions)} />
      </div>

      <div className="chart-grid">
        <div className="chart-card">
          <h2>Sessions by Version</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={versionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {versionData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Sessions per Day</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1c1d26', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="count" stroke="#ffd700" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Quest Completion Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={questDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" label={{ value: 'Quests completed', position: 'insideBottom', offset: -5, fill: '#888' }} />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: '#1c1d26', border: '1px solid #333' }} />
              <Bar dataKey="value" fill="#61dafb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
