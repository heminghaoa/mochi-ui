// bun run dev —— 零依赖静态服务,根路径跳 demo
const root = process.cwd();
Bun.serve({
  port: 4178,
  async fetch(req) {
    let path = decodeURIComponent(new URL(req.url).pathname);
    if (path === '/') path = '/demo/';
    if (path.endsWith('/')) path += 'index.html';
    const file = Bun.file(root + path);
    return (await file.exists()) ? new Response(file) : new Response('Not found', { status: 404 });
  },
});
console.log('Pokoland dev → http://localhost:4178');
