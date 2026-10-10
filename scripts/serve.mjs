import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
const root = resolve('dist');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.pdf':'application/pdf','.xml':'application/xml'};
createServer(async (req,res) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (path !== root && !path.startsWith(root+sep)) {res.writeHead(403).end();return;}
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    res.writeHead(200,{'Content-Type':mime[extname(path)] || 'application/octet-stream'}).end(await readFile(path));
  } catch {res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(await readFile(resolve(root,'404.html')));}
}).listen(4321,'127.0.0.1',() => console.log('Preview: http://localhost:4321 (re-run build after edits)'));
