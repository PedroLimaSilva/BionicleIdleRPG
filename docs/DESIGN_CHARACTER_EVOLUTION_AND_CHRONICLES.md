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

### 1. Chronicle Sets (Declared by Lineage/Stage)

Extract chronicles into a separate structure, keyed by **character lineage** (the person across forms), not by matoran dex id:

```typescript
// src/data/chronicles.ts

import type { ChronicleEntry } from '../types/Chronicle';

/** Chronicle lineage keys - one per character "person" whose story persists across evolutions */
export const CHRONICLE_LINEAGES = {
  TOA_TAHU: 'TOA_TAHU',
  TOA_GALI: 'TOA_GALI',
  TOA_POHATU: 'TOA_POHATU',
  TOA_ONUA: 'TOA_ONUA',
  TOA_KOPAKA: 'TOA_KOPAKA',
  TOA_LEWA: 'TOA_LEWA',
  TAKUA: 'TAKUA',
  // ... future lineages
} as const;

export type ChronicleLineage = (typeof CHRONICLE_LINEAGES)[keyof typeof CHRONICLE_LINEAGES];

/** Chronicle entries declared once per lineage, reused by all forms of that character */
export const CHRONICLES_BY_LINEAGE: Record<ChronicleLineage, ChronicleEntry[]> = {
  [CHRONICLE_LINEAGES.TOA_TAHU]: [
    { id: 'tahu_arrival_mata_nui', section: 'Arrival on Mata Nui', ... },
    { id: 'tahu_first_trials', ... },
    // ...
  ],
  [CHRONICLE_LINEAGES.TOA_GALI]: [...],
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
  /** Reference to shared chronicle set - multiple matoran entries can share the same lineage */
  chronicleLineage?: ChronicleLineage;  // replaces: chronicle?: ChronicleEntry[];
};
```

### 3. MATORAN_DEX: Evolved Forms as New Entries, Same Chronicle

| Evolution              | Matoran Dex ID       | Chronicle Lineage |
|------------------------|----------------------|-------------------|
| Tahu (Mata)            | `Toa_Tahu`           | `TOA_TAHU`        |
| Tahu (Nuva)            | `Toa_Tahu_Nuva`     | `TOA_TAHU`        |
| Takua (Diminished)     | `Takua`              | `TAKUA`           |
| Takua (future form)    | `Takua_Turaga` (etc.)| `TAKUA`           |

Each dex entry has its own: model key, stats, name, colors. All share the same `chronicleLineage` for that character.

### 4. Chronicle Lookup: Resolve via Lineage

```typescript
// chronicleUtils.ts

export function getCharacterChronicle(
  characterId: string,
  progress: ChronicleProgressContext
): ChronicleEntryWithState[] {
  const base = MATORAN_DEX[characterId];
  if (!base?.chronicleLineage) return [];

  const entries = CHRONICLES_BY_LINEAGE[base.chronicleLineage];
  if (!entries?.length) return [];

  return entries.map((entry) => ({
    ...entry,
    isUnlocked: isChronicleEntryUnlocked(entry.unlockCondition, progress),
  }));
}
```

### 5. Evolution Flow

When a character evolves (e.g., via quest reward):

1. **Update `recruitedCharacters`**: Replace the old id with the new one.
   ```typescript
   // Before: { id: 'Toa_Tahu', exp: 5000, ... }
   // After:  { id: 'Toa_Tahu_Nuva', exp: 5000, ... }
   ```
2. **Preserve progress**: EXP, assignment, quest, mask overrides stay on the same recruited slot.
3. **Chronicle progress**: Unlock state is driven by `completedQuests` (global), not per-character. Since both `Toa_Tahu` and `Toa_Tahu_Nuva` use `chronicleLineage: TOA_TAHU`, they see the same chronicle and same unlock state. No migration needed.

---

## Data Migration

- **MATORAN_DEX**: Remove inline `chronicle`, add `chronicleLineage` to each entry that had chronicles.
- **Save migration**: Not required for chronicle refactoring. If we add evolution *after* this refactor, a future migration would handle `recruitedCharacters` id updates when evolving (e.g., v10 migration).

---

## Evolution Metadata (Optional)

To support "what can this character evolve into?", we can add:

```typescript
// Optional evolution chain metadata
type EvolutionChain = {
  from: string;   // matoran dex id
  to: string;     // matoran dex id
  trigger?: 'QUEST' | 'ITEM' | 'LEVEL';
  triggerId?: string;
};

export const EVOLUTION_CHAINS: EvolutionChain[] = [
  { from: 'Toa_Tahu', to: 'Toa_Tahu_Nuva', trigger: 'QUEST', triggerId: 'story_nuva_evolution' },
  // ...
];
```

---

## Implementation Order

1. **Phase 1 – Chronicle extraction**
   - Create `src/data/chronicles.ts` with `CHRONICLES_BY_LINEAGE` and `CHRONICLE_LINEAGES`.
   - Add `chronicleLineage` to `BaseMatoran`, remove `chronicle`.
   - Update `chronicleUtils.ts` to resolve via lineage.
   - Update `matoran.ts` to use `chronicleLineage` instead of inline chronicle.
   - Run tests and fix any breakage.

2. **Phase 2 – Evolution-ready dex entries**
   - Add `Toa_Tahu_Nuva` (and other Nuva) entries to MATORAN_DEX when ready to implement evolution.
   - Add `ToaTahuNuvaModel` etc. to `CharacterScene` and wire stage/id branching.

3. **Phase 3 – Evolution mechanics**
   - Implement evolution trigger (quest completion, item use, etc.).
   - Add migration for evolving characters (id change in `recruitedCharacters`).
   - Wire UI for evolution events.

---

## Open Questions

- **Lineage vs. Stage**: Should chronicles be keyed purely by lineage, or by lineage+stage? (e.g., separate `TOA_TAHU_MATA` vs `TOA_TAHU_NUVA` if Nuva gets additional chronicle sections.) Current design assumes one lineage = one chronicle; we can extend later if Nuva-era chronicles differ.
- **RecruitedCharacterData identity**: Should we add a stable `lineageId` for UI/analytics ("this is still Tahu") even when `id` changes? Useful for tracking "same character" across evolutions.
