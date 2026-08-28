import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Tabs } from '../../components/Tabs';
import { MatoranAvatar } from '../../rendering/2d/MatoranAvatar';
import { useGame } from '../../context/Game';
import { DEX_TABS, DexTabId, getCharacterDexEntries, matchesDexTab } from './dexEntries';
import './index.scss';

export const CharacterDex: React.FC = () => {
  const { customCharacters } = useGame();
  const [tab, setTab] = useState<DexTabId>('all');
  const [query, setQuery] = useState('');
  const entries = useMemo(() => {
    void customCharacters;
    return getCharacterDexEntries();
  }, [customCharacters]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (!matchesDexTab(entry, tab)) return false;
      if (!needle) return true;
      return (
        entry.name.toLowerCase().includes(needle) ||
        entry.id.toLowerCase().includes(needle) ||
        entry.stage.toLowerCase().includes(needle)
      );
    });
  }, [entries, query, tab]);

  return (
    <div className="page-container character-dex">
      <div className="character-dex-header">
        <Link to="/settings" className="character-dex-back">
          <ArrowLeft size={18} aria-hidden /> Back to Settings
        </Link>
        <h1 className="title">Character Dex</h1>
        <p className="character-dex-lede">
          Preview every dex character in 3D with idle glow, combat animations, and mask controls.
          Recruitment is not required.
        </p>
        <label className="character-dex-search">
          <span className="visually-hidden">Search characters</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, id, or stage"
            aria-label="Search characters"
          />
        </label>
      </div>
      <div className="character-dex-tabs">
        <Tabs tabs={DEX_TABS} activeTab={tab} onTabChange={(next) => setTab(next as DexTabId)} />
      </div>
      <p className="character-dex-count" data-testid="dex-count">
        {visible.length} character{visible.length === 1 ? '' : 's'}
      </p>
      <div className="character-dex-grid">
        {visible.map((entry) => (
          <Link
            key={entry.id}
            to={`/test/dex/${entry.id}`}
            className={`character-dex-card element-${entry.element}`}
            data-character-id={entry.id}
          >
            <MatoranAvatar matoran={{ ...entry, exp: 0 }} styles="matoran-avatar model-preview" />
            <div className="character-dex-card-meta">
              <div className="character-dex-card-name">{entry.name}</div>
              <div className="character-dex-card-stage">{entry.stage}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
