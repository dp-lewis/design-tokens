# Implementation Plan — Design Tokens Demo

## Context

Build an interactive demo page showing a single story tile component styled by design tokens and repositioned by CSS Grid layout classes. A side panel lets users independently switch brand tokens and layout, edit token values live, and see the primitive→semantic→resolved chain.

## File Structure

```
package.json              ← npm scripts (dev server, etc.)
.gitignore                ← node_modules
src/
  css/
    primitives.css        ← shared primitive tokens
    components/
      tile.css            ← story tile component styles (uses semantic tokens)
      panel.css           ← side panel styles
      page.css            ← page layout (tile centred, panel to the side)
    brands/
      broadsheet.css      ← Broadsheet semantic token mappings
      tabloid.css         ← Tabloid semantic token mappings
      financial.css       ← Financial semantic token mappings
    layouts/
      layout-stacked.css  ← image on top, text below (vertical stack)
      layout-side.css     ← image to the left, text to the right
      layout-overlay.css  ← image full-bleed, text overlaid at bottom
  js/
    app.js                ← wires up brand/layout switching, token editing, panel rendering
  index.html              ← single page: story tile + side panel
```

### Dev Server

`package.json` defines:

- `"start"` — runs a static file server (e.g. `serve` or `lite-server`) serving the `src/` directory
- No build step, no bundler — just static files served over HTTP
- This avoids file:// CORS issues and reflects how assets are served in production

## Brand Token Reference

Extracted from the real Nine brand sites. Demo uses generic names with Google Fonts substitutes.

### Google Fonts Substitutions

| Original Font | Google Fonts Substitute | Used By |
|---|---|---|
| Abril Titling Bold | **Abril Fatface** | Broadsheet headlines |
| PT Serif | **PT Serif** (exact match) | Broadsheet body text |
| Sueca HD Regular | **Lora** | Financial headlines + body |
| Museo Sans | **Nunito** | Tabloid headlines |
| Noto Sans | **Noto Sans** (exact match) | Tabloid body text |

### Broadsheet (← SMH)

| Token | Value |
|---|---|
| Headline font | `"Abril Fatface", "Book Antiqua", Palatino, Georgia, serif` |
| Body text font (summary, kickers, bylines) | `"PT Serif", Georgia, Times, "Times New Roman", serif` |
| Headline weight | bold |
| Text color | `#0a1633` (dark navy) |
| Accent/link color | `#096dd2` (mid-blue) |
| Spacing between text elements | 12px (default), 8px (compact) |
| Spacing between image and text | 24px |

### Tabloid (← nine.com.au)

| Token | Value |
|---|---|
| Headline font | `"Nunito", sans-serif` |
| Body text font | `"Noto Sans", sans-serif` |
| Text color | `rgba(0, 0, 0, 0.81)` |
| Accent/link color | `rgba(0, 0, 0, 0.58)` |
| Spacing between text elements | 8px |
| Spacing between image and text | 12px |

### Financial (← AFR)

| Token | Value |
|---|---|
| Headline font | `"Lora", times, serif` |
| Body text font | `"Lora", times, serif` |
| Text color | `#111111` (near-black) |
| Accent/link color | `#0f6cc9` (blue) |
| Spacing between text elements | 8px |

---

## Steps

### 1. `css/primitives.css` — primitive token palette

Define `:root` custom properties for the raw values all brands draw from:

- **Colors:** `#0a1633`, `#111111`, `rgba(0,0,0,0.81)`, `rgba(0,0,0,0.58)`, `#096dd2`, `#0f6cc9`, white, light greys for backgrounds/borders
- **Spacing:** `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (12px), `--spacing-lg` (16px), `--spacing-xl` (24px), `--spacing-2xl` (32px)
- **Typography:** font stacks for Abril Fatface, PT Serif, Lora, Nunito, Noto Sans; sizes sm/md/lg/xl; weights normal/bold; line-heights tight/normal
- **Misc:** `--radius-sm/md`, `--shadow-sm`

### 2. `css/brands/*.css` — semantic token mappings per brand

Each brand file sets `:root` semantic tokens that reference primitives. Semantic tokens are scoped to the tile component:

- `--tile-bg`, `--tile-padding`, `--tile-radius`
- `--tile-headline-font`, `--tile-headline-size`, `--tile-headline-color`, `--tile-headline-weight`
- `--tile-kicker-color`, `--tile-kicker-font`, `--tile-kicker-size`
- `--tile-summary-color`, `--tile-summary-font`, `--tile-summary-size`
- `--tile-byline-color`, `--tile-byline-size`
- `--tile-border-color`, `--tile-accent-color`
- `--tile-image-radius`
- `--tile-text-gap` (spacing between text elements)
- `--tile-content-gap` (spacing between image and text)

Three brand files using generic names, each inspired by a real Nine brand:

- **Broadsheet** ← inspired by SMH (traditional newspaper, serif headlines, blue accents)
- **Tabloid** ← inspired by nine.com.au (modern, sans-serif, muted accents)
- **Financial** ← inspired by AFR (premium, corporate, dense typography)

Each maps semantic tokens to different primitives to produce distinct looks.

### 3. `css/components/tile.css` — story tile component

Style the `.story-tile` component using only semantic tokens:

```css
.story-tile {
  background: var(--tile-bg);
  padding: var(--tile-padding);
  border-radius: var(--tile-radius);
}
.story-tile__headline {
  font-family: var(--tile-headline-font);
  color: var(--tile-headline-color);
}
```

- BEM-style class names
- `container-type: inline-size` on the tile for container query support

### 4. `css/layouts/*.css` — grid layout variants

Each layout file targets `.story-tile` with CSS Grid to reorder its children using `grid-template-areas` and element `grid-area` assignments:

- **Stacked** — image area on top, kicker, headline, summary, byline below (classic vertical card)
- **Side-by-side** — image left (~40%), text content right (~60%)
- **Overlay** — image fills the card, text content overlaid at the bottom with a gradient scrim

Each layout file is self-contained — swapping it rearranges elements without touching tokens.

### 5. `css/components/panel.css` + `css/components/page.css` — panel and page layout

- **Page:** CSS Grid with the story tile centred in the main area, side panel fixed/scrollable on the right
- **Panel:** sections for brand selector (radio buttons or segmented control), layout selector (same), and a token list showing semantic→primitive→value with editable inputs

### 6. `index.html` — the demo page

Single HTML file containing:

- `<link>` tags for primitives.css, tile.css, panel.css, page.css (always loaded)
- A `<link id="brand-css">` and `<link id="layout-css">` that JS swaps the `href` on
- The story tile markup (single instance):
  - `.story-tile` wrapper
  - `.story-tile__image` (placeholder image)
  - `.story-tile__kicker` (e.g. "Politics")
  - `.story-tile__headline` (realistic headline)
  - `.story-tile__summary` (1-2 sentence standfirst)
  - `.story-tile__byline` (author + timestamp)
- The side panel markup:
  - Brand switcher (Broadsheet / Tabloid / Financial)
  - Layout switcher (Stacked / Side / Overlay)
  - Token inspector list (populated by JS)
  - Reset button

### 7. `js/app.js` — interactivity

**Data:** A JS object defining each brand's token set — mapping semantic token names to their primitive reference and resolved value. This is the source of truth for the panel display and editing.

**Brand switching:**
- On brand select, swap `#brand-css` href to the chosen brand's CSS file
- Repopulate the token inspector with that brand's values
- Reset any manual overrides

**Layout switching:**
- On layout select, swap `#layout-css` href to the chosen layout's CSS file
- Token list stays unchanged (reinforces independence)

**Token inspector / editing:**
- Render each semantic token as a row: semantic name → primitive name → editable input
- Color tokens get `<input type="color">`, spacing/size get `<input type="number">`, fonts get `<select>` or `<input type="text">`
- On edit, apply the override via `document.documentElement.style.setProperty('--token-name', newValue)`
- Mark overridden tokens visually (e.g. highlight or indicator)

**Reset button:**
- Clears all inline style overrides on `:root`
- Repopulates inputs from the current brand's defaults

## Verification

Run `npm start` and open the local URL in a browser. Confirm:

- Story tile renders with Broadsheet tokens by default
- Switching brand changes tile appearance, panel updates
- Switching layout rearranges tile, token values unchanged
- Editing a token value in the panel updates the tile in real time
- Reset restores the selected brand's defaults
