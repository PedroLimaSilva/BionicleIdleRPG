import { Link } from 'react-router-dom';
import '../Settings/index.scss';

export default function PrivacyPolicyPage() {
  return (
    <div className="page-container">
      <h1 className="title">Privacy Policy</h1>
      <div className="about-section">
        <p>
          <strong>Last updated:</strong> {new Date().getFullYear()}
        </p>
        <p>
          Bionicle Idle RPG is a fan-made, non-commercial project. Your privacy is important to us.
          This page explains what data we collect, how we use it, and how you can control it.
        </p>
      </div>

      <h1 className="title">What we collect</h1>
      <div className="about-section">
        <p>
          When you opt in to anonymous usage data, the app sends a <strong>single report</strong>{' '}
          per browser session containing:
        </p>
        <ul>
          <li>
            <strong>Client ID</strong> — a random identifier generated when you opt in, stored only
            in your browser's localStorage. It is used to correlate reports from the same browser
            over time. It is not linked to any account, name, or personal information. Clearing your
            browser data or resetting the game removes it permanently.
          </li>
          <li>
            <strong>App version</strong> — the version number and build identifier (e.g.{' '}
            <code>0.1.0+a1b2c3d</code>)
          </li>
          <li>
            <strong>Game state version</strong> — the internal schema version of your save data
          </li>
          <li>
            <strong>Timestamp</strong> — when the report was sent
          </li>
          <li>
            <strong>Game progress snapshot</strong> — your current protodermis balance, recruited
            characters (IDs, experience, job assignments), active and completed quests, collected
            Krana, Kraata collection, and Rahkshi armor
          </li>
        </ul>
        <p>
          We do <strong>not</strong> collect:
        </p>
        <ul>
          <li>Names, email addresses, or any personally identifiable information</li>
          <li>IP addresses (not stored by our telemetry endpoint)</li>
          <li>Browser fingerprints or cookies</li>
          <li>Browsing history or activity outside this app</li>
        </ul>
        <p>
          The client ID is a random value (UUID) that cannot be used to identify you as a person. It
          exists solely to distinguish one anonymous browser from another for statistical purposes.
        </p>
      </div>

      <h1 className="title">How we use it</h1>
      <div className="about-section">
        <p>The data is used exclusively to:</p>
        <ul>
          <li>Understand which app versions are in use so we can prioritize updates</li>
          <li>See how players progress through the game to improve balance and content</li>
          <li>Identify common issues or stuck points in quest progression</li>
          <li>Track progression over time for the same anonymous browser</li>
        </ul>
        <p>
          We do not sell, share, or monetize this data in any way. It is only used to improve the
          game.
        </p>
      </div>

      <h1 className="title">How it works</h1>
      <div className="about-section">
        <p>
          The report is sent using your browser's <code>sendBeacon</code> API (or a standard{' '}
          <code>fetch</code> request as a fallback). It is a single fire-and-forget POST request —
          no tracking pixels, no cookies, no third-party scripts.
        </p>
        <p>
          The data is sent to a server-side endpoint that stores it in a database. No other services
          or third parties receive the data.
        </p>
      </div>

      <h1 className="title">Your choices</h1>
      <div className="about-section">
        <p>Telemetry is entirely opt-in:</p>
        <ul>
          <li>
            On your first visit, you are asked whether to allow anonymous usage data. If you
            decline, no client ID is generated and nothing is ever sent.
          </li>
          <li>
            You can change your choice at any time from the{' '}
            <Link to="/settings" className="about-link">
              Settings
            </Link>{' '}
            page using the "Send anonymous usage data" toggle.
          </li>
          <li>
            If telemetry is not configured for the build you are using, the option does not appear
            at all and no data is collected.
          </li>
          <li>
            Clearing your browser's site data removes the client ID and all stored preferences. A
            new random ID is generated only if you opt in again.
          </li>
        </ul>
      </div>

      <h1 className="title">Data retention</h1>
      <div className="about-section">
        <p>
          Collected data is retained indefinitely for historical analysis of game progression
          trends. No personally identifiable information is collected — the client ID is a random
          value that cannot be traced back to any individual.
        </p>
      </div>

      <h1 className="title">Contact</h1>
      <div className="about-section">
        <p>
          If you have questions about this policy, please open an issue on the{' '}
          <a
            href="https://github.com/PedroLimaSilva/BionicleIdleRPG"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
