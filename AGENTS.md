## Cursor Cloud specific instructions

This is a single-service, client-side-only React + TypeScript idle RPG. No backend, no database, no external APIs. All persistence is via browser `localStorage`.

### Key commands

See `README.md` for the full list. The most common ones:

| Task | Command |
|---|---|
| Dev server | `yarn dev` (serves at `http://localhost:5173/BionicleIdleRPG/`) |
| Lint | `yarn lint` |
| Unit tests | `yarn test:ci` |
| Build | `yarn build` |
| E2E tests | `yarn test:e2e` (requires Playwright browsers installed) |
| Format check | `yarn format:check` |

### Non-obvious caveats

- **Node version**: The project requires Node.js v20 (see `.nvmrc`). Run `nvm use` before any commands.
- **Base path**: The app is served under `/BionicleIdleRPG/` (not root `/`). Always navigate to `http://localhost:5173/BionicleIdleRPG/` when testing.
- **Yarn classic**: This project uses Yarn 1.x (classic). Do not use `yarn set version` or Yarn Berry features.
- **Architecture rules**: Read `AGENT_GUIDELINES.md` before making code changes — it documents strict layer separation, state management patterns, and domain invariants.
- **3D models**: GLB files in `public/` are loaded asynchronously via React Three Fiber. The 3D canvas uses a portal pattern (`#canvas-mount`).
- **E2E snapshots**: Playwright visual regression tests produce platform-dependent screenshots. For deterministic results, use `yarn test:e2e:docker` (requires Docker). Running `yarn test:e2e` natively will likely produce snapshot mismatches.
- **No env vars needed**: The app has zero environment variable or secret requirements.
