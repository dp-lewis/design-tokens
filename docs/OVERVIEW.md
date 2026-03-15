# Design Tokens — Proof of Concept

## What are design tokens?

Design tokens are **named design decisions stored as data**. Instead of hard-coding a hex color or a font size into a stylesheet, you give that value a meaningful name — like `color-primary` or `spacing-medium` — and store it in a central place.

Think of it this way: tokens are a **single source of truth for every brand's look and feel**. Designers decide the values, developers consume them, and every component reads from the same definition. When a value changes, it changes everywhere — no hunting through stylesheets, no copy-paste drift.

### Token layers

Token systems can have many layers — global, alias, component, variant — each adding a level of indirection and meaning. In practice, teams often introduce a **component token** layer between semantic and component consumption, so that a component like a button has its own named tokens (`--button-background`) that reference semantic tokens (`--color-action`), which in turn reference primitives. Some systems go further still.

For this demo, we use two layers to keep things clear:

- **Primitive tokens** hold raw values with no opinion about where they're used. They're the palette.
- **Semantic tokens** reference primitive tokens and assign meaning — they describe *what the value is for*, not what it is.

```css
/* Primitive token — a raw value */
--color-blue-800: #0A1E5C;

/* Semantic token — assigns purpose, references a primitive */
--tile-headline-color: var(--color-blue-800);
```

Components only use semantic tokens. This means a brand can change its headline color by pointing `tile-headline-color` at a different primitive token — no component code changes, and the intent remains clear.

## Why tokens matter for multi-brand publishers

### The problem

Large news publishers often operate multiple brand sites under one roof — think the *New York Times* and *The Athletic*, the *Guardian* and *Observer*, or *Der Spiegel* and *Manager Magazin*. Each brand carries its own visual identity, but they share components, infrastructure, and often the same development teams. When design values like colors, spacing, and typography are duplicated across brand codebases, problems emerge:

- **Inconsistency** — the same spacing scale defined slightly differently per brand
- **Slow updates** — changing a brand color means finding and replacing values across multiple files
- **Knowledge silos** — no shared vocabulary between designers and developers for referencing design decisions

### The solution

A shared set of **primitive tokens** defines structural decisions that all brands agree on (spacing scale, type scale, border radii, etc.). Each brand then applies **overrides** for the values that make it unique — primarily colors and typography.

### Concrete examples

**Primitive tokens** (shared raw values):

| Primitive Token     | Value     |
|---------------------|-----------|
| `color-blue-800`    | `#0A1E5C` |
| `color-neutral-900` | `#1A1A1A` |
| `color-teal-700`    | `#2A5A8C` |
| `spacing-sm`        | `8px`     |
| `spacing-md`        | `16px`    |
| `font-serif`        | `Georgia, serif` |
| `font-sans`         | `Arial, sans-serif` |

**Semantic tokens** (per-brand, referencing primitive tokens):

| Semantic Token            | Brand A (broadsheet)  | Brand B (tabloid)      | Brand C (financial)   |
|---------------------------|----------------------|-----------------------|----------------------|
| `tile-headline-color`     | `{color.blue.800}`   | `{color.neutral.900}` | `{color.teal.700}`   |
| `tile-headline-font`      | `{font.serif}`       | `{font.serif}`        | `{font.sans}`        |
| `tile-padding`            | `{spacing.md}`       | `{spacing.md}`        | `{spacing.sm}`       |

The component only ever references semantic tokens like `--tile-headline-color`. Each brand points that semantic token at whichever primitive token fits its identity. Changing a primitive value updates every brand that references it; changing a semantic mapping updates only that brand.

## What this PoC will demonstrate

The demo centres on a **story tile** — the card component that represents a story on a home page. It's a real, recognisable piece of UI that every brand uses, making it the ideal vehicle for showing what tokens can do.

### Level 1 — Semantic tokens change the look

A single piece of HTML for the story tile uses semantic CSS custom properties (`--tile-headline-font`, `--tile-background`, `--tile-accent-color`, etc.). By swapping which brand's token file is loaded, the same tile transforms to match each brand's visual identity — colors, typography, spacing — without changing a single line of HTML or component code.

### Level 2 — CSS Grid changes the layout

Each brand can also apply a CSS class that uses **CSS Grid** to reorder elements within the tile — for example, placing the image above the headline for one brand, beside it for another, or adjusting the prominence of the byline and timestamp. This demonstrates that tokens and utility classes together give brands full control over both **appearance** and **structure**, all from one HTML source.

### The side panel — independent controls

Next to the story tile, a **side panel** provides two separate controls:

1. **Brand tokens** — switch between brands (swaps the semantic token set → changes colors, typography, spacing)
2. **Layout** — switch between layout classes (swaps the CSS Grid rules → changes element order and placement)

These two controls operate **independently**. You can apply one brand's tokens with another brand's layout — any combination. This is the key insight: **tokens control appearance, CSS classes control structure**, and they compose freely because they're separate concerns.

Below the controls, the panel displays the active token chain for each styled property:

```
tile-headline-color        ← semantic token (what it's for)
  → color.blue.800         ← primitive token (what it references)
    → #0A1E5C              ← resolved value (editable)
```

Each resolved value is **editable inline** — color pickers for colors, text inputs for fonts/sizes, number inputs for spacing. Selecting a brand loads its defaults into these fields, but you can then tweak any individual value and see the tile update in real time. This makes the system something people can play with, not just observe. A reset button restores the selected brand's defaults.

When you switch brand tokens, the fields repopulate with that brand's values. When you switch layout, the tile rearranges but the token values stay the same — visually reinforcing the separation.

### In summary

- A small set of tokens (colors, typography, spacing) defined as CSS custom properties across two layers (primitive and semantic) — a simplification of real-world systems, chosen to keep the demo focused
- Brand-specific CSS files map semantic tokens to brand-appropriate primitive values
- A preview page renders the **same story tile HTML** with a side panel showing the active token chain, across 2–3 brands

## How it works

### Architecture

```
index.html                     ← single page: story tile + side panel
package.json                   ← npm scripts (dev server)
src/
  css/
    primitives.css             ← shared primitive tokens (colours, spacing, type)
    brands/
      broadsheet.css           ← Broadsheet semantic tokens + element ordering
      broadsheet-dark.css      ← Broadsheet dark mode colour overrides
      tabloid.css              ← Tabloid semantic tokens + element ordering
      tabloid-dark.css         ← Tabloid dark mode colour overrides
      financial.css            ← Financial semantic tokens + element ordering
      financial-dark.css       ← Financial dark mode colour overrides
    components/
      tile.css                 ← story tile styles (consumes semantic tokens)
      page.css                 ← page layout (tile + side panel)
      panel.css                ← side panel styles
    layouts/
      layout-stacked.css       ← vertical card layout
      layout-side.css          ← image left, text right
      layout-overlay.css       ← image full-bleed, text overlaid
  js/
    app.js                     ← switching logic + token inspector
```

No build tools, no preprocessors — just CSS files served by a local dev server via `npm start`.

### The CSS cascade — how switching works

The demo works entirely through the CSS cascade. The HTML includes a series of `<link>` stylesheet tags in a specific order, and JavaScript switches brands, modes, and layouts by changing which files are loaded:

```html
<!-- 1. Primitives — always loaded, defines raw values -->
<link rel="stylesheet" href="src/css/primitives.css">

<!-- 2. Brand — swappable, maps semantic tokens → primitives -->
<link rel="stylesheet" href="src/css/brands/broadsheet.css" id="brand-css">

<!-- 3. Dark mode — per-brand colour overrides, toggled via disabled attribute -->
<link rel="stylesheet" href="src/css/brands/broadsheet-dark.css" id="mode-css" disabled>

<!-- 4. Component styles — always loaded, consume semantic tokens -->
<link rel="stylesheet" href="src/css/components/tile.css">

<!-- 5. Layout — swappable, overrides component structure via CSS Grid -->
<link rel="stylesheet" href="src/css/layouts/layout-stacked.css" id="layout-css">
```

Each layer builds on the one before it:

1. **Primitives** define the raw palette (`--color-navy-900: #0a1633`)
2. **Brand** maps semantic names to primitives (`--heading-color: var(--color-navy-900)`)
3. **Dark mode** overrides colour semantics with dark-appropriate primitives (`--heading-color: var(--color-slate-100)`) — loaded after the brand file so it wins in the cascade
4. **Components** consume semantic tokens (`color: var(--heading-color)`) — they never reference primitives directly
5. **Layouts** override component structure (e.g. switching from flex column to CSS Grid) — loaded last so they can override component display properties

**Switching is just changing which file is loaded:**

- **Brand switch** → JS changes the `href` of `#brand-css` (e.g. `broadsheet.css` → `tabloid.css`) and updates `#mode-css` to the matching dark file
- **Dark mode toggle** → JS toggles the `disabled` attribute on `#mode-css`
- **Layout switch** → JS changes the `href` of `#layout-css` (e.g. `layout-stacked.css` → `layout-side.css`)

No styles are generated or manipulated by JavaScript. The browser's native cascade resolution handles everything — when a new stylesheet loads, the custom property values change, and every element that references them updates automatically.

The only exception is the token inspector's live editing feature, which applies inline style overrides on `:root` via `document.documentElement.style.setProperty()`. These override everything in the cascade (since inline styles have highest precedence) and are cleared when you reset or switch brands.

### Token layers in CSS

Primitive tokens define the raw palette in `:root`. Brand files then map semantic tokens to the appropriate primitive values:

```css
/* src/css/primitives.css */
:root {
  --color-navy-900: #0a1633;
  --font-playfair: "Playfair Display";
  --spacing-xl: 24px;
}

/* src/css/brands/broadsheet.css */
:root {
  --heading-color: var(--color-navy-900);
  --heading-font: var(--font-playfair);
  --space-loose: var(--spacing-xl);
}

/* src/css/components/tile.css */
.story-tile__headline {
  color: var(--heading-color);
  font-family: var(--heading-font);
}
```

Components only reference semantic tokens like `var(--heading-color)`. Switching brand swaps which semantic-to-primitive mappings are active. The component CSS never changes.
