import { Link } from 'react-router-dom';
import '../Settings/index.scss';

export default function PrivacyPolicyPage() {
  return (
    <div className="page-container">
      <h1 className="title">Privacy Policy</h1>
      <div className="about-section">
        <p>
          <strong>Last updated:</strong> August 2026
        </p>
        <p>
          Bionicle Idle RPG is a fan-made, non-commercial project. Your privacy is important to us.
          This page explains what data the app stores on your device, what is sent when you opt in
          to anonymous usage data, how we use it, and how you can control it.
        </p>
      </div>

      <h1 className="title">Data stored on your device</h1>
      <div className="about-section">
        <p>
          The game is a client-side Progressive Web App. Your save data and preferences stay in your
          browser unless you explicitly opt in to telemetry (described below). We do not operate a
          game server or account system.
        </p>
        <p>
          <strong>Game progress</strong> is stored in your browser's <strong>IndexedDB</strong>{' '}
          database (<code>BionicleIdleRPG</code>), including:
        </p>
        <ul>
          <li>Protodermis balance and cap</li>
          <li>Recruited characters (IDs, experience, job assignments, mask overrides)</li>
          <li>
            Custom characters you create (names, colors, mask, element, stage, and model choices)
          </li>
          <li>Active and completed quests</li>
          <li>Collected Krana, Kraata collection, and Rahkshi armor</li>
        </ul>
        <p>
          <strong>Settings and preferences</strong> are stored in <strong>localStorage</strong>,
          including graphics options (shadows, performance monitor), debug toggles, quest
          notification preference, and your telemetry consent choice.
        </p>
        <p>
          <strong>Custom character share links</strong> encode character data in the URL query
          string (base64 JSON). Opening or sharing a link does not contact our servers — the data
          stays in the URL until someone opens it in their own browser.
        </p>
        <p>
          <strong>Quest notifications</strong> (if enabled) schedule reminders locally in the
          service worker or browser; no notification data is sent to us.
        </p>
        <p>
          None of the above is transmitted off your device unless you opt in to anonymous usage
          data.
        </p>
      </div>

      <h1 className="title">What we collect when you opt in</h1>
      <div className="about-section">
        <p>
          When you opt in to anonymous usage data, the app sends telemetry to PostHog throughout
          your session, including:
        </p>
        <ul>
          <li>
            <strong>Client ID</strong> — a random identifier generated when you opt in, stored in
            your browser's localStorage under <code>TELEMETRY_ID</code>. It is passed to PostHog via{' '}
            <code>identify()</code> and included in every event to correlate reports from the same
            browser over time. It is not linked to any account, name, or personal information.
            Clearing your browser data or resetting the game removes it permanently.
          </li>
          <li>
            <strong>App version</strong> — the version number and build identifier (e.g.{' '}
            <code>0.1.0+a1b2c3d</code>)
          </li>
          <li>
            <strong>Game state version</strong> — the internal schema version of your save data
          </li>
          <li>
            <strong>Timestamp</strong> — when each event was sent (ISO 8601)
          </li>
          <li>
            <strong>Game progress snapshot</strong> (once per session) — the same fields persisted
            locally:
            <ul>
              <li>Protodermis balance and cap</li>
              <li>
                Recruited characters (IDs, experience, job assignments, mask overrides, stage)
              </li>
              <li>
                Custom characters (IDs, <strong>names you chose</strong>, colors, mask, element,
                stage, and model choices)
              </li>
              <li>Active and completed quests</li>
              <li>Collected Krana, Kraata collection, and Rahkshi armor</li>
            </ul>
          </li>
          <li>
            <strong>Page views</strong> — when you navigate between in-app screens (e.g. battle,
            inventory, settings), sent as <code>$pageview</code> events with the in-app path
          </li>
          <li>
            <strong>Browser interaction events</strong> — PostHog automatically captures clicks,
            form changes, and similar DOM interactions as <code>$autocapture</code> events. These
            may include element tags, CSS selectors, and visible button or link text (but not text
            you type into inputs unless you submit a form)
          </li>
        </ul>
        <p>
          <strong>Error reports:</strong> if the app encounters an uncaught error while telemetry is
          enabled, a report is sent immediately (even if the app crashes) containing the error
          message and stack trace, alongside the same game progress fields listed above. Error
          reports are not limited to once per session — each error is reported individually to help
          diagnose issues. No form input or typed text is included unless it happens to be stored in
          your save data (for example, a custom character name).
        </p>
        <p>
          <strong>PostHog SDK metadata:</strong> when events are sent, PostHog automatically
          attaches standard technical properties such as browser type, operating system, device
          type, screen dimensions, referrer (if any), and a session identifier. PostHog may also
          receive your IP address as part of standard HTTP requests; see{' '}
          <a
            href="https://posthog.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            PostHog's privacy policy
          </a>{' '}
          for how they handle this. Session replay and heatmaps are <strong>not enabled</strong> in
          our configuration.
        </p>
        <p>
          We do <strong>not</strong> intentionally collect:
        </p>
        <ul>
          <li>Email addresses, real names, or other contact information</li>
          <li>Payment or financial data (the game has no purchases)</li>
          <li>Browsing history or activity outside this app (only in-app navigation is tracked)</li>
          <li>Location data beyond what your IP address may imply</li>
        </ul>
        <p>
          Custom character names are <strong>game content you create</strong>, not account
          credentials. Please avoid using your real name or other personally identifying information
          when naming characters — those names would be included in an opt-in telemetry snapshot.
        </p>
      </div>

      <h1 className="title">How we use it</h1>
      <div className="about-section">
        <p>The data is used exclusively to:</p>
        <ul>
          <li>Understand which app versions are in use so we can prioritize updates</li>
          <li>See how players progress through the game to improve balance and content</li>
          <li>Identify common issues or stuck points in quest progression</li>
          <li>Understand which screens and features players use to improve navigation and UX</li>
          <li>See how players interact with buttons and UI elements during a session</li>
          <li>Track progression over time for the same anonymous browser</li>
          <li>Diagnose and fix crashes and errors using the error reports</li>
        </ul>
        <p>
          We do not sell, share, or monetize this data in any way. It is only used to improve the
          game.
        </p>
      </div>

      <h1 className="title">How it works</h1>
      <div className="about-section">
        <p>
          Reports are sent to <strong>PostHog</strong>, our analytics and error monitoring provider.
          PostHog stores event data on their servers (US or EU, depending on project configuration).
          No other third-party services receive telemetry data.
        </p>
        <p>
          PostHog is initialized with opt-out-by-default behaviour: nothing is sent until you choose
          "Allow" on the consent prompt or enable the toggle in Settings. When opted in, PostHog
          also stores a small amount of session data in your browser's localStorage to manage its
          SDK state.
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
            Clearing your browser's site data removes the client ID, save data, and all stored
            preferences. A new random client ID is generated only if you opt in again.
          </li>
          <li>
            Using "Reset Game Data" in Settings clears your save and reloads the app; it also
            removes telemetry identifiers stored locally.
          </li>
        </ul>
      </div>

      <h1 className="title">Data retention</h1>
      <div className="about-section">
        <p>
          Telemetry data retained by PostHog is kept for historical analysis of game progression
          trends. No intentionally collected personally identifiable information is included — the
          client ID is a random value that cannot be traced back to any individual. Local save data
          remains on your device until you clear it or reset the game.
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
