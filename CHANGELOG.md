# Changelog

Biweekly releases land every other Saturday. See [docs/RELEASES.md](docs/RELEASES.md).

## [0.8.2] - 2026-08-29

Merged since 0.1.0:

### Documentation

- #342 docs: move architecture and design doc tracking to GitHub issues
- #324 docs: save migration and persistence plan
- #323 docs: refresh roadmap and related documentation
- #244 Documentation review: align README and agent docs with codebase
- #184 Documentation reality check
- #98 Documentation current state

### Telemetry & Analytics

- #375 Migrate analytics from Supabase to PostHog
- #231 Add lightweight session telemetry with version tracking and gamestate snapshots

### Infrastructure, CI & Tooling

- #406 Upgrade @react-three/drei to v10.7.8
- #405 Sync vendored Draco files and audit dependency vulnerabilities
- #403 Reorganize src by concern: mechanics, rendering, persistence
- #391 Fix Cloud Agent build: add environment.json with nvm-aware install
- #373 Self-host fonts and Draco decoder to avoid slow CDN requests
- #371 Fix false kit node usage increases in PR reports
- #364 chore: bump client version to 0.1.0
- #361 Add Prettier format check to CI
- #318 Fix eslint object sort order in Kopaka Nuva kit attachments
- #303 Compare Glb sizes
- #295 ci: upgrade GitHub Actions to Node 24 runtimes
- #289 Fix outdated environment setup (Node, CI, Docker Compose)
- #280 Enforce alphabetical object key order with ESLint perfectionist
- #228 fix: resolve react-hooks/exhaustive-deps lint warnings
- #197 Code lint errors
- #134 Lint warnings resolution
- #120 Development environment setup
- #61 Unused CSS class detection
- #56 Housekeeping
- #55 Docker test timeout

### Testing

- #411 Update Toa model snapshots after kit GLB changes
- #402 Update Toa Whenua Earthshock drill mesh and VR snapshot
- #385 Metru Matoran idle animation snapshot updates
- #369 Use neutral model preview page for E2E canvas tests
- #368 Metru Matoran 3D pipeline, faster model E2E, and split CI jobs
- #330 Document PWA update banner redesign and E2E coverage
- #326 fix: restore missing Tahu Nuva sequestered mask E2E snapshot
- #317 Regenerate Toa model rendering E2E snapshots for Kopaka Nuva kit
- #253 test: disable shadows in TEST_MODE (like selective bloom)
- #137 Motion test flakiness
- #107 Responsiveness test structure
- #25 Playwright tests

### Persistence & Save

- #362 feat: Phase B IndexedDB persistence with Dexie (#331)
- #357 feat: Phase A save persistence hardening (#333)
- #213 Add game state editor page
- #93 Characters tab persistence

### PWA & Notifications

- #329 Redesign PWA update notification as bottom banner
- #312 Disable pinch zoom in PWA via viewport meta
- #298 Redeem custom character share links inside the PWA
- #257 fix(pwa): anti-alias PWA icons (Sharp Lanczos3 supersampling)
- #256 fix(pwa): inner padding for generated app icons
- #255 fix(pwa): transparent pwa-192/512 and apple-touch (GymOverload-style pipeline)
- #254 fix(pwa): silver transparent favicon and manifest icons
- #161 Service worker reload failure
- #152 fix: handle SKIP_WAITING message in custom service worker
- #151 feat: move notification scheduling into the service worker with Index…
- #148 Service worker quest notifications
- #42 Pwa icon theming liquid glass

### Custom Characters & Sharing

- #383 Offer every Kanohi at character creation and drop the Great-mask fallback
- #316 Fix custom Toa mask double-render and story-only mask rules
- #311 Fix redeem button styles
- #299 Fix redeem placement and share dedupe by character identity
- #297 Add Debug character creation flag for creation stage picker
- #293 Custom Toa Mata model selection and kit palette
- #292 Stage-specific custom character colors and evolution prefill
- #291 Post-evolution custom characters use character creation flow
- #288 Add custom character creation, sharing, and evolution

### Quests & Story

- #420 Shorten Great Disk quests and add Kini-Nui interlude
- #419 Add Great Disks interlude checkpoint quest
- #417 Complete Toa Metru Great Disk hunt quests (Matau & Onewa)
- #416 Add Toa Metru Great Disk hunt quests (4 of 6)
- #415 Remove "Settling Back Into Metru Nui" quest
- #414 Add Kapura Morbuzakh quest and Metru Nui recruitment unlock
- #408 Add Search for the Great Disks setup quest and cutscene
- #387 Add Vakama–Dume intermediate quest before Great Temple transformation
- #388 Add Great Temple cutscene for final Metru Nui quest
- #372 Begin Metru Nui saga with Lihkan story and recruitment unlocks
- #300 Fix inconsistent blank line in generated quest-graph.md
- #274 Fix typos in quest descriptions and visual novel cutscenes
- #270 Balance MNOG recruitment costs with default protodermis cap
- #258 Start completed quest sections collapsed
- #262 Gate Bohrok swarm battles on Krana legend quest
- #236 Separate quest debug mode from 3D performance monitor
- #223 Finish Mask of Light
- #214 Infer buyable characters
- #209 Rahkshi ta-koro correction
- #206 Post-quest Bohrok Kal encounters
- #195 Review MOL up to Ko-Koro
- #190 Review Bohrok Kal Quest Line
- #182 Locked chronicles font
- #185 Matoran chronicles update
- #179 Review cutscenes up to hunt for the krana
- #178 Huki statue suggestion
- #172 Change lewa possession quest order
- #160 Completed quests recent order
- #155 Novel file splitting
- #146 Metru nui story quests
- #149 Le-koro fixes
- #143 Cutscene background step
- #144 Interactive quest cutscenes
- #139 Visual novel display motion
- #138 Typewriter dialogue effect
- #136 Visual novel continued
- #135 Refined visual novel dialogue visuals
- #133 Fix Kivi's chronicle
- #128 Hahli name correction
- #119 Visual novel cutscene system
- #118 Naming Day
- #115 Remove mask color override; Derive color by Dex or Quest State
- #112 Toa chronicles quest additions
- #97 Bohrok kal quest line
- #94 Bohrok recruitment quest
- #88 Matoran dex chronicles
- #84 Bohrok arc quests
- #64 Bugfix: double quest assignment
- #58 Completed quest UI sections
- #51 Krana quests: Battle rewards, and Krana collection UI
- #50 Chronicles - Character wall of history

### Combat & Encounters

- #422 Add auto-activate timer with shrinking fill on battle buttons
- #418 Add Vahki avatar renders and fix Fire/Earth visor colors
- #413 Transmissive brains and Vahki hood via runtime transmission + IOR
- #409 Add Vahki opponent (six hives, kit-assembled chassis)
- #365 Desert arena blockout layout for Blender reference
- #367 Battle arenas: desert monuments + Mangaia/Metru caverns, per-encounter selection & tribe recolor
- #356 Implement Matatu mask power (immobilize / skip enemy turn)
- #328 Update docs for Ruru + skip CI on docs-only changes
- #327 Implement Ruru (Mask of Night Vision) combat power
- #325 feat: pause job ticks during battle
- #315 Bohrok krana: use base color only, remove emissive glow
- #277 Delay battle rewards panel until defeat animations and camera finish
- #276 Battle: hold Defeat clip final frame during sink/dispose
- #275 Battle: sink and fade defeated models, dispose GPU resources
- #273 feat(battle): procedural default combat motion for missing GLB clips
- #272 fix(battle): unblock combat when Attack animation is missing
- #271 Rahi encounters
- #268 Implement battle camera emphasis feature for attack animations
- #266 Hide Battle nav when no encounters; preserve nav bar width
- #267 Battle outcome: animate Toa EXP growth and level-up
- #265 feat: finish Phase 0 - battle outcome review & mask activation effects
- #264 Wave fade
- #263 Crit shake
- #250 feat(battle): visual HP bars on combat cards
- #248 fix(battle): Rahkshi attacker showing Hit (stale refs + same-mixer Hit)
- #249 Kraata Gauntlet: three Rahkshi per wave
- #245 Kraata: remove detail page, forge confirmation on stage 1
- #243 Kraata list/detail: indicator when Rahkshi armor of that power exists
- #247 Rahkshi balancing: solo level bonus + post–MoL Kraata Gauntlet
- #242 Feat/weathered metal rahkshi
- #234 Fix battle rewards positioning
- #230 Rahkshi review
- #229 Rahkshi detail transition
- #227 Tahu combat animations
- #226 Arena Review
- #225 fix(rahkshi): eye glow when installing Kraata into empty armor
- #222 Toggle Rahkshi eye glow based on kraata insertion state
- #221 Rahkshi animations and bloom
- #219 Kraata merge all button
- #218 Rahkshi armor joint colors
- #216 Kraata detail options
- #217 Fix character order + rahkshi animations
- #210 Rahkshi kraata display
- #211 Kraata inventory tracking
- #203 Rahkshi encounters and kraata
- #200 Keep battle nav item visible
- #198 Battle link test updates
- #196 Krana inventory placement
- #191 Toa nuva, bohrok kal combat
- #189 Rahkshi idle
- #180 Element effectiveness balance
- #181 Finish Bohrok swarms review
- #177 Battle prep ally limit
- #176 Mask power target deactivation
- #175 Remove selective bloom from Arena to fix browser crash during battle
- #174 Battle layout improvements
- #171 Mask power glow
- #157 fix krana tags
- #131 Bohrok kal battle nav
- #83 Mask powers multi-target
- #100 Battle prep alignments
- #96 Add Attack animations to Lewa and Onua
- #95 Battle layout fixes
- #92 Combatant animation facing
- #91 Krana loot route visibility
- #87 Mask power tooltip
- #90 Attack animation timing
- #85 Type effectiveness page
- #86 Arena enemy labels
- #81 Battle waves and rewards
- #80 Add battle arena to rewards collection
- #79 Auto Battle round progression
- #76 Enhance combat animations and arena functionality. Added 'Defeat' ani…
- #59 More mask powers and more testing
- #63 Combat utils undefined self
- #60 Encounter card krana display
- #53 More bohrok encounters

### Jobs, Economy & Progression

- #296 Preview level after protodermis training conversion
- #290 Fix recruitment link hidden when no story recruits remain
- #269 fix(recruitment): prevent preview reset on job tick
- #246 feat: Convert protodermis to Toa XP on character detail
- #215 Matoran job lore validation
- #187 Lower evolution requirement
- #156 Better recruitment, no hover shennanigans
- #145 Reward calculation stability
- #132 Add hover to recruitment drawer
- #130 Remove current level from evolution requirement
- #127 Character upgrade button
- #126 Widgets to protodermis; Increase currency cap
- #125 Recruitment test canvas hiding
- #121 Activity log homepage
- #75 Job rewards diminishing returns
- #67 Recruitment screen redesign proposal
- #30 Create widget cap and currency bar
- #28 Fix job assign button

### UI & UX

- #390 Filter character-creation masks by rig stage
- #319 Fix character list/detail scroll position
- #261 Replace recruitment alert() with animated celebration modal
- #260 UI/UX Strategy: Hybrid Diorama approach for immersive portrait-first idle RPG
- #251 Use Lucide Arrows instead of unicode
- #233 Change Report button order
- #232 Add Report Issue button in settings
- #224 Fix Rahshi name text alignment
- #212 Remove inventory
- #207 Avohkii inventory color
- #186 Inventory system rebalance
- #183 Motion route transitions
- #188 Inventory border animation direction
- #150 Remove hover button translate
- #129 Motion.dev UI animations
- #109 Tahu vahi mask inventory
- #104 Character inventory grid
- #89 Popover positioning logic
- #82 Rewards display issues
- #68 Address Inventory flakyness
- #62 Rewards collection UI layout
- #47 Filter characters by stage
- #37 Better Character detail layout, more room for growth
- #34 Use absolute position, allows smoother scrolling
- #33 Anchor layouts
- #32 Anchor layouts
- #31 Horizontal Layout
- #29 Fix positioning, compensate with zIndex
- #27 Change Nav bar Order
- #26 Add color fallback to background color

### Rendering & Materials

- #412 Add a character dex 3D preview for every model
- #404 Reduce Vakama disk launcher glow intensity
- #396 Apply Metru mask crown discoloration to 2D avatars
- #395 Restore metallic gold mask PBR after Masks.glb re-bake
- #379 Give metallic LEGO colors metal PBR on every kit slot
- #377 Store kit material slots on each dex body part
- #378 Wire Toa Lhikan (Metru rig, Great Kanohi) and ground character framing
- #313 Fix Kopaka Mata sword palette weaponGlow mapping
- #310 Fix Bohrok feet kit palette typing for production build
- #308 fix(kit): Toa Mata Face material uses palette face color
- #306 Kit metal palette: per-slot weathered PBR (metalness, roughness, grime tuning)
- #301 Serve city environment HDRI locally (avoid raw.githack.com)
- #281 Gali Mata kit: dedupe material declarations with shared palette
- #278 Gali Mata: 2001 kit GLB pipeline and material tooling
- #279 Rename useEyeMeshes to useCharacterBloomMeshes
- #240 Feat/weathered metal toa nuva
- #239 feat: apply WeatheredMetalMaterial to Toa Mata models
- #252 Apply weathered metal to bohrok
- #241 Feat/weathered metal takanuva
- #238 Apply WeatheredMetalMaterial to Rebuilt Matoran model
- #237 Lego PBR shader material with object-space triplanar mapping
- #202 Evolution shield rendering
- #199 Bloom effect layer warning
- #164 No scene canvas content
- #108 Bohrok material instance sharing
- #105 Selective bloom test removal
- #74 Scene shadows setup
- #77 Face mask shadows
- #78 Face mask shadows
- #65 Better matoran rendering; Move design files
- #48 Matoran eyes brain color
- #46 Eye Glow
- #45 Plastic with PBR Materials
- #44 New shader material
- #43 Matoran color material reference
- #40 Better lighting, Custom shader for matoran
- #39 Use a bounding box to improve matoran framing
- #38 Framing with orbital controls

### Characters & Models

- #421 Great Rau baked transparency, Nokama shoulder gears, avatar update
- #386 Assign Metru Matoran canonical pre-Toa profession jobs
- #407 Use DarkBluishGray for Metru and Toa Metru model colors
- #401 Add Toa Onewa Metru model
- #399 Add Toa Nokama Metru model
- #398 Add Toa Vakama Metru model
- #400 Add Toa Whenua Metru model
- #397 Add Metru Toa weapon kit parts to kit_2004.glb
- #393 Remove Nuju ScopeLight rig exception; optimize Masks.glb
- #392 Add Metru Matoran to Toa Metru evolution
- #389 Wire up Toa Nuju 3D model with kit attachments
- #384 Lhikan idle animation
- #382 Use the Metru head and Great Kanohi in Toa Metru 2D avatars (#380)
- #381 Compress Lhikan.glb and cover its idle clip in the animation pipeline
- #380 Use the Metru head and Great Kanohi in Toa Metru 2D avatars
- #376 Wire Toa Lhikan to the Metru rig, 2004 kit, and Great Kanohi
- #374 Metru Matoran rig, kit usage, and color updates
- #370 Attach Metru Matoran torso from 2004 kit
- #363 Mask positions review
- #359 Strongly type kit node names in attachments
- #360 Rebuild Takanuva with kit attachments and Mata-style Avohkii mask.
- #358 Update Lewa and Pohatu Nuva
- #322 Onua Nuva Kit
- #320 Update Nuva Metal and Tahu kit
- #314 Gali Nuva Upgraded to use Kit
- #304 Matoran Diminished/Rebuilt composited face uses McFace.webp
- #309 Update Bohrok Model
- #305 Add kit_2003 dual-load support for rebuilt Matoran
- #302 Matoran using new Face
- #294 Wire Kopaka Mata
- #287 Lewa mata kit
- #285 Refactor Pohatu Mata to shared 2001 kit without GLB edits
- #282 Tahu Mata: attach 2001 shared kit meshes
- #220 Avatar updates
- #208 Infected hau mask display
- #205 Takanuva - Fixes and test
- #204 Avohkii mechanics
- #201 Bohrok reconstruction jobs
- #193 HauNuvaInfected mask details
- #194 Infected mask override
- #173 New gali animations
- #165 Add takanuva screenshot
- #167 Fix Kopaka clipping
- #166 Matoran Idle
- #163 Takanuva with Idle animation
- #162 Onua and updated scales
- #158 Mask transition logic abstraction
- #159 Correct nuva masks collection and vahi color
- #154 Pohatu and Kopaka
- #153 Add 2003 models
- #141 Gali idle
- #147 Use correct color in vakama's eyes
- #142 Lewa Nuva Idle (hate it)
- #140 Refactor Matoran Dex
- #123 Rebuilt matoran model file
- #122 Bohrok tasks tab
- #117 Update bohrok models
- #103 Bohrok jobs, evolution
- #114 Glb compression dracoLoader
- #116 Use headliner name to render image
- #111 Toa Nuva mask color
- #110 Nuva masks missing copy
- #106 Tahu nuva idle
- #102 Bigger detail model
- #101 More mask previews
- #99 Glb animation playback issue
- #73 Mask transition animation
- #70 Reviewing toa models
- #69 Reduce mask texture size
- #57 Character evolution event
- #54 Use Ready Models (Tahu and Gali)
- #52 Character evolution data
- #41 Character bounds fit cylinder
