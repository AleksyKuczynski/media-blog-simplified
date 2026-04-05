# Event.For.Me — Project Context

Multilingual (ru/en) editorial website. Frontend in `frontend/`, Directus CMS backend containerized separately.

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router (SSR-first) |
| UI | React 19, Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Language | TypeScript |
| CMS | Directus 11.16.0 — self-hosted at `cms.event4me.blog`, Public role has read access, no bearer token for most flows |
| Tooling | pnpm, Vercel deployment |
| Middleware | `proxy.ts` (not `middleware.ts` — Next.js 16 convention in this project) |

## Architecture rules

- **SSR by default.** Every page is a server component. Data fetching is server-side.
- **Client components are small and focused.** Add `'use client'` only for interactivity or hooks.
- **No `useEffect`.** Use server-side or event-driven alternatives.
- **Prop threading over context.** Use React context only when prop drilling becomes untenable.
- **Styles in `*.styles.ts` files.** Components import style constants; no inline Tailwind in JSX.
- **Style scope: parent owns shared styles.** Styles affecting multiple children belong in the parent.
- **No speculative code.** Implement what's needed now.

## File conventions

- Style constants: `*.styles.ts` (e.g., `layout.styles.ts`, `article.styles.ts`, `navigation.styles.ts`)
- Business logic: custom hooks (`useSearchLogic`, `useMobilePanel`, `useNavigationSearch`)
- Multilingual routing: `[lang]` route segments; `Lang` type is `'en' | 'ru'`
- When casting `lang` from route params: `const lang = langParam as Lang` (params give `string`, not `Lang`)

## Design system

- Material Design 3 color system: primary teal, secondary pink, tertiary mauve
- `color-mix(in oklch, ...)` for hover/pressed/gradient token derivation
- `globals.scss` is the **authoritative color token source** — Drive design docs are stale, ignore them
- `color-mix` opacity slash notation only works for Tailwind config-defined colors, not CSS variables

## Directus quirks

- Junction tables (e.g., `articles_authors`) have no `status` field — filter published articles via the `articles` endpoint with `filter[status][_eq]=published`
- Directus applies a default `status=published` system filter for unauthenticated requests even when Public role has read access
- `articles_engagement` uses string slug fields, not relation IDs — join in application code, not via Directus deep filters

## Known CSS gotchas

- `flex-grow` requires `min-h-0` on flex items with large padding
- Truncation with ellipsis: `white-space: nowrap` must be on the text node, not just the container
- `table-layout: fixed` needed for predictable column widths
- SVG inline components: replace `.fil0` fill with `currentColor` for automatic theme switching

## SSR/hydration gotchas

- `useLayoutEffect` runs after paint in SSR context — shuffle/slice logic belongs server-side
- `useId()` generates different IDs server vs. client — use stable hardcoded IDs for ARIA relationships
- ISR-cached pages (`revalidate`) ignore query params — use `force-dynamic` for preview routes

## Breadcrumbs

Context passed via `?from=` query param: `rubric:slug`, `author:slug`, `category:slug`, `articles`, `home`. Threaded from page → `ArticleList` → `ArticleCard`. Canonical schema always renders as `main>rubrics>rubricName>article` for SEO.

## Development commands

```bash
pnpm dev          # local dev server
pnpm build        # production build (also catches TypeScript errors)
pnpm lint         # ESLint
```

## Response rules

- **Read the relevant files before suggesting anything.** Never guess at current implementation.
- **Changed section only.** Never output complete files in the response. If a full file is unavoidable, render it as a separate artifact.
- **Preserve all existing variable names and string literals** unless renaming is the point.
- **One recommendation, not a menu.** Pick the best approach and implement it. If a meaningful alternative exists, mention it in one sentence — don't implement both.
- **Fix only what was reported.** No unrequested improvements, edge-case handling, or "while we're here" changes.
- **No `##` section headers in responses.** Multi-file changes use inline file labels: `` `filename.tsx` — update X: `` not `## Step 2`.
- **Validation when non-obvious only.** One line — a command, URL, or specific action to verify the fix. Skip if obvious.
- **`<SECURITY_REVIEW>`** when the change touches auth, user input, API routes, or Directus access control. 2–3 sentences.
- **No trailing summaries. No apologies.**

## Response structure

Scale to complexity — don't over-structure simple fixes.

**Simple fix:** one sentence + changed code. No tags.

**Medium fix:**
```
<CODE_REVIEW>
1–3 lines: current state, key gap.
</CODE_REVIEW>

`filename.tsx` — changed section:
[code]

Validate: [one line, if non-obvious]
```

**Complex fix (multi-file, race conditions, auth flows):**
```
<CODE_REVIEW>
Root cause — 3–5 lines max.
</CODE_REVIEW>

<PLANNING>
1. Step one
2. Step two
</PLANNING>

[One clarifying question if genuinely ambiguous — stop and wait for answer before writing code]

`filename.tsx` — label:
[code]
```
