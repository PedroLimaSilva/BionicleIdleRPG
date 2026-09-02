/** three 0.160 ships TSL as `three/nodes` (later `three/tsl`). No bundled types. */
declare module 'three/nodes' {
  export type TslNode = {
    x: TslNode;
    y: TslNode;
    z: TslNode;
    mul: (other: TslNode | number) => TslNode;
    sub: (other: TslNode | number) => TslNode;
    add: (other: TslNode | number) => TslNode;
    isNode?: boolean;
  };

  export function tslFn<T>(fn: (inputs: T) => TslNode): ((inputs: T) => TslNode) & {
    shaderNode: { isNode?: boolean };
  };
  export function attribute(name: string, type?: string): TslNode;
  export function varying(node: TslNode, name?: string): TslNode;
  export function uniform(value: number | TslNode): TslNode;
  export function float(value?: number | TslNode): TslNode;
  export function vec3(x?: TslNode | number, y?: TslNode | number, z?: TslNode | number): TslNode;
  export function max(a: TslNode, b: TslNode): TslNode;
  export function smoothstep(e0: TslNode | number, e1: TslNode | number, x: TslNode): TslNode;
}
