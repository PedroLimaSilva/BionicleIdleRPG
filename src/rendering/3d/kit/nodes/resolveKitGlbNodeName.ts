/** Map a registered `kitNodeName` to the mesh node name present in the kit GLB. */
export function resolveKitGlbNodeName(
  registeredName: string,
  glbNodeNames: ReadonlySet<string>
): string | null {
  if (glbNodeNames.has(registeredName)) return registeredName;

  const candidates = new Set<string>([
    registeredName.replaceAll('_', ' '),
    registeredName.replaceAll('_', '.'),
    registeredName.replace(/([a-z])([A-Z])/g, '$1 $2'),
    registeredName.replace(/([a-z])([A-Z])/g, '$1_$2'),
    registeredName.replace(/([LR])$/, '.$1'),
    registeredName.replace(/\.([LR])$/, '$1'),
  ]);

  for (const candidate of candidates) {
    if (glbNodeNames.has(candidate)) return candidate;
  }

  const lower = registeredName.toLowerCase();
  for (const glbName of glbNodeNames) {
    if (glbName.toLowerCase() === lower) return glbName;
    if (glbName.replace(/[\s_.-]/g, '').toLowerCase() === lower.replace(/[\s_.-]/g, '')) {
      return glbName;
    }
  }

  return null;
}
