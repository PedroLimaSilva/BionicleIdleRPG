import { TelemetrySession } from '../types';

export function SessionsPage({ data }: { data: TelemetrySession[] }) {
  return (
    <div className="page">
      <h1>Recent Sessions ({data.length})</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Version</th>
              <th>Client</th>
              <th>Proto</th>
              <th>Characters</th>
              <th>Quests</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className={row.error_message ? 'row-error' : ''}>
                <td>{new Date(row.received_at).toLocaleString()}</td>
                <td><code>{row.app_version}</code></td>
                <td title={row.client_id ?? ''}>{row.client_id?.slice(0, 8) ?? '—'}</td>
                <td>{row.game_state.protodermis ?? '—'}</td>
                <td>{row.game_state.recruitedCharacters?.length ?? 0}</td>
                <td>{row.game_state.completedQuests?.length ?? 0}</td>
                <td>{row.error_message ? '⚠' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
