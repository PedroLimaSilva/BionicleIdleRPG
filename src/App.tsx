import { PWABadge } from './components/CacheManagement/PWABadge.tsx';
import './App.css';
import { Recruitment } from './pages/Recruitment/index.tsx';

export function App() {
  return (
    <>
      <h1>BionicleIdleRpg</h1>
      <Recruitment />
      <PWABadge />
    </>
  );
}
