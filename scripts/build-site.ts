// bun run build:site — documentation app + minimal GitHub Pages artifact
import { $ } from 'bun';
import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';

const typecheck = await $`bun x tsc -p tsconfig.site.json`.nothrow();
if (typecheck.exitCode !== 0) {
  console.error('docs site typecheck failed');
  process.exit(1);
}

rmSync('site', { recursive: true, force: true });
rmSync('pages-dist', { recursive: true, force: true });
mkdirSync('site', { recursive: true });

const app = await Bun.build({
  entrypoints: ['docs-site/main.tsx'],
  outdir: 'site',
  format: 'esm',
  target: 'browser',
  minify: true,
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  naming: { entry: 'app.[ext]' },
});
if (!app.success) {
  console.error('docs app build failed', app.logs);
  process.exit(1);
}

for (const entrypoint of ['src/pokoland.css', 'docs-site/styles.css']) {
  const css = await Bun.build({
    entrypoints: [entrypoint],
    outdir: 'site',
    minify: true,
  });
  if (!css.success) {
    console.error(`docs CSS build failed: ${entrypoint}`, css.logs);
    process.exit(1);
  }
}

copyFileSync('docs-site/index.html', 'site/index.html');

mkdirSync('pages-dist/src', { recursive: true });
copyFileSync('index.html', 'pages-dist/index.html');
cpSync('site', 'pages-dist/site', { recursive: true });
cpSync('demo', 'pages-dist/demo', { recursive: true });
copyFileSync('site/pokoland.css', 'pages-dist/src/pokoland.css');

const vanilla = await Bun.build({
  entrypoints: ['src/pokoland.js'],
  outdir: 'pages-dist/src',
  minify: true,
});
if (!vanilla.success) {
  console.error('Pages vanilla build failed', vanilla.logs);
  process.exit(1);
}

for (const required of [
  'site/index.html',
  'site/app.js',
  'site/pokoland.css',
  'site/styles.css',
  'pages-dist/index.html',
  'pages-dist/demo/index.html',
]) {
  if (!existsSync(required)) {
    console.error(`missing site build artifact: ${required}`);
    process.exit(1);
  }
}

console.log('docs site build → site/; Pages artifact → pages-dist/');
