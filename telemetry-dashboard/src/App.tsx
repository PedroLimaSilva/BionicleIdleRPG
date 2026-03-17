import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useSessions } from './hooks/useTelemetryData';
import { OverviewPage } from './pages/Overview';
import { SessionsPage } from './pages/Sessions';
import { ErrorsPage } from './pages/Errors';
import './styles.css';

function NavBar() {
  return (
    <nav className="nav">
      <span className="nav-title">Bionicle Telemetry</span>
      <div className="nav-links">
        <NavLink to="/" end>Overview</NavLink>
        <NavLink to="/sessions">Sessions</NavLink>
        <NavLink to="/errors">Errors</NavLink>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { data, loading, error } = useSessions();

  if (loading) return <div className="page"><p>Loading telemetry data...</p></div>;
  if (error) return <div className="page"><p className="error">Failed to load data: {error}</p></div>;

  return (
    <Routes>
      <Route path="/" element={<OverviewPage data={data} />} />
      <Route path="/sessions" element={<SessionsPage data={data} />} />
      <Route path="/errors" element={<ErrorsPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRoutes />
    </BrowserRouter>
  );
}
