# Design Tokens Demo

An interactive demo showing how design tokens enable multi-brand theming from a single codebase. A story tile component is styled entirely via semantic tokens — switching brand, layout, or colour mode requires zero changes to the HTML or component CSS.

## Running locally

```bash
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000) with live reload on file changes.

## How it works

- **Primitive tokens** (`src/css/primitives.css`) — raw design values (colours, fonts, sizes, spacing)
- **Brand files** (`src/css/brands/*.css`) — map semantic tokens to primitives per brand
- **Component CSS** (`src/css/components/tile.css`) — styles the story tile using semantic tokens only
- **Layout files** (`src/css/layouts/*.css`) — rearrange tile elements via CSS Grid, independent of tokens
- **Dark mode** (`src/css/brands/*-dark.css`) — per-brand dark colour overrides

The side panel lets you switch brand, layout, and light/dark mode independently, and edit individual token values in real time.

## Brands

Three fictional newspaper archetypes, each with distinct typography, colour, and spacing:

| Brand | Style |
|---|---|
| **Broadsheet** | Traditional serif headlines, blue accents, generous spacing |
| **Tabloid** | Modern sans-serif, muted accents, tighter spacing |
| **Financial** | Dense serif typography, blue accents, compact layout |

## Documentation

- [Overview](docs/OVERVIEW.md) — what design tokens are and why they matter
- [Plan](docs/PLAN.md) — implementation plan with brand token reference
- [Principles](docs/PRINCIPLES.md) — design principles guiding the approach
- [User Stories](docs/USER-STORIES.md) — target user stories for the PoC
