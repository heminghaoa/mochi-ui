# 🏝️ Pokoland UI

English | **[简体中文](README.zh-CN.md)** | **[日本語](README.ja.md)**

> A cozy, sticker-style UI kit. Round, squishy, and it goes "boop" when you press it.

**Framework-agnostic** — drop the CSS into React / Next.js / anything.

![status](https://img.shields.io/badge/status-v0.2_sprouting-FFD66B)
![license](https://img.shields.io/badge/license-MIT-8FD178)
![deps](https://img.shields.io/badge/dependencies-zero-8FD178)

**Live demo:** https://heminghaoa.github.io/pokoland-ui/demo/ (switch 中 / EN / 日 in the top-right corner)

![Pokoland UI](docs/assets/hero-en.png)

## ✨ What is this

A sticker-aesthetic web UI kit inspired by cozy life-sim games:

- **Thick white outlines** — every component looks like a cut-out sticker
- **Inflated push feel** — buttons have physical depth and actually sink when pressed
- **Sunny meadow palette** — sky blue / meadow green / cream / butter / coral
- **Checker-grass & tile-quilt motifs** — the page sits in a tiny handcrafted world
- **Original icon set (Pokoland Icons)** — 25 hand-drawn SVG symbols, zero emoji in UI
- **Trilingual demo** — Chinese / English / Japanese, switchable live

## 🚀 Quick start

Zero dependencies. Clone and open:

```bash
git clone https://github.com/heminghaoa/pokoland-ui.git
open pokoland-ui/demo/index.html        # or: bun run dev
```

Use the library in your own page:

```html
<link rel="stylesheet" href="pokoland.css">   <!-- from dist/ after `bun run build` -->
<script src="pokoland.js"></script>           <!-- optional: toast / tabs / dialog / i18n -->
<!-- icons: inline the contents of icons.svg once, then -->
<svg class="mi"><use href="#pi-leaf"/></svg>
```

All design tokens live in `:root` CSS variables — change one line to retheme.

## 🧰 Toolchain

Built with [Bun](https://bun.sh) (dev server / build), but the **output is plain CSS + JS** — consumers need nothing.

| command | what it does |
|---------|--------------|
| `bun run dev` | static server at `localhost:4178` |
| `bun run check` | zero-emoji scan + i18n key coverage |
| `bun run build` | sync icons into demo + minify to `dist/` |

## ⚖️ Name, inspiration & IP

The name **Pokoland** comes from the Japanese onomatopoeia *poko-poko* (ぽこぽこ) — the soft "boop" a squishy button makes. The cozy mood is inspired by cozy life-sim games, particularly *Pokémon Pokopia*. All designs, colors, characters, icons and copy are **original**. Pokoland UI is an unofficial fan-spirited project: not affiliated with, endorsed by, or associated with Nintendo or The Pokémon Company, and it contains no official assets. Contributions must follow the same rule.

## 📄 License

[MIT](LICENSE) © 2026 Pokoland UI Contributors
