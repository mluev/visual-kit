// Smoke test: build dist, run the CLI into a temp folder, check files and the no-overwrite guard.
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

execFileSync('node', ['scripts/build-dist.mjs'], { stdio: 'inherit' });
const dir = join(mkdtempSync(join(tmpdir(), 'vk-')), 'kit');
execFileSync('node', ['bin/visual-kit.mjs', 'init', dir], { stdio: 'inherit' });
for (const f of ['visual-kit.js', 'visual-kit.css', 'viewer.html', 'KIT.md', 'examples/message.html']) assert(existsSync(join(dir, f)), `missing ${f}`);
assert.equal(readFileSync(join(dir, 'visual-kit.js'), 'utf8'), readFileSync('skills/visual-kit/lite/visual-kit.js', 'utf8'), 'dist differs from source');
const again = spawnSync('node', ['bin/visual-kit.mjs', 'init', dir]);
assert.equal(again.status, 1, 'second init must refuse to overwrite');
execFileSync('node', ['bin/visual-kit.mjs', 'init', dir, '--force'], { stdio: 'ignore' });
console.log('package OK');
