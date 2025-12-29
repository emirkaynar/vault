# Copilot instructions (Vault)

## Project snapshot

- Static web app built with **Lit** web components (no framework router).
- Entry module is [src/main.ts](../src/main.ts) which registers components; pages load the compiled `/main.js`.
- Data is local: assets are described in [src/data/metadata.json](../src/data/metadata.json) and loaded into **IndexedDB** on first run.

## Dev / build workflow (Bun)

- Install: `bun install`
- Local dev (build + copy static files + serve): `bun run dev` (serves `./dist` on port **25420**)
- Watch dev: `bun run dev-w` (nodemon re-runs build + prepare-dist)
- Build only: `bun run build` (outputs `dist/main.js`)
- Prepare dist (copy HTML/assets/styles): `bun run prepare-dist`

CI/Pages deployment mirrors this (Bun build + copy into `dist`): [.github/workflows/deploy.yml](workflows/deploy.yml)

## Architecture & data flow

- **Toolbar → Grid communication** is via a global CustomEvent on `window`:
  - Toolbar dispatches `vault-filter-change` with `detail` shaped like `{ resolution: string[], aspectRatio: string[], sortBy: string }`.
  - Grid listens for `vault-filter-change` and updates its internal filters.
  - See: [src/components/toolbar.ts](../src/components/toolbar.ts) and [src/components/grid.ts](../src/components/grid.ts)
- Persistence conventions:
  - Filters live in `sessionStorage["selectedValues"]` (read by grid + toolbar).
  - User prefs live in `localStorage["prefs"]` (used by toolbar and navigation).
  - Don’t rename these keys without updating both components.

## Collections

- Each asset in [src/data/metadata.json](../src/data/metadata.json) has `tags: string[]`.
- Collection membership is inferred by a tag prefix: `collection:<name>`.
  - The grid groups assets by collection name and uses a default `browse` collection for non-tagged items.
  - Implementation: `collectionsCollector()` in [src/components/grid.ts](../src/components/grid.ts)
- Pages select a collection by setting the `collection` attribute on `<grid-hx>`:
  - Root browse: [index.html](../index.html)
  - Collection pages: [collection/lego.html](../collection/lego.html), [collection/map-labs.html](../collection/map-labs.html), [collection/software.html](../collection/software.html)

## Asset file conventions (important)

- `src/data/metadata.json` is the source of truth for what appears in the UI; each entry assumes matching files exist under `asset/`.
- Thumbnails are lazy-loaded from: `/asset/grid/thumbnail/<id>.webp`
- Full images / download use: `/asset/grid/<id>.png`
- Overlay deep-linking uses the hash format `#preview<id>` (grid opens the overlay on load if present).
  - See `handleHash()` / `showOverlay()` in [src/components/grid.ts](../src/components/grid.ts)

## Code style / component patterns

- Components are LitElements with decorators (`@customElement`, `@property`, `@state`).
- Custom elements are named with the `-hx` suffix (e.g. `<grid-hx>`, `<toolbar-hx>`, `<navigation-hx>`).
- Styling relies on CSS variables defined in [src/stylesheets/global.css](../src/stylesheets/global.css); prefer using existing `--hx-*` tokens over introducing new hard-coded colors.
