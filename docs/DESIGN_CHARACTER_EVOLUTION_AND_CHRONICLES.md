# Design: Character Evolution and Chronicle Refactoring

## Summary

When recruited characters evolve (e.g., Toa Mata → Toa Nuva), their **ID changes** so a new `CHARACTER_DEX` entry defines their evolved attributes (model, stats, name). Chronicles should be **extracted** from the matoran dex and declared once per character lineage, then **reused** by multiple matoran entries that share the same story.

---

## Current State

- **`CHARACTER_DEX`**: Each entry (`Toa_Tahu`, `Takua`, etc.) holds static attributes: id, name, element, mask, stage, colors, and **inline chronicle**.
- **`RecruitedCharacterData`**: Stores `id` (key into CHARACTER_DEX), exp, assignment, quest, etc.
- **Chronicles**: Defined inline in each matoran entry. When Tahu evolves to Toa Nuva, we would have to duplicate the same chronicle in a new `Toa_Tahu_Nuva` entry.

## Problem

- Evolution changes: **model**, **base stats**, **name** (stage-specific).
- Evolution _does not_ change: **chronicle** (same person, same story).
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

### 3. CHARACTER_DEX: Evolved Forms as New Entries, Same Chronicle

| Evolution           | Matoran Dex ID        | Chronicle ID |
| ------------------- | --------------------- | ------------ |
| Tahu (Mata)         | `Toa_Tahu`            | `tahu`       |
| Tahu (Nuva)         | `Toa_Tahu_Nuva`       | `tahu`       |
| Takua (Diminished)  | `Takua`               | `takua`      |
| Takua (future form) | `Takua_Turaga` (etc.) | `takua`      |

Each dex entry has its own: model key, stats, name, colors. All share the same `chronicleId` for that character.

### 4. Chronicle Lookup: Resolve via Chronicle ID

```typescript
// chronicleUtils.ts

export function getCharacterChronicle(
  characterId: string,
  progress: ChronicleProgressContext
): ChronicleEntryWithState[] {
  const base = CHARACTER_DEX[characterId];
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

1. **Update `recruitedCharacters`**: Replace the old id with the new one; drop `maskOverride`.
   ```typescript
   // Before: { id: 'Toa_Tahu', exp: 5000, maskOverride: Mask.Miru, ... }
   // After:  { id: 'Toa_Tahu_Nuva', exp: 5000, ... }
   ```
   Chronicle identity is derived from the new dex entry; no need to store it.
2. **Preserve progress**: EXP, assignment, and quest stay on the same recruited slot. **Remove mask overrides**—each evolution grants new masks; the previous form’s mask overrides are lost.
3. **Chronicle progress**: Unlock state is driven by `completedQuests` (global), not per-character. Since both `Toa_Tahu` and `Toa_Tahu_Nuva` use `chronicleId: 'tahu'`, they see the same chronicle and same unlock state. No migration needed.

---

## Data Migration

- **CHARACTER_DEX**: Remove inline `chronicle`, add `chronicleId` to each entry that had chronicles.
- **Save migration**: Not required for chronicle refactoring. If we add evolution _after_ this refactor, a future migration would handle `recruitedCharacters` id updates when evolving (e.g., v10 migration).

---

## Evolution as Surprise

Evolutions are **surprise twists**—they should not be exposed in the UI (e.g. no "evolve" button or preview of future forms). Triggers (quest completion, item use, etc.) are internal only; the player discovers evolution when it happens.

---

## Implementation Order

1. **Phase 1 – Chronicle extraction** ✅ _Completed_
   - Create `src/data/chronicles.ts` with `CHRONICLES_BY_ID` and `CHRONICLE_IDS`.
   - Add `chronicleId` to `BaseMatoran`, remove `chronicle`.
   - Update `chronicleUtils.ts` to resolve via chronicle ID.
   - Update `matoran.ts` to use `chronicleId` instead of inline chronicle.
   - Run tests and fix any breakage.

2. **Phase 2 – Evolution-ready dex entries** ✅ _Completed_
   - Add `Toa_Tahu_Nuva` (and other Nuva) entries to CHARACTER_DEX.
   - Add `ToaTahuNuvaModel`, `ToaGaliNuvaModel` to `CharacterScene`; others use placeholder; wire stage/id branching.

3. **Phase 3 – Evolution mechanics** ✅ _Completed_
   - Quest reward `evolution` field maps participant dex IDs to evolved forms.
   - `completeQuest` applies evolution: replace id, drop mask overrides, preserve EXP/assignment/quest.
   - Activity log records evolution events.
   - `bohrok_evolve_toa_nuva` quest triggers Toa Mata → Toa Nuva evolution.

---

## Chronicle Visibility by Stage

Chronicles are a **mixture of historical log and to-do list**. The same chronicle content is shared across stages, but some entries can be **hidden until certain stages**. For example: the Toa Mata know their ultimate destiny is to defeat Makuta and awaken the Great Spirit, but they do not yet know they will face the Rahkshi or undergo mutations. Those future entries remain hidden until the character reaches the relevant stage. This can be implemented by adding an optional `visibleFromStage?: MatoranStage` to `ChronicleEntry`; entries without it are always visible once their unlock condition is met.

---

## Chronicle Identity

`chronicleId` is not stored on `RecruitedCharacterData`. It is derived from `CHARACTER_DEX[matoran.id].chronicleId` whenever needed. When a character evolves, `id` updates to the new dex entry; that new entry shares the same `chronicleId`, so the chronicle is stable across forms without duplicating data.
