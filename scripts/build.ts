// bun run build —— ① icons 同步进 demo ② 产出 dist/(外部使用者引入;demo 不依赖)
import { $ } from 'bun';
import { mkdirSync, rmSync } from 'node:fs';

const icons = (await Bun.file('src/icons.svg').text()).trim();
const demoPath = 'demo/index.html';
let demo = await Bun.file(demoPath).text();
const re = /(<!-- ICONS:BEGIN[^>]*-->)[\s\S]*?(<!-- ICONS:END -->)/;
if (!re.test(demo)) { console.error('demo 缺少 ICONS 标记'); process.exit(1); }
demo = demo.replace(re, `$1\n${icons}\n$2`);
await Bun.write(demoPath, demo);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');

const js = await Bun.build({ entrypoints: ['src/pokoland.js'], minify: true });
if (!js.success) { console.error('JS 构建失败', js.logs); process.exit(1); }
await Bun.write('dist/pokoland.js', await js.outputs[0].text());

try {
  const css = await Bun.build({ entrypoints: ['src/pokoland.css'], minify: true });
  if (!css.success) throw new Error('CSS build returned success: false');
  await Bun.write('dist/pokoland.css', await css.outputs[0].text());
} catch {
  await Bun.write('dist/pokoland.css', await Bun.file('src/pokoland.css').text());
  console.warn('当前 Bun 版本不支持 CSS 构建,dist/pokoland.css 为未压缩副本');
}
await Bun.write('dist/icons.svg', icons);
const react = await $`bun run scripts/build-react.ts`.nothrow();
if (react.exitCode !== 0) process.exit(1);
const site = await $`bun run scripts/build-site.ts`.nothrow();
if (site.exitCode !== 0) process.exit(1);
console.log('build 完成 → dist/ + site/ + pages-dist/');
