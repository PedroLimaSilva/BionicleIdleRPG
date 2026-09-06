/**
 * Three.js GLTFLoader node-name normalization used at runtime.
 * See `vahki.spec.ts` and Metru attachment comments: `.` stripped, spaces → `_`.
 */
export function sanitizeKitNodeName(name: string): string {
  return name.replace(/\./g, '').replace(/ /g, '_');
}
