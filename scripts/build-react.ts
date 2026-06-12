// bun run build:react —— React ESM + 类型声明
import { $ } from 'bun';

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
console.log('react build → dist/react/{index.mjs,index.d.ts}');
