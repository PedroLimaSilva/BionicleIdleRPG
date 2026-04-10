# Design: Immersive UI Directions

## Summary

This document captures two possible future directions for making the game feel more immersive across
the whole UI, not just in battle:

1. **Immersive hybrid world UI**: keep DOM-based navigation, sheets, and controls, but use the
   shared Three.js canvas to show characters visibly engaged in jobs, travel, quests, and other
   world activity.
2. **Full 3D-first world presentation**: push much more of the game shell into Three.js so the
   world scene becomes the primary interface and the DOM HUD becomes secondary.

This document is a reference for future design work, not a commitment to implementation.

---

## Problem statement

The game already has strong lore, strong character identity, and a working 3D rendering foundation.
What it lacks is a sense that the world is alive while the player manages it.

Current pain points:

- battle is only one part of the immersion gap
- character inventory mostly feels like a grid of collectible cards with status labels
- character task management is functional, but it does not show what characters are actually doing
- quests have narrative text, timers, requirements, and rewards, but they feel more like dispatch
  forms than lived events
- the app has good 3D moments on detail pages, but most progression screens still read like list UI
- there is little visual continuity between a character, their assignment, and the place where that
  assignment happens

---

## Clarified design goal

The most important immersive upgrade is not "make battles more cinematic."

It is:

- let players see characters inhabiting the world
- show jobs as places and activities, not only labels
- show quests as destinations, journeys, or missions in progress
- make inventory, assignment, and quest management feel like world stewardship instead of menu work

In short, the app should move toward a **living world UI**.

---

## Project constraints

Any future direction should respect these constraints:

- **Web app first**: this is a browser game, not a native mobile app
- **Portrait-first usage**: most sessions are expected to be narrow and vertical
- **Single shared canvas**: the existing canvas portal pattern is valuable and should be preserved
- **Performance-sensitive**: low-end mobile devices and laptop browsers must remain viable
- **Incremental scope preferred**: UI improvements should not require rewriting game systems
- **3D asset cost matters**: new environments, animations, and effects carry real production cost
- **Readable controls still matter**: buttons, timers, requirements, and rewards must remain clear

---

## Current-state interpretation

### Where the app already feels immersive

- character detail pages already use the shared 3D canvas well for hero presentation
- recruitment and Rahkshi detail already benefit from scene-backed presentation
- quest writing and cutscenes already provide narrative flavor
- battle already proves the app can combine DOM UI with scene-backed presentation

### Where the app still feels menu-driven

- character inventory is primarily a responsive card grid
- task state is mostly expressed as text labels or badges
- quests are largely represented as stacked cards with metadata
- world presence is implied, not shown

---

## Shared design goals

Regardless of approach, the UI should aim for:

1. **Visible world state**
   - the player should be able to tell where characters are and what they are doing
2. **Stronger continuity**
   - characters, assignments, quests, and locations should feel connected
3. **Portrait-friendly interaction**
   - large touch targets, low thumb travel, and limited simultaneous decisions
4. **Meaningful spectacle**
   - 3D should add atmosphere, clarity, and attachment, not just decoration
5. **Performance resilience**
   - features should degrade gracefully on weaker devices

---

## What "characters moving around" should mean

The safest and most useful interpretation is **not** full navigation or open-world movement.

Instead, it should mean:

- idle ambient loops in a living hub or village
- job-specific work cycles
- simple travel staging for quests
- location-based vignettes and small scene changes
- a clear visual difference between idle, working, traveling, and questing

This kind of movement reads well in portrait mode and is much cheaper than pathfinding-heavy scene
simulation.

---

## Approach A: Immersive hybrid world UI

### One-line description

Keep the app shell, sheets, and controls in DOM, but make the shared 3D scene represent the living
state of the roster and world.

### What changes

- preserve DOM controls for navigation, buttons, requirements, rewards, and filters
- use the shared canvas on more route-level screens, especially inventory and quests
- introduce route-specific dioramas, hubs, or map scenes behind the UI
- show characters in world contexts:
  - training
  - gathering resources
  - preparing gear
  - traveling to quests
  - standing at quest destinations
- move from purely card-driven status reporting toward scene-backed state reporting

### Target player experience

The player still manages the game through clear web UI, but the surrounding scene constantly answers
"what is everyone doing right now?"

The game feels less like browsing a database of units and more like overseeing a small world in
motion.

### Why this fits the project well

- works with the current architecture
- keeps accessibility and readability strong
- minimizes risk for portrait mode
- allows incremental rollout per route
- supports the clarified goal of seeing characters engaged in tasks and quests

### Candidate UX shape by area

#### Character inventory

- **Top scene area**
  - a village, workshop, encampment, or roster hall
  - visible characters occupying scene "slots" based on status
- **Bottom sheet**
  - filters and tabs
  - roster list
  - tap a character to focus them in the scene and open details

#### Character detail / tasks

- show the character in a job or quest vignette instead of only a neutral viewer
- if idle, show a home-base idle stance
- if assigned, switch to a scene state that matches the assignment
- use the DOM task panel for actual actions and requirements

#### Quests page

- turn quests into a scene-backed dispatch board or world map
- show active parties at destinations or in transit
- represent progress with world changes:
  - party has departed
  - party is at location
  - completion ready
- keep quest requirements and rewards in DOM cards or drawers

#### Jobs and task management

- represent jobs as places or stations, not just text labels
- e.g. forge, archive, training circle, resource field, dock, tunnel
- assigning a character means placing them into that world activity visually

### Production scope

Moderate. This direction needs new environment vignettes, route-level scene composition, and UI
refactors, but it does not require replacing the app shell or inventing a new control model.

### Biggest risks

- could add visual flavor without enough clarity if scene-state rules are vague
- could become too decorative if assignments are not reflected clearly
- roster growth could make scenes visually noisy

### Mitigations

- define a small number of readable state buckets: idle, job, travel, quest, recovery
- only spotlight a subset of characters at once and use lists for the full roster
- design portrait wireframes before building scene assets

---

## Approach B: Full 3D-first world presentation

### One-line description

Push much more of the game shell into Three.js so the world scene becomes the primary interface and
the DOM HUD becomes a lightweight overlay.

### What changes

- build a more complete hub or regional world scene
- treat inventory and quest management as scene-led interactions
- reduce the visual weight of cards and panels
- explore scene-based selection, map interactions, and world-space callouts
- potentially use the world as the main place where players inspect assignments and quest progress

### Target player experience

The player feels less like they are using menus and more like they are looking into a diorama or
world simulation where their roster is visibly active.

### Why this is attractive

- highest immersion potential across the whole app
- best match for the fantasy of "seeing characters in their tasks or quests"
- strongest visual differentiation from a conventional idle RPG interface

### Why this is risky

- highest performance cost on the web
- most demanding in art, animation, and optimization work
- greatest chance of reducing readability on portrait screens
- much harder to keep fast, obvious management interactions

### Production scope

High. This direction needs more environment art, more animation coverage, more scene interaction
design, and stronger performance tooling. It should be treated as a deliberate product bet rather
than a styling pass.

### Biggest risks

- performance regressions on mobile browsers
- task and quest management becoming slower or less clear
- expensive content pipeline for scene variants
- world-space interactions replacing simple UI that is currently easy to use

### Mitigations

- keep critical management actions in screen-space DOM even in a 3D-first direction
- use fixed or semi-fixed camera framing instead of free camera control
- favor a small number of authored hubs and quest dioramas over a sprawling world
- ship one slice first before expanding the pattern everywhere

---

## Recommended interpretation of "full 3D environment"

If the project explores a more ambitious direction, the safest interpretation is:

- **Do** build richer hubs, quest dioramas, job stations, and travel scenes
- **Do** let characters appear occupied and situated in those spaces
- **Do not** assume free exploration is required
- **Do not** replace every piece of management UI with world-space interaction

For this project, a **living diorama** is a better target than a **fully 3D UI**.

---

## Comparison

| Topic                         | Approach A: Immersive hybrid world UI | Approach B: Full 3D-first world UI |
| ----------------------------- | ------------------------------------- | ---------------------------------- |
| Immersion upside              | High                                  | Very high                          |
| Portrait readability          | Strong                                | Medium to risky                    |
| Performance risk              | Moderate                              | High                               |
| Asset and animation cost      | Moderate                              | High                               |
| Fit with current architecture | Strong                                | Medium                             |
| Ease of incremental rollout   | Strong                                | Weak to medium                     |
| Best next step                | Yes                                   | Only after a vertical slice        |

---

## Screen-by-screen opportunities

### Character inventory

Current role:

- roster browsing
- filtering by type
- quick status glance

Future opportunity:

- turn it into a **living roster scene**
- show idle characters in a camp, village, archive, or staging area
- visually separate idle characters from busy ones
- make tap-to-focus drive both the roster card and the scene camera

### Character detail

Current role:

- hero presentation
- stats, inventory, tasks, chronicle

Future opportunity:

- keep hero presentation for the Stats tab
- switch the scene per tab:
  - Stats: neutral showcase
  - Tasks: assignment vignette
  - Inventory: mask or gear showcase
  - Chronicle: story-backed scene or backdrop

### Quests page

Current role:

- dispatch list
- active quest timers
- available quest cards
- completed quest archive

Future opportunity:

- show active quests as places on a map or in travel lanes
- show assigned characters in those destinations
- make "available quests" feel like locations opening up, not only cards unlocking
- keep completed quests textual, but visually grouped as remembered chapters

### Jobs / assignments

Current role:

- task selection and status badge

Future opportunity:

- show each job as a recognizable station or environment
- place assigned characters into those stations
- use simple looping motion to show the job is alive

### Battle

Battle should still improve, but it becomes one part of a broader immersive world strategy rather
than the main expression of it.

---

## Portrait-mode design rules

These rules should hold for either approach:

1. Keep the main management controls near the bottom of the screen.
2. Minimize persistent top-of-screen chrome.
3. Avoid showing too many equally weighted cards at once.
4. Let the 3D scene occupy the emotional center of the screen.
5. Use tap-to-expand for details instead of showing every stat all the time.
6. Treat the game as a sequence of focused decisions, not a dense dashboard.

---

## Performance guardrails

If the UI becomes more scene-heavy, maintain these guardrails:

- preserve the single shared canvas architecture
- animate only the currently relevant subset of characters
- use lightweight looping motion instead of full navigation systems
- prefer fake or simplified shadows over expensive fully dynamic lighting
- avoid heavy postprocessing by default
- favor stylized, readable environments over geometry-heavy realism
- lazy-load environment assets where possible
- treat performance monitor checks as part of routine UI iteration

---

## Proposed roadmap

### Phase 1: Living-state UX foundation

- define the core visible states:
  - idle
  - assigned to job
  - traveling
  - on quest
  - ready to collect
- redesign the relevant portrait layouts around scene + bottom sheet patterns

### Phase 2: Character detail and task vignettes

- make task and assignment views scene-backed
- show assignment-specific presentation for characters
- establish reusable state-driven animation loops

### Phase 3: Immersive inventory

- turn the character inventory route into a living roster hub
- add focus behavior between roster list and visible scene actors
- visually separate idle and busy characters

### Phase 4: Immersive quests

- build a scene-backed quest board or map
- show active parties in-world
- represent dispatch and completion more visually

### Phase 5: Vertical slice for 3D-first world UI

- pick one route, likely inventory or quests
- build a more ambitious 3D-first version
- test portrait readability and FPS on constrained hardware
- decide whether the gains justify broader rollout

---

## Recommendation

The best near-term direction is **Approach A: Immersive hybrid world UI**.

Reasoning:

- it directly addresses the clarified goal of seeing characters engaged in jobs and quests
- it fits portrait web constraints much better
- it preserves readable, accessible management controls
- it uses the existing Three.js foundation rather than replacing it
- it allows one screen at a time to become more immersive

Approach B should remain a valid future option, but it should be explored as a contained prototype,
not as the default next step.

---

## Open questions for future planning

- Which locations should become the first visible job or quest spaces?
- What is the minimum animation set that makes the world feel alive without exploding scope?
- How many characters should be visible in a scene at once on portrait screens?
- Which screen should be the first "living world" proof point: inventory, quests, or character
  detail tasks?
- What FPS floor should be considered acceptable on mobile browsers before expanding scene scope?
