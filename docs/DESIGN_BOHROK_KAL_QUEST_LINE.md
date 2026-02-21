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

## Recommendation: Hybrid of A + B

- **Quests**: Timer-based narrative quests (like Bohrok Swarm). Descriptions cover defeats and the arc.
- **Story battles**: A few key encounters are **scripted story battles** with Bohrok Kal models:
  - First encounter: scripted loss (or unwinnable).
  - Intermediate encounters: scripted losses.
  - Final encounter: scripted win (or first truly winnable battle).

This gives:
- Use of Bohrok Kal models in battles.
- Strong sense that they are overpowered.
- “Toa never win until the end” without grind.
- A clear arc: defeats → final victory.

---

## Nuva Symbols: Include Them?

### Canon

The Bohrok Kal steal the Nuva symbols, which hold much of the Toa Nuva’s power. That’s why they are stronger than the Toa.

### Option 1: Include Nuva Symbols

- **Opening quest**: Bohrok Kal steal the Nuva symbols. This explains their power and the Toa’s weakness.
- **Mechanic**: Optional; could be a narrative-only beat. No special grind (e.g. no “collect symbols” loop).
- **Final quest**: Toa reclaim the symbols; power restored; they win.
- **Pros**: Fits canon, clear story logic.
- **Cons**: Requires some representation of “symbols” (narrative, items, or UI).

### Option 2: Omit Nuva Symbols

- Bohrok Kal are simply “elite Bohrok” with higher stats.
- **Pros**: Simpler; fewer systems.
- **Cons**: Less canon-aligned; weaker explanation for their strength.

### Recommendation

**Include them as a narrative element, not a grind mechanic.**

- Opening quest: “The Stolen Symbols” — Bohrok Kal steal the Nuva symbols. Narrative text only.
- No “collect 6 symbols” or similar grind.
- Final quest: “Reclaiming the Symbols” — Toa defeat the Kal and get them back.
- Optional: symbols could appear as a simple UI state (e.g. “Nuva symbols: stolen / reclaimed”) for flavor.

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

## Implementation Notes

- **Bohrok Kal models**: Can reuse `bohrok_master.glb` with a different color scheme (e.g. metallic/chrome) if a dedicated Kal model is not available.
- **Combatants**: Add `tahnok_kal`, `gahlok_kal`, etc. to `COMBATANT_DEX` with elevated stats.
- **Story battle support**: Either a `scriptedOutcome: 'loss' | 'win'` flag on encounters, or a separate “story battle” flow that bypasses normal victory/defeat logic.
- **Encounter visibility**: Bohrok Kal encounters only appear during (or after) the Bohrok Kal quest line and are filtered by `unlockedAfter` as today.
