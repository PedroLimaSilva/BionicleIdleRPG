# Bionicle Idle RPG

A web-based idle RPG game set in the Bionicle universe, where you recruit Matoran and Toa, assign them to jobs, send them on quests, and engage in turn-based combat. Built with React, TypeScript, and Three.js for immersive 3D character rendering.

## 🎮 Features

### Character Management

- **Recruitment System**: Recruit Matoran and Toa characters using protodermis (currency)
- **Character Progression**: Characters gain XP from jobs and quests, leveling up to become more powerful
- **Character Customization**: Override mask colors and appearances
- **Custom Matoran**: Design and recruit your own Matoran; share them via import codes
- **3D Character Rendering**: View your characters in 3D using React Three Fiber

### Idle Gameplay

- **Job System**: Assign characters to element-based jobs that generate protodermis and XP over time
  - Jobs have element affinities (Fire, Water, Air, Ice, Stone, Earth, Light, Shadow)
  - Characters with matching elements perform better at jobs
  - Jobs produce protodermis automatically while you're away
- **Offline Progress**: Game continues to generate protodermis when you're not playing

### Quest System

- **Story Quests**: Send characters on quests with specific requirements
- **Quest Requirements**: May require specific characters or minimum levels
- **Quest Rewards**: Earn XP, currency, and unlock new characters
- **Quest Progress Tracking**: Monitor active quests and their completion status

### Combat System

- **Turn-Based Battles**: Engage in strategic turn-based combat
- **Mask Powers**: Each character's mask provides unique abilities
  - Mask of Shielding (Hau): Full damage immunity for 1 turn
  - Mask of Speed (Kakama): Attack twice in one round
  - Mask of Strength (Pakari): Triple damage on next attack
  - And many more!
- **Elemental Affinities**: Elements have strengths and weaknesses
- **Wave-Based Encounters**: Face multiple waves of enemies (Bohrok swarms, etc.)

### Game Persistence

- **Auto-Save**: Game state automatically saves to localStorage
- **Offline Progress**: Resume with resources generated while offline
- **State Versioning**: Game state versioning for save compatibility

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Routing**: React Router v7
- **Styling**: SCSS
- **PWA Support**: Vite PWA plugin with Workbox
- **State Management**: React Context API with custom hooks
- **Testing**: Jest 30 (unit tests), Playwright (E2E visual regression)
- **Package Manager**: Yarn

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 required; see `.nvmrc`)
- **Yarn** (v1.22.22 or higher)
  - The project uses Yarn as specified in `package.json`
  - Install Yarn if you don't have it: `npm install -g yarn`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd bionicle-idle-rpg
   ```

   (Use your actual clone directory name if it differs.)

2. **Install dependencies**

   ```bash
   yarn install
   ```

   The `prepare` hook copies vendored assets into `public/` (Draco decoder from `three`, UI fonts from `@fontsource/*`). Those files are committed so GitHub Pages and CI builds do not depend on CDN fetches; after install, `git status` should stay clean unless `three` or font packages were upgraded—in that case run `yarn vendor-draco` / `yarn vendor-fonts` and commit the updated `public/` files.

   **Dependency audit:** Run `yarn audit:prod:critical` (CI gate) or `yarn audit:prod` for high-severity production issues. One known unpatched advisory remains: `lodash.pick` via `@react-three/drei@9` (no fix available upstream; removed in drei v10).

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   - The app will be available at: `http://localhost:5173/BionicleIdleRPG/`
   - Note: The app uses a base path `/BionicleIdleRPG/` for GitHub Pages deployment

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the project for production
- `yarn preview` - Preview the production build
- `yarn lint` - Run ESLint
- `yarn test` - Run unit tests in watch mode
- `yarn test:ci` - Run unit tests in CI mode with coverage
- `yarn test:e2e` - Run E2E visual regression tests (Playwright)
- `yarn test:e2e:docker` - Run E2E tests in Docker for deterministic snapshots
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting (also enforced locally via the Husky pre-commit hook)
- `yarn check:unused-css` - Report unused CSS class selectors (dev hygiene)
- `yarn audit:prod` - Audit production dependencies for high-severity vulnerabilities (see note below)
- `yarn audit:prod:critical` - Audit production dependencies for critical vulnerabilities (used in CI)
- `yarn deploy` - Build and deploy to GitHub Pages

## 📁 Project Structure

High-level layout of `src/` (not exhaustive):

```
src/
├── components/          # UI layouts (nav, modals, lists, banners, tooltips)
├── context/             # GameProvider, Settings (see AGENT_GUIDELINES.md for layer rules)
├── data/                # Static content: dex/, quests/, cutscenes/, combat, jobs, gameState, recruitment, …
├── game/                # Pure mechanics by domain: jobs/, quests/, recruitment/, evolution/, combat/, …
├── hooks/               # Game-state React hooks; useGameLogic composes feature hooks
├── pages/               # Route-level screens (Battle, Recruitment, Settings, QuestTree, …)
├── persistence/         # IndexedDB save/load and useGamePersistence
├── rendering/
│   ├── 2d/              # Composited avatars and 2D image stacking
│   └── 3d/              # Kit catalogs, CharacterScene, battle arenas, 3D hooks, canvas
├── services/            # Bridges: combat helpers, matoranUtils, optional telemetry, …
├── types/               # Shared TypeScript types
├── utils/               # Small shared helpers (e.g. math)
├── App.tsx              # Routes and shell (includes #canvas-mount for 3D)
├── main.tsx             # Entry (error reporting, React root)
└── styles/              # Global SCSS
```

See **`AGENT_GUIDELINES.md`** for architectural rules (layer separation, state patterns). Design and combat specs live under **`docs/`**. E2E setup is described in **`e2e/README.md`** and **`PLAYWRIGHT_SETUP.md`**.

## 🎯 Game Mechanics

### Elements

Characters belong to one of eight elements:

- **Fire** (Ta-Koro)
- **Water** (Ga-Koro)
- **Air** (Le-Koro)
- **Ice** (Ko-Koro)
- **Stone** (Po-Koro)
- **Earth** (Onu-Koro)
- **Light**
- **Shadow**

### Masks

Each character wears a Kanohi mask with unique powers:

- **Hau** (Mask of Shielding)
- **Kakama** (Mask of Speed)
- **Pakari** (Mask of Strength)
- **Kaukau** (Mask of Water Breathing)
- **Akaku** (Mask of X-Ray Vision)
- And many more!

### Jobs

Jobs are element-based activities that generate protodermis and XP:

- Characters with matching elements perform better
- Jobs have different production rates
- Some jobs require quest completion to unlock
- Jobs generate protodermis (currency) over time

### Quests

Quests are story-driven activities:

- Require specific characters or minimum levels
- Have time-based durations
- Reward XP, protodermis, and character unlocks
- Unlock new content as you progress

### Combat

Turn-based combat system:

- Wave-based encounters
- Mask powers with cooldowns
- Elemental strengths and weaknesses
- Team composition matters
- Krana collection from Bohrok battles

## 🎨 3D Models

The game includes 3D models for:

- Toa Mata (Tahu, Gali, Pohatu, Onua, Kopaka, Lewa)
- Matoran characters
- Bohrok enemies
- Arena environments

Models are stored in `public/` as GLB files and rendered using React Three Fiber.

## ⚙️ Settings Page

The Settings page (`/settings`) includes:

- **About** – App description, PWA info, and core mechanics
- **Credits & Acknowledgments** – 3D model attribution, technologies, source code link, license
- **Disclaimers** – Intellectual property notice (LEGO / Bionicle)
- **Game Options**:
  - **Reset Game Data** – Clear all progress and start fresh (with confirmation)
  - **Quest Debug mode** – Shorten quest durations to 1 second (for testing)
  - **3D Performance Monitor** – Show FPS and render metrics overlay in the 3D canvas
  - **3D Scene Shadows** – Toggle shadow rendering in character and battle scenes
  - **Anonymous usage data** (optional) – Shown only when the app is built with a telemetry endpoint configured; see `docs/TELEMETRY.md`

## 💾 Game Persistence

The game automatically saves to localStorage:

- Game state is saved whenever critical changes occur
- Offline progress is calculated when you return
- Save data includes versioning for compatibility
- You can reset your game data from the Settings page

## 📲 PWA & app updates

The app is installable as a progressive web app (Vite PWA plugin + Workbox). Assets and GLBs are cached for offline play.

When a new deployment is available, `PWABadge` (`src/components/CacheManagement/PWABadge.tsx`) shows a **bottom banner** over the navigation bar:

- **Update available** — Reload applies the new service worker; Later dismisses until the next detection
- **Ready for offline play** — Shown after the service worker is first activated; Got it dismisses

The banner uses the same dark glass styling, Orbitron headings, and button classes as the rest of the UI. Playwright visual tests force banner visibility via `E2E_PWA_BANNER` in test mode — see `e2e/pwaUpdateBanner.spec.ts` and `e2e/README.md`.

## 🐛 Debug & Performance

- **Quest Debug mode** (Settings): Shortens quest durations to 1 second for testing
- **3D Performance Monitor** (Settings): Displays FPS and render metrics overlay in the 3D canvas

## 📝 Development Notes

- The app uses a base path `/BionicleIdleRPG/` for GitHub Pages deployment
- Quest graph is automatically generated from quest definitions
- 3D models are loaded asynchronously
- Game state versioning ensures save compatibility across updates

## 📚 Additional documentation

| Document                                                     | Purpose                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| [AGENT_GUIDELINES.md](AGENT_GUIDELINES.md)                   | Architecture, layers, and invariants for contributors and automation       |
| [AGENTS.md](AGENTS.md)                                       | Cursor Cloud / agent quick reference (commands and caveats)                |
| [docs/TELEMETRY.md](docs/TELEMETRY.md)                       | Optional build-time telemetry (`VITE_TELEMETRY_URL`) and privacy behaviour |
| [e2e/README.md](e2e/README.md)                               | Playwright E2E tests and snapshot workflow (incl. PWA banner overrides)    |
| [ARCHITECTURE_ROADMAP.md](ARCHITECTURE_ROADMAP.md)           | Index of technical debt and improvements (tracked via GitHub issues)       |
| [docs/UI_UX_STRATEGY.md](docs/UI_UX_STRATEGY.md)             | Portrait-first UI/UX direction (tracked via GitHub issues)                 |
| [docs/COMBAT_TEST_COVERAGE.md](docs/COMBAT_TEST_COVERAGE.md) | Combat and mask power test reference                                       |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### ⚠️ Important Disclaimer Regarding Third-Party Intellectual Property

This project is a **fan-made, non-commercial project** that uses characters, names, and concepts from the Bionicle universe, which is the intellectual property of **The LEGO Group**.

- This project is **not affiliated with, endorsed by, or sponsored by** The LEGO Group
- Bionicle, Matoran, Toa, Kanohi masks, and all related characters, names, and concepts are trademarks and/or copyrights of The LEGO Group
- This software is provided for **educational and entertainment purposes only**
- **Commercial use** of this software, particularly in relation to the Bionicle intellectual property, may require separate licensing from The LEGO Group
- Users are responsible for ensuring compliance with all applicable laws and intellectual property rights

The MIT License applies to the **code and software** in this repository. It does not grant any rights to use The LEGO Group's intellectual property. The authors of this software do not claim any rights to the Bionicle intellectual property.

## 🙏 Acknowledgments

- Built with the Bionicle universe in mind (fan project, not affiliated with The LEGO Group)
- Uses React Three Fiber for 3D graphics
- Inspired by idle RPG games
- Bionicle is a trademark of The LEGO Group

---

**Welcome to Mata Nui!** Embark on your journey to recruit Matoran and help them become legends!
