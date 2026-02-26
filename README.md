# Bionicle Idle RPG

A web-based idle RPG game set in the Bionicle universe, where you recruit Matoran and Toa, assign them to jobs, send them on quests, and engage in turn-based combat. Built with React, TypeScript, and Three.js for immersive 3D character rendering.

## 🎮 Features

### Character Management

- **Recruitment System**: Recruit Matoran and Toa characters using widgets (currency) and required items
- **Character Progression**: Characters gain XP from jobs and quests, leveling up to become more powerful
- **Character Customization**: Override mask colors and appearances
- **3D Character Rendering**: View your characters in 3D using React Three Fiber

### Idle Gameplay

- **Job System**: Assign characters to element-based jobs that produce resources over time
  - Jobs have element affinities (Fire, Water, Air, Ice, Stone, Earth, Light, Shadow)
  - Characters with matching elements perform better at jobs
  - Jobs produce items and widgets automatically while you're away
- **Offline Progress**: Game continues to generate resources when you're not playing

### Quest System

- **Story Quests**: Send characters on quests with specific requirements
- **Quest Requirements**: May require specific characters, items, or minimum levels
- **Quest Rewards**: Earn XP, loot, currency, and unlock new characters
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

### Inventory & Items

- **Resource Collection**: Gather items from jobs and quests
- **Item Crafting**: Use items to recruit new characters
- **Element-Based Items**: Items are associated with different elements

### Game Persistence

- **Auto-Save**: Game state automatically saves to localStorage
- **Offline Progress**: Resume with resources generated while offline
- **State Versioning**: Game state versioning for save compatibility

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **3D Graphics**: React Three Fiber (@react-three/fiber, @react-three/drei)
- **Routing**: React Router v7
- **Styling**: SCSS
- **PWA Support**: Vite PWA plugin with Workbox
- **State Management**: React Context API with custom hooks
- **Testing**: Jest (unit tests), Playwright (E2E visual regression)
- **Package Manager**: Yarn

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Yarn** (v1.22.22 or higher)
  - The project uses Yarn as specified in `package.json`
  - Install Yarn if you don't have it: `npm install -g yarn`

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd BionicleIdleRpg
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

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
- `yarn deploy` - Build and deploy to GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── CharacterScene/ # 3D character rendering
│   ├── MatoranAvatar/  # Character avatar components
│   ├── JobList/        # Job assignment UI
│   ├── Modal/          # Modal dialogs
│   ├── Tabs/           # Tab navigation
│   └── ...
├── context/            # React Context providers
│   ├── Game.tsx        # Game state context
│   ├── Canvas.tsx      # 3D canvas context
│   └── Settings.tsx    # Settings (debug mode, shadows)
├── data/               # Game data definitions
│   ├── matoran.ts      # Character definitions
│   ├── jobs.ts         # Job definitions
│   ├── quests/         # Quest definitions
│   ├── chronicles.ts   # Character chronicle entries
│   ├── loot.ts         # Item definitions
│   └── combat.ts       # Combat data
├── game/               # Game logic
│   ├── Jobs.ts         # Job processing logic
│   ├── Levelling.ts    # XP and leveling calculations
│   ├── Quests.ts       # Quest processing logic
│   ├── BattleRewards.ts # Battle EXP and Krana rewards
│   └── Krana.ts        # Krana collection logic
├── hooks/              # Custom React hooks
│   ├── useGameLogic.tsx      # Main game logic hook
│   ├── useGamePersistence.tsx # Save/load functionality
│   ├── useBattleState.tsx    # Battle state management
│   └── ...
├── pages/              # Page components
│   ├── Battle/         # Battle page (selector, prep, in-progress)
│   ├── BattleSelector/ # Battle selection
│   ├── CharacterDetail/ # Character detail (stats, chronicle, masks, krana)
│   ├── CharacterInventory/ # Character roster/cards
│   ├── Inventory/      # Item inventory
│   ├── Recruitment/    # Character recruitment page
│   ├── Quests/         # Quest management page
│   ├── QuestTree/      # Quest dependency graph
│   ├── Settings/       # About, credits, disclaimers, game reset, debug mode, 3D shadows
│   ├── TypeEffectiveness/ # Element strengths/weaknesses
│   └── ...
├── services/           # Utility services
│   ├── gamePersistence.ts # LocalStorage management
│   ├── combatUtils.ts     # Combat calculations
│   └── ...
└── types/              # TypeScript type definitions
```

## 🎯 Game Mechanics

### Elements

Characters and items belong to one of eight elements:

- **Fire** (Ta-Koro)
- **Water** (Ga-Koro)
- **Air** (Le-Wahi)
- **Ice** (Ko-Koro)
- **Stone** (Po-Wahi)
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

Jobs are element-based activities that generate resources:

- Characters with matching elements perform better
- Jobs have different production rates
- Some jobs require quest completion to unlock
- Jobs generate widgets (currency) and items over time

### Quests

Quests are story-driven activities:

- Require specific characters, items, or minimum levels
- Have time-based durations
- Reward XP, items, currency, and character unlocks
- Unlock new content as you progress

### Combat

Turn-based combat system:

- Wave-based encounters
- Mask powers with cooldowns
- Elemental strengths and weaknesses
- Team composition matters

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
  - **Quest Debug mode** – Shorten quest durations to 1 second and show FPS/render metrics in the 3D canvas
  - **3D Scene Shadows** – Toggle shadow rendering in character and battle scenes

## 💾 Game Persistence

The game automatically saves to localStorage:

- Game state is saved whenever critical changes occur
- Offline progress is calculated when you return
- Save data includes versioning for compatibility
- You can reset your game data from the Settings page

## 🐛 Debug Mode

Enable **Quest Debug mode** (in Settings) to:

- Shorten quest durations to 1 second (for testing)
- Display performance metrics (FPS, render times) in the 3D canvas

## 📝 Development Notes

- The app uses a base path `/BionicleIdleRPG/` for GitHub Pages deployment
- Quest graph is automatically generated from quest definitions
- 3D models are loaded asynchronously
- Game state versioning ensures save compatibility across updates

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
