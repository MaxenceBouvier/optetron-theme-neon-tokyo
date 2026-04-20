# Neon Tokyo — Design System

A cyberpunk / neo-Tokyo aesthetic, extracted from the **Mission Control** frontend. Portable across any project — Tailwind v4, shadcn, or plain CSS.

---

## The aesthetic in one sentence

A dark ink-blue terminal, lit by **hot magenta** and **cyan** neon, dusted with a subtle pink dot-grid, and typeset in **Sora / Inter / Space Grotesk** — display, body, and uppercase labels respectively.

> Think: a clean operator dashboard on the wall of a 2077 noodle bar. Data-dense but never loud. Glow is earned, not default.

---

## Folder layout

```
neon-tokyo/
├── index.css              ← barrel — import this for everything
├── README.md              ← you are here
├── Design System.html     ← visual catalog — open in a browser
└── styles/
    ├── fonts.css          ← Google Fonts @import
    ├── typography.css     ← font-family tokens
    ├── colors.css         ← brand palette + surface ladder + glow rgba
    ├── semantics.css      ← role aliases (foreground/border/ring/...)
    ├── radii.css          ← radius scale
    ├── base.css           ← body bg + dot-grid overlay
    ├── glow.css           ← text/border/dot glow utilities
    ├── effects.css        ← scanline + custom scrollbar
    ├── ambient.css        ← floating blurred color orbs (background atmosphere)
    └── components/
        ├── button.css     ← optional .ntk-btn presets
        ├── badge.css      ← .ntk-badge + .ntk-dot
        ├── card.css       ← .ntk-card variants
        └── input.css      ← .ntk-input + .ntk-label
```

Each file is single-purpose. Import the whole thing via `index.css`, or cherry-pick modules.

---

## Quick start

### Tailwind v4 project

```css
/* src/index.css */
@import "tailwindcss";
@import "./neon-tokyo/index.css";
```

Tokens become Tailwind utilities automatically: `bg-primary`, `text-secondary`, `border-outline-variant`, `font-headline`, `font-label`, etc.

### Plain HTML / non-Tailwind project

```html
<link rel="stylesheet" href="neon-tokyo/index.css">

<h1 style="color: var(--primary); font-family: var(--font-headline);">
  Mission Control
</h1>

<button class="ntk-btn ntk-btn-primary">Launch</button>
```

Every token is also exposed as a plain CSS variable on `:root` so it works without Tailwind. The `.ntk-*` component presets (button, badge, card, input) give you ready-made classes.

### shadcn/ui

Drop-in theme. The semantic aliases in `styles/semantics.css` (`--color-foreground`, `--color-border`, `--color-ring`, etc.) map 1:1 to what shadcn primitives expect. Point `components.json`'s `css` field at `neon-tokyo/index.css` and `npx shadcn@latest add <primitive>` just works.

If you're using shadcn, you can skip the `styles/components/*` imports — shadcn primitives already consume the tokens.

---

## Tokens at a glance

### Color

| Token | Hex | Role |
|---|---|---|
| `primary` | `#ff2d78` | Hot magenta — brand, primary actions, focus ring, nav active |
| `secondary` | `#00ffcc` | Cyan — online/success, live sessions, positive progress |
| `tertiary` | `#ffe04a` | Acid yellow — warning, "waiting for input" states |
| `background` | `#0a0a12` | Page base — a very dark ink blue |
| `surface` | `#0f0f1a` | Card / panel |
| `surface-container` | `#141422` | Raised surface, input fill |
| `surface-container-high` | `#1e1e30` | Popovers, dropdowns, active row |
| `outline-variant` | `#302840` | Dividers, quiet borders |
| `foreground` | `#e2e8f0` | Body text (slate-200) |
| `muted-foreground` | `#94a3b8` | Secondary text (slate-400) |
| `destructive` | `#ef4444` | Errors, crashed state |

> **Rule:** never hardcode these hex values in components. Always go through tokens.

### Typography

| Token | Family | Use for |
|---|---|---|
| `font-headline` | **Sora** 400/600/700/800 | H1–H3, logos, hero numbers |
| `font-body` | **Inter** 400/500/600 | Paragraphs, UI copy, buttons |
| `font-label` | **Space Grotesk** 400/500/700 | Uppercase labels, status pills, metadata. Track out (`0.15em`) and size small (10–11px) |

**Signature label recipe** — used everywhere in the reference app:

```html
<p class="text-[10px] font-label font-bold uppercase tracking-widest text-secondary">
  Live Sessions
</p>
```

### Glow utilities

Four restrained levels. Rule: glow on text **or** border, never both on the same element.

```html
<!-- Soft text glow for section accents -->
<span class="glow-text-primary">ONLINE</span>

<!-- Hero text glow — logo / page title only -->
<h1 class="glow-text-primary-strong">Mission Control</h1>

<!-- Box glow for active panels -->
<div class="glow-border-primary">…</div>

<!-- Status dot with halo -->
<span class="w-2 h-2 rounded-full bg-secondary glow-dot-secondary"></span>
```

### Decorative layers

- **Dot-grid background** — applied automatically to `<body>` via `base.css`.
- **Scanline overlay** — add `class="scanline"` for a subtle CRT feel.
- **Edge glow** — `class="edge-glow-right"` gives a sidebar an inner magenta right edge.
- **Thin neon scrollbar** — add `class="custom-scrollbar"` to any overflow container.
- **Ambient orbs** — drop a `<div class="ntk-ambient">` at the root for slow-drifting blurred color orbs in the three brand hues. See `styles/ambient.css` for orb variants (`-primary` / `-secondary` / `-tertiary` / `-primary-echo`), size modifiers (`-sm` / `-lg`), intensity (`data-intensity="soft|bold"`), and per-orb `--delay` staggering. Wrap your content in `class="ntk-on-ambient"` so it sits above the layer. Respects `prefers-reduced-motion`.

---

## Component recipes

### Status pill

```html
<div class="flex items-center gap-2 px-3 py-1 rounded-full border
            bg-secondary/10 text-secondary border-secondary/20
            text-[10px] font-label font-bold uppercase tracking-wider">
  <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
  System: Online
</div>
```

### Nav item (active)

```html
<a class="flex items-center gap-3 px-4 py-3 text-xs font-headline font-bold
          uppercase tracking-wider
          text-primary bg-primary/10
          border-r-2 border-primary glow-nav-active">
  <Icon size="16" /> Dashboard
</a>
```

### Progress bar (neon gradient)

```html
<div class="h-1.5 bg-surface-container rounded-full overflow-hidden">
  <div class="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
       style="width: 64%"></div>
</div>
```

### Card (default / active)

```html
<div class="p-3 rounded-md hover:bg-surface-container">…</div>
<div class="p-3 rounded-md bg-surface-container-high border border-outline-variant">…</div>
```

### Headline with glow

```html
<h1 class="text-xl font-black text-primary glow-text-primary-strong font-headline">
  Mission Control
</h1>
<p class="text-[10px] font-label font-bold uppercase tracking-widest text-muted-foreground mt-1">
  AI Agent Nexus
</p>
```

---

## Do's and don'ts

**Do**

- Let the dark base breathe. Panels should feel like cutouts in the darkness, not stacked boxes.
- Use `primary` (magenta) sparingly — for brand, focus, and the one most important action in a frame.
- Reserve `secondary` (cyan) for live / healthy / positive meanings. Reserve `tertiary` (yellow) for waiting / warning. Keep this consistent.
- Track out uppercase labels in `font-label`. It's the system's connective tissue.
- Fade non-hero surfaces to `surface` or `surface-container`. Only elevate to `surface-container-high` when something is active.

**Don't**

- Don't paint large surfaces in `primary` or `secondary` — they're accents, not fills.
- Don't stack multiple glows on one element. Text glow OR border glow, not both.
- Don't use pure white (`#fff`) for body text — use `foreground` (slate-200).
- Don't introduce new brand colors without adding them as tokens first.
- Don't hardcode hex values in components.

---

## Extending the system

Adding a token? Put it in the right module:

| Adding… | Goes in |
|---|---|
| New brand color | `styles/colors.css` + alias in `styles/semantics.css` if it has a role |
| New font family | `styles/fonts.css` (the @import) + `styles/typography.css` (the token) |
| New radius | `styles/radii.css` |
| New glow flavor | `styles/glow.css` |
| New `.ntk-*` component class | new file in `styles/components/` + import in `index.css` |

Keep component-level CSS out of the token files, and keep tokens out of the base layer. The separation is what keeps the system portable.
