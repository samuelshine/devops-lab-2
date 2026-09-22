/**
 * Minimal build step: copies the source tree into dist/ and writes a
 * build manifest. Enough to show a real artifact moving between CI jobs.
 */
import { mkdir, rm, cp, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(resolve(root, 'src'), resolve(dist, 'src'), { recursive: true });

const manifest = {
  name: pkg.name,
  version: pkg.version,
  builtAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA ?? 'local',
  runNumber: process.env.GITHUB_RUN_NUMBER ?? 'local',
  node: process.version
};

await writeFile(resolve(dist, 'build-info.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log('Build complete ->', dist);
console.log(JSON.stringify(manifest, null, 2));
