# Principles

## Plain HTML, CSS, and JavaScript only
No frameworks, no build tools, no preprocessors. The demo should open in a browser from the file system. This keeps the focus on the concepts, not the tooling.

## Standard CSS
No utility-class frameworks (Tailwind, etc.). CSS is written as regular selectors and declarations so the relationship between tokens and styles is explicit and readable.

## Modern CSS
Lean into current CSS capabilities:
- **CSS Custom Properties** — the token delivery mechanism
- **CSS Grid** — layout control and element reordering per brand
- **Container Queries** — responsive behaviour scoped to the component, not the viewport

## Tokens as CSS Custom Properties
For this demo, tokens are defined directly as CSS custom properties in per-brand CSS files — no Style Dictionary or build step. This is enough to illustrate the value of the token architecture (primitive → semantic → component) without introducing tooling complexity. A build tool can be layered in later if the team decides to adopt tokens.
