import type { ComponentType } from 'react';

export type ArenaId = 'desert';

export interface ArenaDefinition {
  id: ArenaId;
  glbUrl: string;
  Atmosphere: ComponentType<ArenaAtmosphereProps>;
}

export interface ArenaAtmosphereProps {
  castShadow: boolean;
}
