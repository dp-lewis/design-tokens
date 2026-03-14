# User Stories

## Designer

### 1. Compare brands side by side
**As a** designer, **I want to** see how a single story tile looks across different brands side by side, **so that** I can evaluate visual consistency and brand differentiation at a glance.

### 2. Explore design options in real time
**As a** designer, **I want to** tweak token values (colors, fonts, spacing) and see the tile update in real time, **so that** I can explore design options without waiting for a developer to make changes.

### 3. Understand the token hierarchy
**As a** designer, **I want to** understand the relationship between primitive tokens and semantic tokens, **so that** I know which values are shared and which are brand-specific when I'm making design decisions.

## Developer

### 4. See how tokens reduce duplication
**As a** developer, **I want to** see how a single HTML component can serve multiple brands by swapping a CSS file, **so that** I can understand how tokens reduce code duplication in our codebase.

### 5. Understand the separation of appearance and layout
**As a** developer, **I want to** see appearance and layout controlled independently, **so that** I can reason about how to structure components that work across brands without tight coupling.

### 6. Understand the build pipeline
**As a** developer, **I want to** understand the build pipeline (JSON → Style Dictionary → CSS custom properties), **so that** I know how token changes flow from source files into production code.

## Design system advocate

### 7. Evaluate the approach
**As a** team member new to design tokens, **I want** a clear explanation of what tokens are and why they matter for Nine, **so that** I can evaluate whether this approach is worth adopting.

### 8. See that tokens and layout truly compose
**As a** team member, **I want to** mix brand tokens with different layout classes, **so that** I can see that these are genuinely independent systems that compose freely — not just a tightly coupled theme.
