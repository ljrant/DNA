import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer(async(req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const full = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!(full === root || full.startsWith(root + sep))) {res.writeHead(403);res.end('Forbidden');return;}
    const content = await readFile(full);
    res.writeHead(200, {'Content-Type': mime[extname(full)] || 'application/octet-stream','Cache-Control':'no-cache'});res.end(content);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,()=>console.log('DNA Builder Lab: http://localhost:'+port));
