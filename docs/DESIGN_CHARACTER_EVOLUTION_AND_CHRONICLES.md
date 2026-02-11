# Design: Character Evolution and Chronicle Refactoring

## Summary

When recruited characters evolve (e.g., Toa Mata → Toa Nuva), their **ID changes** so a new `MATORAN_DEX` entry defines their evolved attributes (model, stats, name). Chronicles should be **extracted** from the matoran dex and declared once per character lineage, then **reused** by multiple matoran entries that share the same story.

---

## Current State

- **`MATORAN_DEX`**: Each entry (`Toa_Tahu`, `Takua`, etc.) holds static attributes: id, name, element, mask, stage, colors, and **inline chronicle**.
- **`RecruitedCharacterData`**: Stores `id` (key into MATORAN_DEX), exp, assignment, quest, etc.
- **Chronicles**: Defined inline in each matoran entry. When Tahu evolves to Toa Nuva, we would have to duplicate the same chronicle in a new `Toa_Tahu_Nuva` entry.

## Problem

- Evolution changes: **model**, **base stats**, **name** (stage-specific).
- Evolution *does not* change: **chronicle** (same person, same story).
- Keeping chronicles inline leads to duplication when adding `Toa_Tahu_Nuva`, `Toa_Gali_Nuva`, etc.

---

## Proposed Architecture

### 1. Chronicle Sets (Declared by Chronicle ID)

Extract chronicles into a separate structure, keyed by **chronicle ID**—the character’s unique name (no honorifics like `TOA_`), shared across all forms of that character:

```typescript
// src/data/chronicles.ts

import type { ChronicleEntry } from '../types/Chronicle';

/** Chronicle IDs - one per character "person" whose story persists across evolutions. Use unique names only (e.g. TAHU, not TOA_TAHU). */
export const CHRONICLE_IDS = {
  TAHU: 'tahu',
  GALI: 'gali',
  POHATU: 'pohatu',
  ONUA: 'onua',
  KOPAKA: 'kopaka',
  LEWA: 'lewa',
  TAKUA: 'takua',
  // ... future characters
} as const;

export type ChronicleId = (typeof CHRONICLE_IDS)[keyof typeof CHRONICLE_IDS];

/** Chronicle entries declared once per chronicle ID, reused by all forms of that character */
export const CHRONICLES_BY_ID: Record<ChronicleId, ChronicleEntry[]> = {
  [CHRONICLE_IDS.TAHU]: [
    { id: 'tahu_arrival_mata_nui', section: 'Arrival on Mata Nui', ... },
    { id: 'tahu_first_trials', ... },
    // ...
  ],
  [CHRONICLE_IDS.GALI]: [...],
  // ...
};
```

### 2. BaseMatoran: Replace Inline Chronicle with Chronicle Ref

```typescript
// src/types/Matoran.ts

export type BaseMatoran = {
  id: string;
  name: string;
  mask: Mask;
  element: ElementTribe;
  stage: MatoranStage;
  colors: { ... };
  tags?: MatoranTag[];
  /** Reference to shared chronicle set - multiple matoran entries can share the same chronicle ID */
  chronicleId?: ChronicleId;  // replaces: chronicle?: ChronicleEntry[];
};
```

### 3. MATORAN_DEX: Evolved Forms as New Entries, Same Chronicle

| Evolution              | Matoran Dex ID       | Chronicle ID |
|------------------------|----------------------|--------------|
| Tahu (Mata)            | `Toa_Tahu`           | `tahu`       |
| Tahu (Nuva)            | `Toa_Tahu_Nuva`      | `tahu`       |
| Takua (Diminished)     | `Takua`              | `takua`      |
| Takua (future form)    | `Takua_Turaga` (etc.)| `takua`      |

Each dex entry has its own: model key, stats, name, colors. All share the same `chronicleId` for that character.

### 4. Chronicle Lookup: Resolve via Chronicle ID

```typescript
// chronicleUtils.ts

export function getCharacterChronicle(
  characterId: string,
  progress: ChronicleProgressContext
): ChronicleEntryWithState[] {
  const base = MATORAN_DEX[characterId];
  if (!base?.chronicleId) return [];

  const entries = CHRONICLES_BY_ID[base.chronicleId];
  if (!entries?.length) return [];

  return entries.map((entry) => ({
    ...entry,
    isUnlocked: isChronicleEntryUnlocked(entry.unlockCondition, progress),
  }));
}
```

### 5. Evolution Flow

When a character evolves (e.g., via quest reward):

1. **Update `recruitedCharacters`**: Replace the old id with the new one; preserve `chronicleId`; drop `maskOverride` and `maskColorOverride`.
   ```typescript
   // Before: { id: 'Toa_Tahu', chronicleId: 'tahu', exp: 5000, maskOverride: Mask.Miru, ... }
   // After:  { id: 'Toa_Tahu_Nuva', chronicleId: 'tahu', exp: 5000, ... }
   ```
2. **Preserve progress**: EXP, assignment, and quest stay on the same recruited slot. **Remove mask overrides**—each evolution grants new masks; the previous form’s mask overrides are lost.
3. **Chronicle progress**: Unlock state is driven by `completedQuests` (global), not per-character. Since both `Toa_Tahu` and `Toa_Tahu_Nuva` use `chronicleId: 'tahu'`, they see the same chronicle and same unlock state. No migration needed.

---

## Data Migration

- **MATORAN_DEX**: Remove inline `chronicle`, add `chronicleId` to each entry that had chronicles.
- **Save migration**: Not required for chronicle refactoring. If we add evolution *after* this refactor, a future migration would handle `recruitedCharacters` id updates when evolving (e.g., v10 migration).

---

## Evolution as Surprise

Evolutions are **surprise twists**—they should not be exposed in the UI (e.g. no "evolve" button or preview of future forms). Triggers (quest completion, item use, etc.) are internal only; the player discovers evolution when it happens.

---

## Implementation Order

1. **Phase 1 – Chronicle extraction**
   - Create `src/data/chronicles.ts` with `CHRONICLES_BY_ID` and `CHRONICLE_IDS`.
   - Add `chronicleId` to `BaseMatoran`, remove `chronicle`.
   - Update `chronicleUtils.ts` to resolve via chronicle ID.
   - Update `matoran.ts` to use `chronicleId` instead of inline chronicle.
   - Run tests and fix any breakage.

2. **Phase 2 – Evolution-ready dex entries**
   - Add `Toa_Tahu_Nuva` (and other Nuva) entries to MATORAN_DEX when ready to implement evolution.
   - Add `ToaTahuNuvaModel` etc. to `CharacterScene` and wire stage/id branching.

3. **Phase 3 – Evolution mechanics**
   - Implement evolution trigger (quest completion, item use, etc.).
   - Add migration for evolving characters (id change in `recruitedCharacters`).
   - Wire UI for evolution events.

---

## Chronicle Visibility by Stage

Chronicles are a **mixture of historical log and to-do list**. The same chronicle content is shared across stages, but some entries can be **hidden until certain stages**. For example: the Toa Mata know their ultimate destiny is to defeat Makuta and awaken the Great Spirit, but they do not yet know they will face the Rahkshi or undergo mutations. Those future entries remain hidden until the character reaches the relevant stage. This can be implemented by adding an optional `visibleFromStage?: MatoranStage` to `ChronicleEntry`; entries without it are always visible once their unlock condition is met.

---

## RecruitedCharacterData: Stable Identity

Add `chronicleId` to `RecruitedCharacterData` so we can track "this is still Tahu" across evolutions even when `id` changes:

```typescript
export type RecruitedCharacterData = {
  id: string;           // matoran dex id (changes on evolution)
  chronicleId: string;  // stable: e.g. "tahu" - same across forms
  exp: number;
  assignment?: JobAssignment;
  quest?: Quest['id'];
  maskOverride?: Mask;
  maskColorOverride?: LegoColor;
};
```

When a character evolves, `id` updates to the new dex entry; `chronicleId` stays the same (e.g. `"tahu"`).
