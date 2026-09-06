import { sanitizeKitNodeName } from './sanitizeKitNodeName';

/** Map a registered runtime `kitNodeName` to the mesh node name present in the kit GLB JSON. */
export function resolveKitGlbNodeName(
  registeredName: string,
  glbNodeNames: ReadonlySet<string>
): string | null {
  const sanitizedLookup = new Map<string, string>();
  for (const glbName of glbNodeNames) {
    sanitizedLookup.set(sanitizeKitNodeName(glbName), glbName);
  }

  if (sanitizedLookup.has(registeredName)) {
    return sanitizedLookup.get(registeredName)!;
  }

  // Legacy aliases from older registries / exports.
  const candidates = new Set<string>([
    registeredName.replaceAll('_', ' '),
    registeredName.replace(/([LR])$/, '.$1'),
  ]);

  for (const candidate of candidates) {
    const sanitized = sanitizeKitNodeName(candidate);
    if (sanitizedLookup.has(sanitized)) return sanitizedLookup.get(sanitized)!;
  }

  const lower = registeredName.toLowerCase();
  for (const [sanitized, glbName] of sanitizedLookup) {
    if (sanitized.toLowerCase() === lower) return glbName;
    if (sanitized.replace(/[\s_.-]/g, '').toLowerCase() === lower.replace(/[\s_.-]/g, '')) {
      return glbName;
    }
  }

  return null;
}
