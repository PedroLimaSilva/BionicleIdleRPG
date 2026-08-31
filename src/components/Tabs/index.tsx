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
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeTab, tabs]);

  return (
    <>
      <div className={`tabs-container ${classNames ?? ''}`}>
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
