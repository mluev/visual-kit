// Copies the kit from its single source of truth (the skill's lite/ folder) into dist/ for npm.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'skills', 'visual-kit', 'lite');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const f of ['visual-kit.js', 'visual-kit.css', 'viewer.html', 'KIT.md']) cpSync(join(src, f), join(dist, f));
cpSync(join(src, 'examples'), join(dist, 'examples'), { recursive: true });
console.log('dist/ built from skills/visual-kit/lite');
