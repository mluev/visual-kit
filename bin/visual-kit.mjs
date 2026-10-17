#!/usr/bin/env node
// npx visual-kit init [dir] [--force] [--no-examples]: copy the kit into a folder. No dependencies.
import { existsSync, mkdirSync, copyFileSync, cpSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve } from 'node:path';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const pos = args.filter((a) => !a.startsWith('--'));
const version = JSON.parse(readFileSync(join(dist, '..', 'package.json'), 'utf8')).version;

const help = `visual-kit ${version}

  npx visual-kit init [dir]   copy the kit into dir (default ./visual-kit)
      --force                 overwrite files that already exist
      --no-examples           skip the examples folder

Copies visual-kit.js, visual-kit.css, viewer.html and KIT.md (the cheat sheet your AI reads).
No Node is needed to use the kit itself: open any HTML file that links visual-kit.js.`;

if (pos[0] !== 'init' || flags.has('--help')) {
  console.log(help);
  process.exit(pos[0] === 'init' || !pos.length ? 0 : 1);
}

const target = resolve(pos[1] || 'visual-kit');
const names = ['visual-kit.js', 'visual-kit.css', 'viewer.html', 'KIT.md'];
const clash = names.filter((n) => existsSync(join(target, n)));
if (clash.length && !flags.has('--force')) {
  console.error(`Not overwriting: ${clash.join(', ')} already in ${target}. Use --force to replace.`);
  process.exit(1);
}
mkdirSync(target, { recursive: true });
for (const n of names) copyFileSync(join(dist, n), join(target, n));
if (!flags.has('--no-examples')) cpSync(join(dist, 'examples'), join(target, 'examples'), { recursive: true });
console.log(`visual-kit ${version} copied to ${target}\nTell your AI: "use visual-kit, see ${join(target, 'KIT.md')}"`);
