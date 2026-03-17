import { useErrorReports } from '../hooks/useTelemetryData';

export function ErrorsPage() {
  const { data, loading, error } = useErrorReports();

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><p className="error">Error: {error}</p></div>;

  return (
    <div className="page">
      <h1>Error Reports ({data.length})</h1>
      {data.length === 0 ? (
        <p>No errors reported.</p>
      ) : (
        <div className="error-list">
          {data.map((row) => (
            <details key={row.id} className="error-card">
              <summary>
                <span className="error-version">{row.app_version}</span>
                <span className="error-time">{new Date(row.received_at).toLocaleString()}</span>
                <span className="error-msg">{row.error_message}</span>
              </summary>
              <div className="error-details">
                <div className="error-meta">
                  <span>Client: {row.client_id ?? 'unknown'}</span>
                  <span>Game state v{row.game_state_version}</span>
                  <span>Protodermis: {row.game_state.protodermis}</span>
                  <span>Characters: {row.game_state.recruitedCharacters?.length ?? 0}</span>
                  <span>Quests: {row.game_state.completedQuests?.length ?? 0}</span>
                </div>
                {row.error_stack && <pre className="error-stack">{row.error_stack}</pre>}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
