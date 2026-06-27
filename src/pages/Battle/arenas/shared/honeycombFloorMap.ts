import * as THREE from 'three';

const HEX_RADIUS_PX = 28;

/** How many times the honeycomb tile repeats across the floor disc (radius 10). Higher = smaller hexes. */
export const HONEYCOMB_FLOOR_TILE_REPEAT = 12;

function drawHexagonPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/** Tileable honeycomb albedo map tinted to match cavern floor stone. */
export function createHoneycombFloorMap(
  stoneHex: string,
  tileRepeat = HONEYCOMB_FLOOR_TILE_REPEAT
): THREE.CanvasTexture {
  const tileW = Math.round(Math.sqrt(3) * HEX_RADIUS_PX * 2);
  const tileH = HEX_RADIUS_PX * 3;
  const canvas = document.createElement('canvas');
  canvas.width = tileW;
  canvas.height = tileH;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(tileRepeat, tileRepeat);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (!ctx) {
    texture.needsUpdate = true;
    return texture;
  }

  const stone = new THREE.Color(stoneHex);
  const grout = stone.clone().multiplyScalar(0.68);
  const highlight = stone.clone().lerp(new THREE.Color('#ffffff'), 0.08);

  ctx.fillStyle = grout.getStyle();
  ctx.fillRect(0, 0, tileW, tileH);

  const horiz = Math.sqrt(3) * HEX_RADIUS_PX;
  const vert = 1.5 * HEX_RADIUS_PX;
  const inset = HEX_RADIUS_PX * 0.9;

  for (let row = -1; row <= Math.ceil(tileH / vert); row++) {
    for (let col = -1; col <= Math.ceil(tileW / horiz); col++) {
      const cx = col * horiz + (row % 2 !== 0 ? horiz / 2 : 0) + horiz / 2;
      const cy = row * vert + HEX_RADIUS_PX;
      drawHexagonPath(ctx, cx, cy, inset);
      ctx.fillStyle = stone.getStyle();
      ctx.fill();
      drawHexagonPath(ctx, cx, cy, inset * 0.82);
      ctx.strokeStyle = highlight.getStyle();
      ctx.lineWidth = 1.25;
      ctx.stroke();
    }
  }

  texture.needsUpdate = true;
  return texture;
}
