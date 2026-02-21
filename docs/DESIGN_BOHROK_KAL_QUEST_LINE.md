# Bohrok Kal Quest Line – Design Notes

Design considerations for adding the Bohrok Kal arc after the Toa Nuva evolution, addressing: Nuva symbols, overpowered opponents, avoiding grind, using Bohrok Kal models, and the "Toa never win until the end" narrative.

---

## Current System Context

- **Quests**: Timer-based; assign Matoran and wait. No battle win required.
- **Battles**: Optional/repeatable; used for Krana collection during Bohrok Swarm. Rewards (XP, loot, Krana) only on victory.
- **Bohrok Swarm arc**: Ends with Toa Nuva evolution; Bohrok become recruitable assistants.

---

## Design Goals

1. Use Bohrok Kal models as opponents.
2. Bohrok Kal feel overpowered.
3. Toa Nuva never win against them until the final quest.
4. Avoid encouraging grinding.

---

## Option A: Quest-Only Narrative (No Grind, Full Control)

**Idea**: Bohrok Kal appear only in quest descriptions and cutscenes. No repeatable battles; all “encounters” are narrative beats.

**How “defeats” work**: Each quest text describes a loss or retreat. Timers advance the story; no battle gates.

**Pros**:
- Zero grind.
- Full control over pacing and outcome.
- No need for scripted battle mechanics.

**Cons**:
- Bohrok Kal models only used in cutscenes (if at all), not in the battle arena.
- Less use of the battle system.

---

## Option B: Scripted “Story Battles” (Use Models, Predetermined Outcome)

**Idea**: Introduce a new battle type: **story battles** that are part of quest flow. The battle plays out (showing Bohrok Kal models), but the outcome is predetermined—win or lose based on quest design.

**How it works**:
- Quest says “Confront Tahnok Kal” → battle loads with Tahnok Kal as enemy.
- Battle runs, but:
  - **Either**: Battle is unwinnable (enemies have massive stats); loss is expected; losing advances the quest.
  - **Or**: Battle is purely cinematic (automated, no player input); “loss” or “retreat” plays out automatically.
- Final quest: one winnable story battle.

**Pros**:
- Bohrok Kal models appear in the battle arena.
- Players see the power gap.
- No grind—outcomes are fixed.
- Narrative: losses build tension; final quest delivers payoff.

**Cons**:
- Requires new “story battle” / scripted outcome support.
- Optional: “unwinnable” battles may frustrate players if expectations aren’t clear.

---

## Option C: Optional Encounters That Don’t Block Progress

**Idea**: Bohrok Kal appear in the battle selector as optional encounters. Losing does not block quest progress; quests are timer-based. Winning is either impossible or extremely difficult until the final quest.

**How it works**:
- Quest line progresses on timers.
- Bohrok Kal encounters are unlocked alongside the arc.
- Encounters are tuned so that winning is effectively impossible early on.
- Final quest unlocks a special “final confrontation” encounter that is winnable.

**Pros**:
- Reuses the existing battle system.
- No hard gate on progression.
- Players can optionally “try” and see how strong the Kal are.

**Cons**:
- Some players may still try to grind (even if futile).
- Need clear UX to show these as “story/atmosphere” fights, not progression gates.

---

## Chosen Approach: Option C + Story Battles + Nuva Symbols

- **Quests**: Timer-based narrative quests. Bohrok Kal encounters appear in the battle selector but do not block quest progress.
- **Nuva symbols**: Sequestered by the Bohrok Kal at the arc start. Toa Nuva stats are diminished while symbols are sequestered—both narrative justification and mechanical effect.
- **Story battles**: We will invest in a story battle system to support scripted encounters triggered by quest flow (e.g. First Strikes, Final Confrontation). These use BK models and predetermined outcomes.


---

## Nuva Symbols: Sequestered (Stat Diminishment)

- **Narrative**: Explains why the Kal are overpowered and the Toa struggle—the symbols hold much of the Toa Nuva's power.
- **Mechanical**: Toa Nuva stats are diminished while symbols are sequestered. When symbols are reclaimed (final quest), stats restore to full.
- **No grind**: No "collect symbols" loop. Symbols are stolen in the opening quest and reclaimed when the Toa triumph in the final confrontation.

---

## Anti-Grind Summary

| Approach                     | Grind risk | Model usage |
|-----------------------------|-----------|-------------|
| Quest-only narrative        | None      | Minimal     |
| Scripted story battles      | None      | High        |
| Optional, tuned encounters  | Low       | High        |
| Symbol collection as a gate | High      | —           |

**Avoid**: Making symbol collection, or repeated Bohrok Kal wins, a requirement for progression.

---

## Suggested Quest Arc Structure (Draft)

1. **The Stolen Symbols** (5 min)  
   - Bohrok Kal awaken and steal the Nuva symbols. Toa Nuva are weakened; the Kal are empowered.

2. **First Strikes** (10–15 min)  
   - [Optional story battle: loss] Kal strike villages. Toa respond and are driven back.

3. **Scattered** (15–20 min)  
   - Toa split up to protect villages. Each faces a Kal and loses or is forced to retreat.

4. **Gathering Strength** (15–20 min)  
   - Toa regroup, learn about the Kal, and plan. No battles.

5. **The Final Confrontation** (20–25 min)  
   - [Story battle: win] Toa unite, recover the symbols (or beat the Kal without them), and defeat the Bohrok Kal.

---

## Quest-by-Quest: Do Story Battles Make Sense?

**When a story battle helps:**
- The encounter is the **dramatic focus** of the quest.
- The win/loss **drives the narrative** and should feel earned.
- Showing BK models in the arena adds something text cannot.
- It’s a **single**, focused moment rather than a long sequence.

**When a story battle doesn’t help:**
- The quest covers many events or a broad timespan.
- The defeat is retreat/regrouping, not a clear fight.
- It would slow pacing or repeat what the text already says.
- The quest is about discovery, planning, or non-combat actions.

### 1. The Stolen Symbols — **No story battle**

- Inciting incident: theft, ambush, symbols taken.
- Not framed as a pitched battle; the Toa may be caught off-guard.
- **Verdict:** Narrative only. A battle would miss the point.

### 2. First Strikes — **Optional story battle**

- First real confrontation: Kal hit villages, Toa respond and are driven back.

**With story battle:**
- Player sees BK in the arena and experiences the power gap.
- Scripted loss: team is overwhelmed; defeat advances the quest.
- **Risk:** “You’re going to lose” can feel bad if not set up clearly (e.g. pre-battle text: “The Toa rush to defend the village, knowing the odds are against them…”).

**Without story battle:**
- Text describes the retreat and sets the stakes.
- Simpler to implement; no new flow.

**Verdict:** Optional. Only add if you want BK models to appear early; otherwise, narrative is enough.

### 3. Scattered — **No story battle (or at most one)**

- Toa split up; each faces a Kal and loses or retreats.
- That could imply **six** fights (one per Toa/Kal pair).
- Six scripted losses would be repetitive and long.
- **Verdict:** Narrative only. Or a single representative battle (e.g. Tahu vs Tahnok Kal) that stands for all six, but that’s marginal.

### 4. Gathering Strength — **No story battle**

- Planning, regrouping, intel. No combat focus.
- **Verdict:** Narrative only.

### 5. The Final Confrontation — **Yes, story battle**

- The climax: the one fight the Toa win.
- A winnable story battle gives the player agency and payoff after the losing streak.
- **Verdict:** Strong fit for a story battle.

---

## Story Battle Strategy Summary

| Quest                | Story battle? | Rationale                                      |
|----------------------|---------------|-------------------------------------------------|
| The Stolen Symbols   | No            | Ambush/theft, not a battle.                     |
| First Strikes        | Optional      | First confrontation; can establish threat.     |
| Scattered            | No            | Six losses would be repetitive; narrative fits. |
| Gathering Strength   | No            | No combat; planning and regrouping.             |
| The Final Confrontation | **Yes**   | Climax; player earns the win.                   |

**Minimal implementation:** Only the final quest has a story battle. Defeats live in quest text; BK models appear in the climax.

**Moderate implementation:** First Strikes (scripted loss) + Final (win). Two story battles. Enough to show BK early and contrast loss vs. victory.

**Full narrative:** No story battles at all. All encounters in text. Simplest; BK models only in cutscenes or not at all.

---

## Story Battle System (Investment)

We will build a **story battle system** to support scripted encounters that are triggered by quest flow, use predetermined outcomes, and integrate with the existing battle arena.

### Goals

- Battles triggered **from quests** (not only from the battle selector).
- **Scripted outcomes**: Win or loss predetermined by design; player plays through the encounter but outcome is fixed.
- Use existing battle arena, models, and combat logic where possible.
- Support **stat modifiers** (e.g. diminished Toa Nuva when symbols are sequestered).

### Core Components

1. **Quest-triggered battles**
   - Quest definition can specify: "when started" or "when completed" — launch a story battle.
   - Or: a quest step requires completing a story battle before the timer can finish.
   - Flow: Player starts/advances quest — story battle launches — on battle end (win or scripted loss), quest continues.

2. **Scripted outcome**
   - Encounter or battle config has `scriptedOutcome: 'win' | 'loss'`.
   - If `'loss'`: Battle plays out; when team is defeated, treat as "story loss" — quest advances, no penalty.
   - If `'win'`: Battle is winnable; victory advances quest.
   - UX: Pre-battle text (e.g. "The Toa rush to defend the village, knowing the odds are against them…") to set expectations for scripted losses.

3. **Stat modifiers**
   - Global state: `nuvaSymbolsSequestered: boolean`.
   - When true, Toa Nuva receive a stat penalty (e.g. -30% or similar) in relevant battles.
   - Applied at combatant initialization for story battles and optionally for Bohrok Kal encounters.

4. **Encounter types**
   - **Repeatable encounters** (existing): Battle selector, optional, rewards on victory. Bohrok Kal can appear here with tuned difficulty; no progress gate.
   - **Story battles** (new): Quest-triggered, one-off, scripted outcome. Block or advance quest flow.

### Data Model (Draft)

- **Quest**: Optional `storyBattle?: { encounterId: string; trigger: 'onStart' | 'onComplete'; scriptedOutcome: 'win' | 'loss' }`.
- **EnemyEncounter**: Optional `scriptedOutcome?: 'win' | 'loss'` for story-battle-only encounters.
- **GameState**: `nuvaSymbolsSequestered?: boolean` — set true when Bohrok Kal arc starts, false when final quest completes.

### Implementation Phases

1. **Phase 1**: Add `nuvaSymbolsSequestered` state and stat modifier for Toa Nuva. No UI yet; used when computing combat stats.
2. **Phase 2**: Add `scriptedOutcome` to encounter/quest model; when battle ends in defeat and `scriptedOutcome === 'loss'`, treat as success for quest advancement.
3. **Phase 3**: Quest-triggered battle flow — starting/completing a quest can launch a story battle; battle completion (win or scripted loss) advances the quest.
4. **Phase 4**: Bohrok Kal combatants, encounters, and quest line content.

---

## Implementation Notes

- **Bohrok Kal models**: Can reuse `bohrok_master.glb` with a different color scheme (e.g. metallic/chrome) if a dedicated Kal model is not available.
- **Combatants**: Add `tahnok_kal`, `gahlok_kal`, etc. to `COMBATANT_DEX` with elevated stats.
- **Encounter visibility**: Bohrok Kal encounters only appear during (or after) the Bohrok Kal quest line and are filtered by `unlockedAfter` as today.
