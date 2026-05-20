# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `npm run dev` (Vite, port 5173)
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint)
- **Tests:** `npm run test` (Playwright, tests in `tests/`)
- **Preview production build:** `npm run preview`

## Architecture

This is a Zendesk Admin Center home page prototype — a single-page React app with no routing.

### Stack
- React 19 + TypeScript, Vite 8, styled-components 6
- **Zendesk-UI** (`@zendesk-ui/navigation`, `@zendesk-ui/assets`) — private Zendesk packages for global navigation shell (Product, Header, Nav, Main)
- SVGs imported as React components via `vite-plugin-svgr` (`?react` suffix)

### Layout (src/App.tsx)
The app uses Zendesk-UI's `<Product>` shell which provides `<Header>`, `<Nav>`, and `<Main>` regions. Inside `<Main>`:

```
StyledMain (overrides Main's default styling)
  └─ MainWrapper (flex row, manages gap/padding when copilot is open)
       ├─ HomeContentWrapper (white bg, rounded corners, box-shadow)
       │    └─ HomeContent (scrollable content area)
       │         └─ HomeInner (max-width container)
       │              ├─ Greetings
       │              ├─ LatestInsights
       │              └─ Recommendations
       └─ PanelSlider (animated width for copilot panel)
            └─ CopilotPanel
```

The copilot panel slides in/out via width animation on `PanelSlider`. The `$hasCopilot` / `$roundedRight` transient props control responsive spacing and border-radius transitions.

### Key conventions
- All styling uses styled-components with transient props (`$propName`) to avoid DOM forwarding
- Components are in `src/components/`, all flat (no nesting)
- `ThemeProvider` from Zendesk-UI wraps the app at the root (`src/main.tsx`)

### Working practices
- When starting a new worktree, always run a new dev server, using a new and unique port number. This is useful so the user can preview changes right away.
