# Project Guidelines

## Code Style

- Use TypeScript with strict mode enabled (see [tsconfig.json](tsconfig.json) and [frontend/tsconfig.app.json](frontend/tsconfig.app.json))
- Follow ESLint rules for React/TypeScript (see [eslint.config.js](eslint.config.js) and [frontend/eslint.config.js](frontend/eslint.config.js))
- Use React.memo() for performance-critical components like tree nodes
- Prefer functional components with hooks over class components

## Architecture

- **Frontend**: React 19 + TypeScript + Vite, served at `/npk-tools/` base path
- **Backend**: Bun runtime scripts for data processing (parsing HTML to JSON, scraping, image extraction)
- **Data Flow**: HTML files in `/data/` → parsed to JSON in `public/data/chapters.json` → consumed by frontend
- Core types defined in [frontend/src/types/npk.types.ts](frontend/src/types/npk.types.ts) - use these instead of `any`
- Components: Table view → Chapter detail → Recursive NpkChapter tree renderer

## Build and Test

- **Frontend**: `npm run dev` (development), `npm run build` (production), `npm run lint` (linting)
- **Backend**: `bun scrape` (fetch HTML), `bun parse` (HTML to JSON), `bun images` (download media), `bun write` (export to SIA format)
- No automated tests currently - manual testing via dev server

## Conventions

- Vite base path is hardcoded to `/npk-tools/` in [frontend/vite.config.ts](frontend/vite.config.ts) and BrowserRouter
- Media UUIDs extracted via regex pattern `/media\/([0-9a-fA-F-]{36})/` and stored in `/images/{chapterNr}/`
- Feature flags: `productsEnabled` currently false in NpkChapter component
- Parser outputs streaming JSON to `public/data/chapters.json` for frontend consumption
- Avoid exposing credentials - scraper has embedded login tokens that should be secured

## Potential Pitfalls

- Parser only processes chapters [113, 117] - update to use ALL_CHAPTERS constant
- Components use `any[]` instead of typed NpkPosition[] - migrate to proper typing
- Remove debug styling (colored divs) before production
- Ensure `public/data/chapters.json` is served at `/npk-tools/data.json` in production deployment</content>
  <parameter name="filePath">d:\DEV\Web Programming\npk-viewer\.github\copilot-instructions.md
