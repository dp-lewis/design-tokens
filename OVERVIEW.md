# Design Tokens — Proof of Concept

## What are design tokens?

Design tokens are **named design decisions stored as data**. Instead of hard-coding a hex color or a font size into a stylesheet, you give that value a meaningful name — like `color-primary` or `spacing-medium` — and store it in a central place.

Think of it this way: tokens are a **single source of truth for every brand's look and feel**. Designers decide the values, developers consume them, and every component reads from the same definition. When a value changes, it changes everywhere — no hunting through stylesheets, no copy-paste drift.

### Primitive tokens vs semantic tokens

Tokens work in two layers:

- **Primitive tokens** hold raw values with no opinion about where they're used. They're the palette.
- **Semantic tokens** reference primitive tokens and assign meaning — they describe *what the value is for*, not what it is.

```css
/* Primitive token — a raw value */
--color-blue-800: #0A1E5C;

/* Semantic token — assigns purpose, references a primitive */
--tile-headline-color: var(--color-blue-800);
```

Components only use semantic tokens. This means a brand can change its headline color by pointing `tile-headline-color` at a different primitive token — no component code changes, and the intent remains clear.

## Why tokens matter for Nine

### The problem

Nine operates multiple brand sites — **SMH**, **The Age**, **Brisbane Times**, **WA Today**, **nine.com.au**, and **AFR** — each with its own visual identity. Today, design values like colors, spacing, and typography are duplicated across brand codebases. This leads to:

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

| Semantic Token            | SMH                  | The Age               | AFR                  |
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

1. **Brand tokens** — switch between SMH, The Age, AFR (swaps the semantic token set → changes colors, typography, spacing)
2. **Layout** — switch between layout classes (swaps the CSS Grid rules → changes element order and placement)

These two controls operate **independently**. You can apply SMH's tokens with AFR's layout, or The Age's tokens with SMH's layout — any combination. This is the key insight: **tokens control appearance, CSS classes control structure**, and they compose freely because they're separate concerns.

Below the controls, the panel displays the active token chain for each styled property:

```
tile-headline-color        ← semantic token (what it's for)
  → color.blue.800         ← primitive token (what it references)
    → #0A1E5C              ← resolved value (editable)
```

Each resolved value is **editable inline** — color pickers for colors, text inputs for fonts/sizes, number inputs for spacing. Selecting a brand loads its defaults into these fields, but you can then tweak any individual value and see the tile update in real time. This makes the system something people can play with, not just observe. A reset button restores the selected brand's defaults.

When you switch brand tokens, the fields repopulate with that brand's values. When you switch layout, the tile rearranges but the token values stay the same — visually reinforcing the separation.

### In summary

- A small set of tokens (colors, typography, spacing) defined as CSS custom properties at two layers: primitive and semantic
- Brand-specific CSS files map semantic tokens to brand-appropriate primitive values
- A preview page renders the **same story tile HTML** with a side panel showing the active token chain, across 2–3 brands

## How it works

### Architecture

```
css/
  primitives.css       ← shared primitive tokens (colors, spacing, type)
  brands/
    smh.css            ← SMH semantic tokens (reference primitives)
    theage.css         ← The Age semantic tokens
    afr.css            ← AFR semantic tokens
  layouts/
    layout-a.css       ← CSS Grid layout variant A
    layout-b.css       ← CSS Grid layout variant B
index.html             ← story tile + side panel, no build step needed
```

No build tools, no preprocessors — just CSS files loaded in the browser. The primitives stylesheet is always loaded; the brand and layout stylesheets are swapped by the side panel controls via JavaScript.

### Token layers in CSS

Primitive tokens define the raw palette in `:root`. Brand files then map semantic tokens to the appropriate primitive values:

```css
/* css/primitives.css */
:root {
  --color-blue-800: #0A1E5C;
  --color-neutral-900: #1A1A1A;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --font-serif: Georgia, serif;
  --font-sans: Arial, sans-serif;
}

/* css/brands/smh.css */
:root {
  --tile-headline-color: var(--color-blue-800);
  --tile-headline-font: var(--font-serif);
  --tile-padding: var(--spacing-md);
}
```

The HTML and component CSS only reference semantic tokens like `var(--tile-headline-color)`. Switching brand is as simple as swapping which brand stylesheet is active.

## Next steps

Once the team has reviewed this overview, the PoC will move into implementation:

1. Write `primitives.css` with shared primitive tokens
2. Write per-brand CSS files with semantic token mappings
3. Write layout variant CSS files using CSS Grid
4. Build the story tile HTML using semantic custom properties
5. Build the side panel with brand/layout controls, token display, and inline editing
6. Walk through the demo as a team
