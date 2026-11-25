// Pro Fitness Studio website server: clean URLs (no .html in links), static files, 404 page.
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = process.env.PORT || 6200;
const ROOT = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2', '.mp4': 'video/mp4'
};

function send(res, file, status = 200) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(status, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { p = '/'; }
  // /menu.html -> /menu (keep links clean)
  // same paths as on GitHub Pages (site lives under /pro-fitness-studio/ there)
  if (p.startsWith('/pro-fitness-studio/')) p = p.slice('/pro-fitness-studio'.length);
  if (p.endsWith('.html')) {
    const clean = p.replace(/(index)?\.html$/, '') || '/';
    res.writeHead(301, { Location: clean }); return res.end();
  }
  if (p.length > 1 && p.endsWith('/')) { res.writeHead(301, { Location: p.slice(0, -1) }); return res.end(); }
  const safe = path.normalize(p).replace(/^([\\/]|\.\.)+/, '');
  const tries = [path.join(ROOT, safe), path.join(ROOT, safe + '.html'), path.join(ROOT, safe, 'index.html')];
  for (const f of tries) {
    if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile()) return send(res, f);
  }
  send(res, path.join(ROOT, '404.html'), 404);
}).listen(PORT, () => console.log(`Pro Fitness Studio running at http://localhost:${PORT}`));
