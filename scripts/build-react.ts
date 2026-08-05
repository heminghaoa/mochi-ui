// bun run build:react —— React ESM + 类型声明
import { $ } from 'bun';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';

/* ── Step 0: generate sprite.generated.ts from src/icons.svg ── */
{
  const svgRaw = readFileSync('src/icons.svg', 'utf8');
  // Escape backticks and template literal interpolation markers for embedding in a template literal
  const escaped = svgRaw.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  const generated =
    `/* AUTO-GENERATED from src/icons.svg by scripts/build-react.ts — do not edit */\n` +
    `export const SPRITE: string = \`${escaped}\`;\n`;
  const outPath = 'src/react/sprite.generated.ts';
  const existing = existsSync(outPath) ? readFileSync(outPath, 'utf8') : '';
  if (existing !== generated) {
    writeFileSync(outPath, generated, 'utf8');
    console.log('sprite.generated.ts updated');
  } else {
    console.log('sprite.generated.ts unchanged');
  }
}

const result = await Bun.build({
  entrypoints: ['src/react/index.ts'],
  outdir: 'dist/react',
  format: 'esm',
  minify: true,
  naming: '[dir]/index.mjs',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
if (!result.success) { console.error(result.logs); process.exit(1); }

const tsc = await $`bun x tsc -p tsconfig.json`.nothrow();
if (tsc.exitCode !== 0) { console.error('tsc declaration build failed'); process.exit(1); }

const extensionlessImports: string[] = [];
for (const file of readdirSync('dist/react').filter((name) => name.endsWith('.d.ts'))) {
  const declaration = readFileSync(`dist/react/${file}`, 'utf8');
  for (const match of declaration.matchAll(/(?:from\s+|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g)) {
    if (!/\.(?:js|mjs|cjs|json)$/.test(match[1])) extensionlessImports.push(`${file}: ${match[1]}`);
  }
}
if (extensionlessImports.length) {
  console.error('ESM declaration imports require runtime extensions:\n' + extensionlessImports.join('\n'));
  process.exit(1);
}
console.log('react build → dist/react/{index.mjs,index.d.ts}');
