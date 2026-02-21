import { resetGameData } from '../../services/gamePersistence';
import { useSettings } from '../../context/Settings';
import './index.scss';

export default function SettingsPage() {
  const { debugMode, setDebugMode, shadowsEnabled, setShadowsEnabled } = useSettings();

  return (
    <div className="page-container">
      <h1 className="title">ABOUT THIS APP</h1>
      <div className="about-section">
        <p>
          This is an experimental idle RPG set in the Bionicle universe. You recruit Matoran, evolve
          them into powerful Toa, and guide them through elemental tasks and storyline-driven
          missions.
        </p>
        <p>
          The game runs as a Progressive Web App (PWA) that supports offline progression after the
          initial download. When an update is found, a popup will appear asking to update. At this
          stage of development, a game reset might be required.
          <br />
          <strong>In other words, YOU WILL LOSE YOUR PROGRESS</strong>
        </p>
        <p>
          Core mechanics include jobs, character progression, story quests, turn-based combat with
          mask powers and elemental affinities, Krana collection, character chronicles, and
          collectible loot. It will follow the original storyline from 2001 to 2010.
        </p>
        <p>
          This app is built with React, TypeScript, Vite, and React Three Fiber for 3D visuals. It
          is optimized for modern browsers and mobile play. See the Credits section below for more
          information about the project and how to contribute.
        </p>
      </div>
      <h1 className="title">Credits & Acknowledgments</h1>
      <div className="about-section">
        <p>
          <strong>3D Models</strong>
        </p>
        <p>
          3D models provided by{' '}
          <a
            href="https://www.youtube.com/@iconicstills"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            iconicstills
          </a>{' '}
          and available at{' '}
          <a
            href="https://biocdb.com/work"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            Bionicle Database
          </a>
          .
        </p>
        <p>
          <strong>Technologies</strong>
        </p>
        <p>
          Built with{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            React
          </a>
          ,{' '}
          <a
            href="https://www.typescriptlang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            TypeScript
          </a>
          ,{' '}
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            Vite
          </a>
          , and{' '}
          <a
            href="https://docs.pmnd.rs/react-three-fiber"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            React Three Fiber
          </a>
          .
        </p>
        <p>
          <strong>Source Code</strong>
        </p>
        <p>
          This project is open source and available on GitHub. All code and files (except the 3D
          models) are created by the project contributors.
        </p>
        <p>
          View the source code, report issues, or contribute:{' '}
          <a
            href="https://github.com/PedroLimaSilva/BionicleIdleRPG"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            github.com/PedroLimaSilva/BionicleIdleRPG
          </a>
        </p>
        <p>
          <strong>License</strong>
        </p>
        <p>
          This project is licensed under the{' '}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            MIT License
          </a>
          . See the LICENSE file in the repository for details.
        </p>
        <p>
          <strong>Inspiration</strong>
        </p>
        <p>
          Inspired by idle RPG games and built as a fan project celebrating the Bionicle universe.
          This is a non-commercial, educational project.
        </p>
      </div>
      <h1 className="title">Disclaimers</h1>
      <div className="about-section">
        <p>
          <strong>⚠️ Intellectual Property Notice</strong>
        </p>
        <p>
          This project is a <strong>fan-made, non-commercial project</strong> that uses characters,
          names, and concepts from the Bionicle universe, which is the intellectual property of{' '}
          <strong>The LEGO Group</strong>.
        </p>
        <p>
          <strong>
            This project is not affiliated with, endorsed by, or sponsored by The LEGO Group.
          </strong>
        </p>
        <p>
          LEGO, BIONICLE, Matoran, Toa, Kanohi masks, and all related characters, names, and
          concepts are trademarks and/or copyrights of The LEGO Group, which does not approve,
          authorize, or endorse this site.
        </p>
        <p>
          This software is provided for <strong>educational and entertainment purposes only</strong>
          . Commercial use of this software, particularly in relation to the Bionicle intellectual
          property, may require separate licensing from The LEGO Group. Users are responsible for
          ensuring compliance with all applicable laws and intellectual property rights.
        </p>
        <p>
          The authors of this software do not claim any rights to the Bionicle intellectual property
          and make no representations or warranties regarding the legal status of using this
          software in connection with Bionicle-related content.
        </p>
        <p>
          <strong>Please do not contact LEGO Customer Service</strong> for assistance with this
          game; they will not be able to help you.
        </p>
        <p>
          The MIT License applies to the code and software in this repository. It does not grant any
          rights to use The LEGO Group's intellectual property.
        </p>
      </div>

      <div className="settings-section">
        <h1 className="title" style={{ margin: 0 }}>
          SETTINGS
        </h1>
        <label className="settings-option">
          <p>Want a fresh start? You'll lose all your progress</p>
          <button
            className="remove-button"
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
        <label className="settings-option">
          <span>Quest Debug mode</span>
          <div
            className={`toggle-placeholder ${debugMode ? 'on' : ''}`}
            onClick={() => setDebugMode(!debugMode)}
          />
        </label>
        <label className="settings-option">
          <span>3D Scene Shadows</span>
          <div
            className={`toggle-placeholder ${shadowsEnabled ? 'on' : ''}`}
            onClick={() => setShadowsEnabled(!shadowsEnabled)}
          />
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
