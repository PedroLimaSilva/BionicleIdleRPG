import { ElementTribe } from './Matoran';

// Core Krana identifiers – binary collected/not-collected only.
// Do NOT extend this beyond the Bohrok Swarm arc.
export type KranaId = 'Xa' | 'Bo' | 'Su' | 'Za' | 'Vu' | 'Ja' | 'Yo' | 'Ca';

// Only Toa elements participate in Krana collection – Light/Shadow are excluded.
export type KranaElement = Exclude<ElementTribe, ElementTribe.Light | ElementTribe.Shadow>;

// Global Krana collection, keyed by eligible Toa elements.
// Each element can have each KranaId at most once.
export type KranaCollection = Partial<Record<KranaElement, KranaId[]>>;
