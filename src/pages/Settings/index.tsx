import './index.scss';

export default function SettingsPage() {
  return (
    <div className='page-container'>
      <div className='about-section'>
        <h1 className='about-title'>ABOUT THIS APP</h1>
        <p>
          This is an experimental idle RPG set in the Bionicle universe. You
          recruit Matoran, evolve them into powerful Toa, and guide them through
          elemental tasks and storyline-driven missions.
        </p>
        <p>
          The game runs as a Progressive Web App (PWA) that supports offline
          progression after the initial download. When an update is found, a
          popup will appear asking to update. At this stage of development, a
          game reset might be required.
          <br />
          <strong>In other words, YOU WILL LOSE YOUR PROGRESS</strong>
        </p>
        <p>
          Core mechanics include job productivity, hero upgrades, elemental
          bonuses, and collectible loot.
        </p>
        <p>
          This app is built with React and Vite, optimized for modern browsers
          and mobile play.
        </p>
        <p>
          Found a bug or have a suggestion? Visit the project's GitHub:
          <br />
          <a
            href='https://github.com/PedroLimaSilva/BionicleIdleRPG'
            target='_blank'
            rel='noopener noreferrer'
            className='about-link'
          >
            github.com/PedroLimaSilva/BionicleIdleRPG
          </a>
        </p>
      </div>

      <div className='settings-section'>
        <h1 className='settings-title'>SETTINGS</h1>
        <label className='settings-option'>
          <button className='remove-button'>Reset Game Data</button>
        </label>

        {/* <label className='settings-option'>
          <span>Dark Mode</span>
          <div className='toggle-placeholder' />
        </label>

        <label className='settings-option'>
          <span>Theme</span>
          <div className='dropdown-placeholder'>Default</div>
        </label> */}
      </div>
    </div>
  );
}
