// Simple static server for SECOND GLANCE
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, normalize, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const gameRoot = join(__dirname, 'game');

const mimeMap: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

function getMime(filePath: string): string {
  const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
  return mimeMap[ext] || 'application/octet-stream';
}

const server = createServer(async (req, res) => {
  try {
    const rawPath = new URL(req.url ?? '/', 'http://localhost').pathname;
const urlPath = rawPath === '/' ? '/index.html' : decodeURIComponent(rawPath);
    const safePath = normalize(join(gameRoot, urlPath));
    if (!safePath.startsWith(gameRoot)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    let filePath = safePath;
    const stat = await (await import('fs')).promises.stat(filePath).catch(() => null);
    if (!stat) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    if (stat.isDirectory()) {
      filePath = join(filePath, 'index.html');
    }
    const data = await readFile(filePath);
    res.setHeader('Content-Type', getMime(filePath));
    res.end(data);
  } catch (e) {
    res.statusCode = 500;
    res.end('Server error');
  }
});

server.listen(8080, () => {
  console.log('Static server listening on http://localhost:8080');
});
/*
Design notes:
- Serves static files from the game directory on port 8080.
- Enforces path safety and proper MIME types.
*/
