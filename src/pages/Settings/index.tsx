import { resetGameData } from '../../services/gamePersistence';
import './index.scss';

export default function SettingsPage() {
  return (
    <div className='page-container'>
      <h1 className='title'>ABOUT THIS APP</h1>
      <div className='about-section'>
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
          Core mechanics include jobs, character progression, story quests,
          elemental bonuses, and collectible loot. It will follow the original
          storyline from 2001 to 2010
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
      <h1 className='title'>Credit</h1>
      <div className='about-section'>
        <p>
          3D models provided by{' '}
          <a
            href='https://www.youtube.com/@iconicstills'
            target='_blank'
            rel='noopener noreferrer'
            className='about-link'
          >
            iconicstills
          </a>{' '}
          and available at{' '}
          <a
            href='https://biocdb.com/work'
            target='_blank'
            rel='noopener noreferrer'
            className='about-link'
          >
            Bionicle Database
          </a>
          .
        </p>
        <p>
          All other code and files available in the code repository, are my
          creation.
        </p>
      </div>
      <h1 className='title'>Disclaimers</h1>
      <div className='about-section'>
        <p>
          LEGO and BIONICLE are trademarks of the LEGO Group, which does not
          approve, authorize, or endorse this site.
        </p>
        <p>
          Please do not contact LEGO Customer Service for assistance with this
          game; they will not be able to help you.
        </p>
      </div>

      <div className='settings-section'>
        <h1 className='title' style={{ margin: 0 }}>
          SETTINGS
        </h1>
        <label className='settings-option'>
          <p>Want a fresh start? You'll lose all your progress</p>
          <button
            className='remove-button'
            onClick={() => {
              const confirm = window.confirm(
                'Are you sure you want to reset all game data? This cannot be undone.'
              );
              if (confirm) {
                resetGameData();
              }
            }}
          >
            Reset Game Data
          </button>
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
