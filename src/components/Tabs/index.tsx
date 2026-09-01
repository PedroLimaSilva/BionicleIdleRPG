import './index.scss';
import { useLayoutEffect, useRef } from 'react';

export const Tabs = ({
  activeTab,
  classNames,
  onTabChange,
  tabs,
}: {
  tabs: string[];
  classNames?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const active = activeTabRef.current;
    if (!container || !active) return;

    const targetScrollLeft = active.offsetLeft - (container.clientWidth - active.offsetWidth) / 2;
    container.scrollTo({
      behavior: 'smooth',
      left: Math.max(0, targetScrollLeft),
    });
  }, [activeTab]);

  return (
    <>
      <div ref={containerRef} className={`tabs-container ${classNames ?? ''}`}>
        <div className="tabs-inner">
          {tabs.map((tab) => (
            <button
              key={tab}
              ref={activeTab === tab ? activeTabRef : undefined}
              type="button"
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
};
