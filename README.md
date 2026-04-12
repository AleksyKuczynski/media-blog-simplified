# event4me

Multilingual editorial platform for travel and lifestyle content. Built with Next.js App Router, Directus CMS, and PostgreSQL. Live at [event4me.vip](https://event4me.vip).

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| CMS | Directus 11 (self-hosted, headless) |
| Database | PostgreSQL |

## Features

- **i18n** — `en` / `ru` with geo-based routing via middleware
- **ISR** — article pages statically generated, revalidated via cache tags
- **SSR** — all pages are server components; client components limited to interactive islands
- **Rich content** — markdown pipeline with custom blockquotes, image carousels, inline article cards, TOC, and balloon tips
- **SEO** — JSON-LD schema (Article, BreadcrumbList, Person, CollectionPage), hreflang, structured metadata per route
- **Engagement** — views, likes, shares via Directus Flows (fire-and-forget, rate-limited)
- **Preview** — draft article preview via `/preview/[slug]` with `force-dynamic` rendering

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   └── [lang]/
│   │       ├── (articles)/   # Article routes
│   │       └── (collections)/ # Rubric / author listing routes
│   ├── api/directus/         # Directus fetch functions
│   ├── config/               # i18n dictionaries, constants
│   ├── features/             # Feature-scoped UI components
│   └── shared/               # Shared UI, SEO, error handling
```

## Environments

| Branch | Environment | URL |
|--------|------------|-----|
| `main` | Production | event4me.vip |
| `qa` | QA | qa.event4me.vip |
| `dev` | Development | dev.event4me.vip |

All environments share a single Directus instance. See `CONTRIBUTING.md` for branch workflow.

## Local Development

**Prerequisites:** Node.js 20+, pnpm, Docker

```bash
# Clone
git clone https://github.com/alehkuczyn/event4me.git
cd event4me/frontend

# Install
pnpm install

# Configure environment
cp .env.example .env.local
# Fill in DIRECTUS_URL, NEXT_PUBLIC_DIRECTUS_URL, DIRECTUS_API_TOKEN

# Run
pnpm dev
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `DIRECTUS_URL` | Internal Directus URL (server-to-server) |
| `NEXT_PUBLIC_DIRECTUS_URL` | Public Directus URL (asset src in HTML) |
| `DIRECTUS_API_TOKEN` | Directus static token for engagement API |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `ARTICLES_LIMIT` | Max articles fetched (unset = unlimited) |
| `NEXT_OUTPUT` | Set to `standalone` for Docker/Hetzner builds |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).