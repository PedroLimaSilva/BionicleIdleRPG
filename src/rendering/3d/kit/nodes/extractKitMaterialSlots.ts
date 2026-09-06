import { extractGlbNodeMaterialSlots } from './readGlbJson';
import { resolveKitGlbNodeName } from './resolveKitGlbNodeName';
import { deriveKitConfigSlotNames } from '../kitMaterialUtils';

export type KitMaterialSlotRegistry = Readonly<Record<string, readonly string[]>>;

export function parseKitNodeRegistry(source: string): Record<string, string> {
  const registry: Record<string, string> = {};
  const entryRe = /^\s*(\w+):\s*'((?:\\'|[^'])*)',?\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(source))) {
    registry[match[1]] = match[2].replace(/\\'/g, "'");
  }
  return registry;
}

export function buildKitMaterialSlotRegistry(
  registry: Record<string, string>,
  glbPath: string
): KitMaterialSlotRegistry {
  const glbSlots = extractGlbNodeMaterialSlots(glbPath);
  const glbNodeNames = new Set(Object.keys(glbSlots));
  const result: Record<string, string[]> = {};

  for (const [registryKey, kitNodeName] of Object.entries(registry)) {
    const resolved = resolveKitGlbNodeName(kitNodeName, glbNodeNames);
    result[registryKey] = resolved ? [...deriveKitConfigSlotNames(glbSlots[resolved] ?? [])] : [];
  }

  return result;
}

export function formatMaterialSlotRegistryTs(
  constName: string,
  kitNodesImport: string,
  typeName: string,
  registry: KitMaterialSlotRegistry
): string {
  const lines = Object.entries(registry).map(([key, slots]) => {
    const slotList = slots.map((slot) => `'${slot.replace(/'/g, "\\'")}'`).join(', ');
    return `  ${key}: [${slotList}] as const,`;
  });

  return `import { ${kitNodesImport} } from './${kitNodesImport === 'KIT_2001_NODES' ? 'kit2001Nodes' : kitNodesImport === 'KIT_2003_NODES' ? 'kit2003Nodes' : 'kit2004Nodes'}';

/**
 * Material slot names on each attachable node in the kit GLB.
 * Keys match \`${kitNodesImport}\`; values are \`materialColors\` config keys.
 * Regenerate: \`yarn kit-material-slots-report --write\`
 */
export const ${constName} = {
${lines.join('\n')}
} as const satisfies Record<keyof typeof ${kitNodesImport}, readonly string[]>;

export type ${typeName} = typeof ${constName};
`;
}
