import './index.scss';

export const Tabs = ({
  tabs,
  classNames,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  classNames: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  return (
    <div className={`tabs-container ${classNames}`}>
      <div className='tabs-inner'>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className='divider'></div>
    </div>
  );
};
