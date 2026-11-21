// SECOND GLANCE hand‑in program
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { buildDossier } from './vendor/makefun-game.ts';

async function copyRecursive(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  // copy game and screenshots directories
  await copyRecursive(join(__dirname, 'game'), join(outDir, 'game'));
  await copyRecursive(join(__dirname, 'screenshots'), join(outDir, 'screenshots'));
  // write dossier.json with required caps
  const caps = {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  };
  const dossier = buildDossier(__dirname, caps as any);
  await fs.writeFile(join(outDir, "dossier.json"), dossier);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
/*
Design notes:
- This hand‑in program copies assets and writes dossier.json.
- Uses only Node standard library.
*/
