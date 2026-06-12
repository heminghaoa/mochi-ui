// bun run build —— ① icons 同步进 demo ② 产出 dist/(外部使用者引入;demo 不依赖)
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

const js = await Bun.build({ entrypoints: ['src/mochi.js'], minify: true });
if (!js.success) { console.error('JS 构建失败', js.logs); process.exit(1); }
await Bun.write('dist/mochi.js', await js.outputs[0].text());

try {
  const css = await Bun.build({ entrypoints: ['src/mochi.css'], minify: true });
  if (!css.success) throw new Error('CSS build returned success: false');
  await Bun.write('dist/mochi.css', await css.outputs[0].text());
} catch {
  await Bun.write('dist/mochi.css', await Bun.file('src/mochi.css').text());
  console.warn('当前 Bun 版本不支持 CSS 构建,dist/mochi.css 为未压缩副本');
}
await Bun.write('dist/icons.svg', icons);
console.log('build 完成 → dist/{mochi.css,mochi.js,icons.svg}');
