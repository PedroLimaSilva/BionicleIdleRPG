import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, Plus } from 'lucide-react';
import { useGame } from '../../context/Game';
import { CHARACTER_DEX } from '../../data/dex';
import { KRAATA_POWER_NAMES } from '../../types/Kraata';

type OverflowAction = {
  label: string;
  to?: string;
  href?: string;
};

type TopNavConfig = {
  title: string;
  backTo?: string;
  primaryAction?: {
    ariaLabel: string;
    to: string;
    icon: ReactNode;
  };
  overflowActions?: OverflowAction[];
};

const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export function TopNav() {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const { buyableCharacters, rahkshi, recruitedCharacters } = useGame();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = normalizePath(location.pathname);

  useEffect(() => {
    setIsOverflowOpen(false);
  }, [pathname]);

  const config = useMemo<TopNavConfig>(() => {
    if (pathname === '/' || pathname === '/quests') {
      return {
        overflowActions: [{ label: 'Quest Tree', to: '/quest-tree' }],
        title: 'Quests',
      };
    }

    if (pathname === '/characters') {
      return {
        primaryAction:
          buyableCharacters.length > 0
            ? {
                ariaLabel: 'Recruit character',
                icon: <Plus size={22} strokeWidth={2.75} />,
                to: '/recruitment',
              }
            : undefined,
        title: 'Characters',
      };
    }

    if (pathname.startsWith('/characters/')) {
      const id = pathname.split('/')[2];
      const recruited = recruitedCharacters.find((character) => character.id === id);
      const character = recruited ? CHARACTER_DEX[recruited.id] : undefined;
      return {
        backTo: '/characters',
        title: character?.name ?? 'Character',
      };
    }

    if (pathname.startsWith('/rahkshi/')) {
      const id = pathname.split('/')[2];
      const armor = rahkshi.find((item) => item.id === id);
      const powerName = armor ? KRAATA_POWER_NAMES[armor.power] ?? armor.power : undefined;
      return {
        backTo: '/characters',
        title: powerName ? `Rahkshi of ${powerName}` : 'Rahkshi',
      };
    }

    if (pathname === '/recruitment') {
      return {
        backTo: '/characters',
        title: 'Recruitment',
      };
    }

    if (pathname === '/battle' || pathname === '/battle/selector') {
      return {
        overflowActions: [{ label: 'Type Chart', to: '/type-effectiveness' }],
        title: pathname === '/battle' ? 'Battle' : 'Encounters',
      };
    }

    if (pathname === '/quest-tree') {
      return {
        backTo: '/quests',
        title: 'Quest Tree',
      };
    }

    if (pathname === '/type-effectiveness') {
      return {
        backTo: '/battle/selector',
        title: 'Type Chart',
      };
    }

    if (pathname === '/settings') {
      return {
        overflowActions: [
          { label: 'Edit Game State', to: '/settings/game-state' },
          { label: 'Privacy Policy', to: '/privacy-policy' },
          {
            href: 'https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/new',
            label: 'Report Issue',
          },
        ],
        title: 'Settings',
      };
    }

    if (pathname === '/settings/game-state') {
      return {
        backTo: '/settings',
        title: 'Edit Game State',
      };
    }

    if (pathname === '/privacy-policy') {
      return {
        backTo: '/settings',
        title: 'Privacy Policy',
      };
    }

    return { title: 'Bionicle Idle RPG' };
  }, [buyableCharacters.length, pathname, rahkshi, recruitedCharacters]);

  const hasOverflow = !!config.overflowActions?.length;

  return (
    <header className="top-nav" aria-label="Page navigation">
      <div className="top-nav__slot top-nav__slot--left">
        {config.backTo ? (
          <button
            type="button"
            className="top-nav__button top-nav__button--icon"
            aria-label="Go back"
            onClick={() => navigate(config.backTo!)}
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        ) : config.primaryAction ? (
          <Link
            to={config.primaryAction.to}
            className="top-nav__button top-nav__button--icon"
            aria-label={config.primaryAction.ariaLabel}
          >
            {config.primaryAction.icon}
          </Link>
        ) : null}
      </div>
      <h1 className="top-nav__title">{config.title}</h1>
      <div className="top-nav__slot top-nav__slot--right">
        {hasOverflow && (
          <div className="top-nav__overflow">
            <button
              type="button"
              className="top-nav__button top-nav__button--icon"
              aria-label="Open page menu"
              aria-expanded={isOverflowOpen}
              onClick={() => setIsOverflowOpen((open) => !open)}
            >
              <Menu size={22} strokeWidth={2.5} />
            </button>
            {isOverflowOpen && (
              <div className="top-nav__menu" role="menu">
                {config.overflowActions!.map((action) =>
                  action.to ? (
                    <Link key={action.label} to={action.to} role="menuitem">
                      {action.label}
                    </Link>
                  ) : (
                    <a
                      key={action.label}
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                    >
                      {action.label}
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
