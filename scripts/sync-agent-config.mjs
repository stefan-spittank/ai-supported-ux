#!/usr/bin/env node
/**
 * sync-agent-config.mjs
 *
 * Kopiert alle Dateien aus agent-config/ in die Tool-spezifischen Verzeichnisse
 * .claude/ und .opencode/, die in .gitignore ausgeschlossen sind und
 * ausschließlich über dieses Skript befüllt werden.
 *
 * Verwendung: npm run sync-agent-config
 */

import { cpSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const MAPPINGS = [
  // Agents
  { src: 'agent-config/agents', dst: '.claude/agents' },
  { src: 'agent-config/agents', dst: '.opencode/agents' },

  // // Skills
  // { src: 'agent-config/skills', dst: '.claude/skills' },
  // { src: 'agent-config/skills', dst: '.opencode/skills' },
  //
  // // Scripts
  // { src: 'agent-config/scripts', dst: '.claude/scripts' },
  // { src: 'agent-config/scripts', dst: '.opencode/scripts' },
  //
  // // Commands
  // { src: 'agent-config/command', dst: '.opencode/command' },
];

let hasError = false;

for (const { src, dst } of MAPPINGS) {
  const srcPath = resolve(ROOT, src);
  const dstPath = resolve(ROOT, dst);

  try {
    mkdirSync(dstPath, { recursive: true });
    cpSync(srcPath, dstPath, { recursive: true });
    console.log(`✓  ${src}  →  ${dst}`);
  } catch (err) {
    console.error(`✗  ${src}  →  ${dst}: ${err.message}`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('\nSync abgeschlossen.');
}
