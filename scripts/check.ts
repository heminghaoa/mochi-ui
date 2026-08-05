// bun run check —— ① UI 零 emoji ② i18n 键完整性(demo 用键 ⊆ 词典)
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;
let failed = false;

const html = await Bun.file('demo/index.html').text();
function scanEmoji(path: string, source: string) {
  source.split('\n').forEach((line, i) => {
    const hits = line.match(emojiRe);
    if (hits) { failed = true; console.error(`${path}:${i + 1} emoji: ${[...new Set(hits)].join(' ')}`); }
  });
}

scanEmoji('demo/index.html', html);
for await (const path of new Bun.Glob('docs-site/**/*.{ts,tsx,html}').scan('.')) {
  scanEmoji(path, await Bun.file(path).text());
}

const used = new Set<string>();
for (const m of html.matchAll(/data-i18n(?:-html|-ph|-aria)?="(\w+)"/g)) used.add(m[1]);
for (const m of html.matchAll(/T\('(\w+)'\)/g)) used.add(m[1]);

// 词典两种形态都支持:拆分前 const I18N = {...};拆分后 window.POKOLAND_I18N = {...}
const dictMatch = html.match(/(?:const I18N|window\.POKOLAND_I18N)\s*=\s*\{([\s\S]*?)\n\};/);
if (!dictMatch) { console.error('未找到 i18n 词典'); process.exit(1); }
const dict = new Set<string>();
for (const m of dictMatch[1].matchAll(/^\s*(\w+):\s*\[/gm)) dict.add(m[1]);

const missing = [...used].filter(k => !dict.has(k));
const unused = [...dict].filter(k => !used.has(k) && k !== 'title');
if (missing.length) { failed = true; console.error('词典缺键:', missing.join(', ')); }
if (unused.length) console.warn('警告·词典未使用键:', unused.join(', '));

if (failed) process.exit(1);
console.log(`check 通过:demo/docs 0 emoji;i18n 用键 ${used.size},词典 ${dict.size}`);
