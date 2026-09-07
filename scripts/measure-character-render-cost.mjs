/**
 * Measure character render-cost console logs via Playwright (no TEST_MODE).
 *
 * Usage (dev server running on :5173):
 *   node scripts/measure-character-render-cost.mjs Toa_Tahu
 *   node scripts/measure-character-render-cost.mjs Toa_Tahu --webgl
 *
 * Compare branches:
 *   yarn build && yarn preview --port 5173 --host 0.0.0.0 &
 *   node scripts/measure-character-render-cost.mjs Toa_Tahu --webgl
 */
import { chromium } from 'playwright';

const BASE_URL = process.env.MEASURE_BASE_URL ?? 'http://localhost:5173/BionicleIdleRPG';
const CHARACTER_ID = process.argv[2] ?? 'Toa_Tahu';
const FORCE_WEBGL = process.argv.includes('--webgl');

const GAME_STATE = {
  version: 2,
  protodermis: 0,
  protodermisCap: 2000,
  recruitedCharacters: [{ id: CHARACTER_ID, exp: 0 }],
  customCharacters: [],
  rahkshi: [],
  activeQuests: [],
  completedQuests: [],
  collectedKrana: {},
  kraataCollection: {},
};

const SWIFT_SHADER_ARGS = [
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
];

async function measure() {
  const browser = await chromium.launch({
    headless: true,
    args: SWIFT_SHADER_ARGS,
  });

  const page = await browser.newPage();
  const renderCostLogs = [];
  const backendLogs = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('render cost:')) renderCostLogs.push(text);
    if (text.includes('[webgpuRenderer]')) backendLogs.push(text);
  });

  await page.addInitScript(
    ({ forceWebGL, state }) => {
      localStorage.setItem('GAME_STATE', JSON.stringify(state));
      localStorage.setItem('TELEMETRY_CONSENT', JSON.stringify({ consented: false, version: 1 }));
      localStorage.setItem('E2E_FORCE_GAME_STATE_IMPORT', 'true');
      if (forceWebGL) localStorage.setItem('FORCE_WEBGL', 'true');
    },
    { forceWebGL: FORCE_WEBGL, state: GAME_STATE }
  );

  const url = `${BASE_URL}/characters/${CHARACTER_ID}`;
  console.log(`Measuring ${CHARACTER_ID} at ${url} (forceWebGL=${FORCE_WEBGL})`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForFunction(
      () =>
        performance
          .getEntriesByType('resource')
          .some((entry) => entry.name.includes('tahu.glb') || entry.name.includes('kit_2001')),
      { timeout: 90_000 }
    );
    await page.waitForTimeout(8_000);
  } catch (error) {
    console.error('Navigation or load failed:', error);
  }

  const backend = await page.evaluate(() => {
    const canvas = document.querySelector('canvas.shared-canvas');
    const gl = canvas?.__r3f?.root?.getState?.()?.gl;
    const isWebGL = !!gl?.backend?.isWebGLBackend || typeof gl?.getContext === 'function';
    return isWebGL ? 'WebGL' : 'WebGPU';
  });

  await browser.close();

  console.log('\n--- Results ---');
  console.log(`Backend: ${backend}`);
  if (backendLogs.length > 0) console.log('Renderer notes:', backendLogs.join(' | '));
  if (renderCostLogs.length === 0) {
    console.log('No render cost log captured (WebGL may not have initialized in this VM).');
    process.exitCode = 1;
    return;
  }
  for (const line of renderCostLogs) console.log(line);
}

measure();
