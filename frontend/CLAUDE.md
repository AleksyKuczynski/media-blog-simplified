# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build (Next.js with webpack)
npm run start    # Start production server
npm run lint     # ESLint (next/core-web-vitals)
```

No test suite is configured.

## Architecture

**Stack:** Next.js App Router · React 19 · TypeScript (strict) · Tailwind CSS 4 · Directus CMS (headless)

### Routing

All routes are nested under a dynamic `[lang]` segment (`/en/...`, `/ru/...`). The middleware at `src/proxy.ts` handles language detection (cookie → Vercel geo-header → Accept-Language → default `en`) and redirects bare paths to the appropriate language prefix.

Route groups organize pages: `(articles)`, `(collections)`, `(with-filter)`.

### Feature Modules (`src/features/`)

Each feature follows a consistent internal layout:
- `ui/` — presentational components
- `page/` — page-level compositions
- `logic/` — hooks, reducers, context

Features: `search`, `navigation`, `article-display`, `rubric-display`, `analytics`.

### API Layer (`src/api/`)

All data fetching talks to Directus REST API at `DIRECTUS_URL`. Fetch functions live in `src/api/directus/` and follow a consistent pattern:
- Build field lists, filter, and deepFilter as query params (JSON.stringify + encodeURIComponent)
- Use Next.js `fetch` with `{ next: { revalidate: 3600, tags: [...] } }` for ISR, or `cache: 'no-store'` for draft/preview content
- Tag-based revalidation (e.g., `['article', 'stable']`)
- Parallel fetches via `Promise.all`

### Internationalization

Language dictionaries live in `src/config/i18n/dictionaries/{en,ru}.ts` and are loaded via `getDictionary(lang: Lang)`. Types are in `src/config/i18n/types.ts`. All page components receive `lang` as a prop and pass the dictionary down. `generateStaticParams()` pre-generates both language versions for every route.

### Shared Utilities (`src/lib/`, `src/shared/`)

- `cn()` — class merging (clsx + tailwind-merge), use everywhere for conditional classes
- `generateArticleLink(slug, lang)` — always use this for internal article links
- `imageOptimization.ts` — transforms Directus asset URLs with size presets
- `src/shared/` contains error boundaries, SEO helpers, and reusable UI primitives

### Styles

- Tailwind CSS 4 (PostCSS plugin) is the primary styling mechanism
- SASS is available for `src/app/` global styles (configured in `next.config.mjs`)
- Component-level styles use `.styles.ts` files with `cn()`-composed class strings

### State Management

No external state library. Complex interactions use `useReducer` with co-located reducers (e.g., `searchReducer`, `menuAnimationReducer`). Feature-level shared state uses React Context (e.g., `SearchPageContext`).

### Content Processing

Article bodies from Directus are transformed into typed `ArticleBlock[]`. Markdown is processed with the Remark/Unified ecosystem plus custom plugins for blockquotes, carousels, and image captions. HTML manipulation uses `node-html-parser` and `jsdom`.

### Path Aliases

`@/*` maps to `./src/*` — use this for all imports.
