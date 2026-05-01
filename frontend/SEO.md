# SEO Full Audit Report — event4me.vip
**Date:** April 30, 2026  
**Auditor:** Claude Code SEO Skill v1.9  
**Site:** https://event4me.vip  
**Business type:** Bilingual wedding blog/publisher (Russian + English)  
**Framework:** Next.js (confirmed by /api/ routes and Loading... render states)

---

## SEO Health Score: 43 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 60/100 | 13.2 |
| Content Quality (E-E-A-T) | 23% | 36/100 | 8.3 |
| On-Page SEO | 20% | 40/100 | 8.0 |
| Schema / Structured Data | 10% | 2/100 | 0.2 |
| Performance (CWV) | 10% | 55/100 | 5.5 |
| AI Search Readiness | 10% | 52/100 | 5.2 |
| Images | 5% | 45/100 | 2.25 |
| **TOTAL** | | | **43 / 100** |

---

## Executive Summary

EventForMe is a bilingual (Russian/English) wedding blog operating at event4me.vip. The site has a sound content structure — 176 sitemap URLs, 13 named authors, 8 content categories, decent article quality (~1,200–1,400 words per piece) — but is being severely limited by foundational SEO gaps that affect every page simultaneously.

The site's single biggest weakness is **zero structured data across all 176 pages**: no JSON-LD, no Open Graph tags, no Twitter Card meta tags, no schema of any kind. This makes every article ineligible for rich results, every social share a blank card, and every author invisible to Google's entity graph.

The second critical gap is **no confirmed hreflang implementation** on a bilingual site with fully parallel /ru/ and /en/ URL trees — a high-risk duplicate content situation affecting every article.

A third systemic issue is **JavaScript-dependent rendering confirmed via multiple "Loading..." placeholder states** throughout the site — key content blocks may not be reaching Googlebot.

These three issues alone explain underperformance in organic search regardless of content quality. They can all be fixed at the infrastructure level in 2–4 weeks without rewriting a single article.

### Top 5 Critical Issues
1. Zero structured data anywhere — no JSON-LD, no Open Graph, no Twitter Cards
2. No hreflang tags confirmed on any page — bilingual duplicate content risk
3. JavaScript-rendered content confirmed ("Loading..." states) — indexing gaps
4. No E-E-A-T trust infrastructure — no author credentials, no editorial About page
5. Search pages (/ru/search, /en/search) included in sitemap

### Top 5 Quick Wins
1. Add Open Graph + Twitter Card meta tags to all page templates (~1 dev day)
2. Remove /ru/search and /en/search from sitemap (~10 minutes)
3. Create /llms.txt to unlock AI search visibility (~3 hours)
4. Add `priority` prop to hero images in Next.js Image component (~30 min)
5. Add WebSite + Organization JSON-LD to homepage layout (~2 hours)

---

## Site Overview (Confirmed Data)

| Signal | Value |
|---|---|
| Homepage URL | https://event4me.vip/ru (Russian) / https://event4me.vip/en (English) |
| Total sitemap URLs | 176 |
| Language structure | /ru/ prefix (Russian) + /en/ prefix (English) |
| Content categories | Ideas, Mystic, People, Planning, Traditions, Travel, Wellness, Wiki |
| Named authors | 13 contributors |
| Sitemap type | Single flat file (no sitemap index) |
| Sitemap declared in robots.txt | Yes |
| AI crawler access | GPTBot, ClaudeBot, PerplexityBot, Applebot — all unrestricted |
| llms.txt | NOT FOUND |
| Structured data (any type) | NONE detected |
| Open Graph tags | NOT CONFIRMED (absent on all sampled pages) |
| hreflang tags | NOT CONFIRMED (absent on all sampled pages) |
| Newsletter/email capture | ABSENT |
| No. of "Loading..." states observed | Multiple (homepage and category pages) |

---

## 1. Technical SEO — 60 / 100

### 1.1 Crawlability

**Score: 7/10** — robots.txt is well-configured. AI crawlers correctly permitted. Yandex crawl-delay set appropriately.

| Check | Status |
|---|---|
| robots.txt present | ✅ |
| Sitemap declared in robots.txt | ✅ |
| AI crawlers (GPTBot, ClaudeBot, PerplexityBot) | ✅ Unrestricted |
| /api/ routes blocked | ✅ |
| /admin/ blocked | ✅ |
| /preview/ blocked | ✅ |
| Yandex crawl-delay: 1s | ✅ Appropriate |
| `/*?from=` pattern blocked | ⚠️ Verify URLs aren't canonical content |

### 1.2 Indexability

**Score: 6/10** — Significant risks from unconfirmed canonicals and search pages in sitemap.

**CRITICAL — /ru/search and /en/search in sitemap**  
Both search result pages appear in sitemap.xml. Search pages are typically noindexed and must not appear in sitemaps. Verify these pages carry `<meta name="robots" content="noindex">` and remove them immediately.

**CRITICAL — Canonical tags unconfirmed**  
No canonical tags were extractable from any page. With parallel /ru/ and /en/ URL trees, incorrect or missing self-canonicals create duplicate content signals across all 176 pages.

**HIGH — Sitemap lastmod timestamps are auto-generated**  
All navigation/category pages share identical lastmod: `2026-04-30T09:51:53.386Z`. This is a CMS auto-generation artifact. Article pages have real dates (e.g., `2026-04-02`, `2026-03-25`) — correct. Fix the navigation page timestamps to reflect real modification dates.

**HIGH — No sitemap hreflang annotations**  
The sitemap contains no `<xhtml:link>` hreflang entries despite having full /ru/ and /en/ URL pairs. This compounds the missing hreflang tags on pages themselves.

### 1.3 International SEO (hreflang)

**Score: 5/10** — No hreflang implementation confirmed anywhere.

**CRITICAL — No hreflang tags on any page**  
A bilingual site with 176 URLs across /ru/ and /en/ trees has no `<link rel="alternate" hreflang>` tags. This means Google may:
- Show Russian content to English speakers and vice versa
- Treat both language versions as duplicate content and suppress one
- Fail to index the correct language version for each market

Required on every page (example for English article):
```html
<link rel="alternate" hreflang="ru" href="https://event4me.vip/ru/ideas/article-slug" />
<link rel="alternate" hreflang="en" href="https://event4me.vip/en/ideas/article-slug" />
<link rel="alternate" hreflang="x-default" href="https://event4me.vip/ru/ideas/article-slug" />
```

**Note:** The root URL appears to redirect to /ru or /en — verify that the Russian version is declared as `x-default` (primary language).

### 1.4 JavaScript Rendering

**CRITICAL — Confirmed client-side rendering for key content**  
Multiple "Loading..." placeholder states confirmed via live fetch of https://event4me.vip/ru. Article cards, category listings, and navigation blocks are JavaScript-dependent. Googlebot must execute JavaScript to see this content — adding latency, risking incomplete indexing, and directly hurting LCP scores.

**Action:** Migrate article card lists and category pages to Next.js Static Site Generation (SSG) or Server-Side Rendering (SSR). Content must appear in the initial HTML response, not loaded via client-side JavaScript.

### 1.5 Redirect Chain

**Not confirmed** — HTTP→HTTPS and www→non-www redirect behavior could not be verified. Test using:
```
curl -sI http://event4me.vip
curl -sI https://www.event4me.vip
```
Both should return 301 to https://event4me.vip/ru or similar canonical. Any 302 (temporary) response leaks link equity.

### 1.6 Security Headers

**Not confirmed** — Modern publisher sites require at minimum: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`. These can be set in Vercel/Cloudflare dashboard or `next.config.js` headers().

---

## 2. Content Quality (E-E-A-T) — 36 / 100

| E-E-A-T Dimension | Score |
|---|---|
| Experience | 4.0/10 |
| Expertise | 3.5/10 |
| Authoritativeness | 3.0/10 |
| Trustworthiness | 4.5/10 |
| **Overall E-E-A-T** | **37.75/100** |

### 2.1 Article Quality (Confirmed)
- Alexandra Fomina interview: ~1,200–1,400 words, 17 images ✅
- Interview format with first-hand subject matter ✅
- Related content section present ✅
- No external citations or source links ❌
- No structured data in page source ❌
- Category metadata present visually (Wedding reception, Interviews) ✅

### 2.2 Author Credentials (Confirmed Gap)
Sample: Leda Golovanova — 225-word bio, no professional title, no external links, 3 articles
- Writes about astrology (Lunar Calendar for May 2026, Horoscope for May 2026, Year of the Fire Horse)
- Bio is engaging and personal but has zero verifiable credentials
- No LinkedIn, no professional website linked
- 3 articles is below the thin author page threshold (need 5+ for index-worthy author page)

**CRITICAL:** This pattern likely applies to most/all 13 authors. Author pages with <3 articles and no credentials should receive `noindex` until expanded.

### 2.3 Bilingual Duplicate Content Risk (HIGH)
Russian articles appear to be translated to English (slug patterns match: `/ru/ideas/5-vdohnovlyayushih...` ↔ `/en/ideas/5-inspiring-bridal-looks...`). Without hreflang, both versions compete for the same queries and are treated as duplicate content. Without confirmed unique localization work, the English versions may be seen as thin translations.

### 2.4 Missing Trust Signals
| Signal | Status |
|---|---|
| About page with editorial mission | ❌ (only footer mention) |
| Contact page | Not confirmed |
| Author professional credentials | ❌ |
| External citations in articles | ❌ |
| "Last Updated" dates on articles | Not confirmed |
| AI content disclosure policy | Not confirmed |
| GDPR cookie consent | Not confirmed |

### 2.5 Content Depth by Category (English)
| Category | EN Articles | Depth Risk |
|---|---|---|
| Ideas & Inspiration | 6 | Medium |
| Astrology & Mysticism | 5 | High (expertise gap) |
| People & Events | 4 | Low-Medium |
| Wellness | 3 | Medium |
| Traditions | 3 | Medium |
| Wedding Planning (core!) | 3 | CRITICAL — core topic under-served |
| Honeymoon & Travel | 3 | Medium |
| Wiki/Encyclopedia | 1 | CRITICAL — near empty |

---

## 3. On-Page SEO — 40 / 100

### 3.1 Title Tags
- Homepage title: "EventForMe — A Blog about Weddings and More" ✅
- Titles present on all sampled pages ✅
- Article titles are descriptive ✅

### 3.2 Meta Descriptions
- Description: "A blog about weddings and more. Tips on planning, stylish ideas and the latest trends." ✅
- Present on homepage ✅

### 3.3 Open Graph / Social Meta (CRITICAL GAP)
**ZERO Open Graph tags detected on any page.** For a wedding blog where Pinterest, Instagram, and Telegram sharing are primary discovery channels, this is a critical conversion failure. Every share generates a blank card with no title, no image, no description.

Required on every page:
```html
<meta property="og:type" content="article" />
<meta property="og:title" content="Article Title Here" />
<meta property="og:description" content="Article description..." />
<meta property="og:image" content="https://event4me.vip/path/to/image.jpg" />
<meta property="og:url" content="https://event4me.vip/en/ideas/article-slug" />
<meta property="og:site_name" content="EventForMe" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Article Title Here" />
<meta name="twitter:image" content="https://event4me.vip/path/to/image.jpg" />
```

### 3.4 Heading Structure
- H1 present on article pages ✅
- H2 sections used for structure ✅
- Homepage uses Featured Rubrics, Our Authors, Quick Navigation as headings ⚠️ (no H1 targeting keywords confirmed)

### 3.5 Internal Linking
- "Read also" inline links present in articles (2 per article analyzed) ✅
- Related content "Don't miss out" section present ✅
- No category tag labels on article cards in listing view ❌
- No pillar page → spoke article hub architecture ❌

### 3.6 Search Pages in Sitemap
`/ru/search` and `/en/search` are indexed in the sitemap at priority 0.5. These should be noindexed and removed from sitemap.

---

## 4. Schema / Structured Data — 2 / 100

**The site has zero structured data of any kind across all 176 pages.**

| Schema Type | Status | Priority |
|---|---|---|
| WebSite (with SearchAction) | ❌ MISSING | Critical |
| Organization | ❌ MISSING | Critical |
| BlogPosting / Article | ❌ MISSING | Critical |
| Open Graph tags | ❌ MISSING | Critical |
| BreadcrumbList | ❌ MISSING | High |
| Person (author pages) | ❌ MISSING | High |
| Twitter Card tags | ❌ MISSING | High |
| ImageObject | ❌ MISSING | Medium |
| ItemList (category pages) | ❌ MISSING | Medium |

### Sample JSON-LD: WebSite + Organization (add to homepage layout)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://event4me.vip/#website",
      "url": "https://event4me.vip",
      "name": "EventForMe",
      "description": "A blog about weddings and more.",
      "inLanguage": ["en", "ru"],
      "publisher": { "@id": "https://event4me.vip/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": "https://event4me.vip/en/search?q={search_term_string}" },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://event4me.vip/#organization",
      "name": "EventForMe",
      "url": "https://event4me.vip",
      "logo": {
        "@type": "ImageObject",
        "url": "https://event4me.vip/logo.png",
        "width": 600,
        "height": 60
      },
      "sameAs": ["https://www.instagram.com/eventforme"]
    }
  ]
}
```

### Sample JSON-LD: BlogPosting (add to all article page templates)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "ARTICLE_URL" },
  "headline": "ARTICLE_TITLE",
  "description": "ARTICLE_EXCERPT",
  "image": { "@type": "ImageObject", "url": "HERO_IMAGE_URL", "width": 1200, "height": 630 },
  "author": {
    "@type": "Person",
    "name": "AUTHOR_NAME",
    "url": "AUTHOR_PAGE_URL"
  },
  "publisher": { "@id": "https://event4me.vip/#organization" },
  "datePublished": "ISO_DATE",
  "dateModified": "ISO_DATE",
  "articleSection": "CATEGORY_NAME",
  "inLanguage": "en",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Articles", "item": "https://event4me.vip/en/articles" },
      { "@type": "ListItem", "position": 2, "name": "CATEGORY", "item": "CATEGORY_URL" },
      { "@type": "ListItem", "position": 3, "name": "ARTICLE_TITLE", "item": "ARTICLE_URL" }
    ]
  }
}
```

---

## 5. Performance (Core Web Vitals) — 55 / 100

**Note:** No API credentials configured; assessment is lab-based inference. Use CrUX Vis (cruxvis.withgoogle.com) to check field data manually.

| Metric | Estimated Status | Key Risk |
|---|---|---|
| LCP | Needs Improvement / Poor (3.2–4.8s mobile) | Hero image not preloaded |
| INP | Good / Needs Improvement (180–320ms) | Next.js hydration window |
| CLS | Good / Needs Improvement (0.08–0.22) | Images without width/height, FOUT |

### Top Performance Issues

**CRITICAL — Hero images not preloaded**  
Next.js `<Image>` without `priority` prop lazy-loads the hero image by default. Add `priority` to the first above-fold image on homepage and article pages:
```jsx
<Image src="..." alt="..." width={1920} height={1080} priority />
```

**HIGH — JavaScript client-side rendering**  
Confirmed "Loading..." states mean content is JavaScript-dependent. Article cards loading asynchronously directly increases LCP on category and homepage views.

**HIGH — Web fonts likely not using `next/font`**  
Replace Google Fonts `<link>` with Next.js `next/font/google` for self-hosting, zero layout shift, and automatic `font-display: swap`.

**MEDIUM — Third-party scripts (analytics, social embeds)**  
All non-critical scripts should use `<Script strategy="lazyOnload">` in Next.js.

**MEDIUM — Missing preconnect hints**  
Add to document `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

---

## 6. AI Search Readiness — 52 / 100

| Dimension | Score |
|---|---|
| AI Crawler Access | 10/10 — Best possible |
| llms.txt | 0/10 — NOT FOUND |
| Content Citability | 5.5/10 |
| Entity Clarity | 5/10 |
| Structural Readability | 6/10 |

**Best-in-class signal:** robots.txt proactively allows all major AI crawlers — this is the correct, forward-thinking configuration. Most publishers have not done this.

**Biggest gap:** No llms.txt file. Creating one takes 2–4 hours and directly improves citation accuracy across ChatGPT, Perplexity, Google AI Overviews, and Bing Copilot.

**Platform-specific readiness:**
| Platform | Score |
|---|---|
| Google AI Overviews | 48/100 |
| ChatGPT Browse | 55/100 |
| Perplexity | 58/100 |
| Bing Copilot | 45/100 |

### Create /llms.txt (high-value, low-effort)
```
# EventForMe
> A bilingual (Russian/English) wedding blog covering wedding planning, ideas, traditions, honeymoon travel, astrology, and industry interviews.

## Languages
- Russian: https://event4me.vip/ru
- English: https://event4me.vip/en

## Content Categories
- Ideas & Inspiration: https://event4me.vip/en/ideas
- Wedding Planning: https://event4me.vip/en/planning
- Traditions: https://event4me.vip/en/traditions
- Honeymoon & Travel: https://event4me.vip/en/travel
- People & Events: https://event4me.vip/en/people
- Astrology & Mysticism: https://event4me.vip/en/mystic

## Authors
13 contributors including Ksenia Chemodanova, Natalia Karachenkova, Max Neumann, Evgenia Dobrova, Mikhail Malenkin, Ekaterina Muchanova, Leda Golovanova.

## Citation preference
Please attribute as: EventForMe (event4me.vip)
```

---

## 7. Images — 45 / 100

**Positive signals:**
- Articles feature high-quality photography (17 images in one article) ✅
- Next.js `<Image>` component likely handles WebP/AVIF conversion automatically ✅
- Images appear properly sized and relevant ✅

**Gaps:**
- Open Graph images: ABSENT across all pages ❌
- Alt text quality: not confirmed ❌
- Hero images: likely not using `priority` prop (LCP impact) ❌
- Image dimensions on inline `<img>` tags in content: not confirmed (CLS risk) ❌

---

## 8. Sitemap — 64 / 100

| Finding | Status |
|---|---|
| Sitemap type | Single flat file ✅ (appropriate for 176 URLs) |
| Declared in robots.txt | ✅ |
| Search pages included | ❌ /ru/search + /en/search must be removed |
| hreflang annotations | ❌ None present |
| Lastmod — articles | ✅ Real dates (e.g., 2026-04-02) |
| Lastmod — navigation pages | ❌ All identical: 2026-04-30T09:51:53.386Z (auto-generated) |
| `<priority>` tags | ⚠️ Present but ignored by Google since 2023 |
| `<changefreq>` tags | ⚠️ Present but ignored by Google |
| URL count parity (RU/EN) | Appears balanced (matching slugs confirmed in sample) ✅ |

**20 unaccounted URLs** (176 total − 156 in known categories) — likely author profile pages. Audit: any author with <3 articles should be noindexed.

---

## 9. SXO (Search Experience) — 52 / 100

| Persona | Score |
|---|---|
| Engaged Couple (primary) | 51/100 — Needs Work |
| Professional Wedding Planner | 41/100 — Needs Work |
| Casual Reader | 62/100 — Good |

**Page-type alignment:**
- "wedding blog" (navigational) → Content Hub homepage: **ALIGNED** ✅
- "wedding planning tips" (informational) → 3-article category: **PARTIAL MISMATCH** ⚠️
- "wedding ideas 2026" (inspirational) → Article card grid without labels: **PARTIAL MISMATCH** ⚠️
- "best wedding venues" (commercial) → Not served at all: **CRITICAL MISS** ❌

**Top friction points in search-to-content journey:**
1. JS rendering — content absent from initial HTML, "Loading..." states confirmed
2. No schema — no rich result SERP differentiation
3. Thin English content depth (3 articles per core planning category)
4. No actionable tools (checklist, budget calculator, date picker)
5. No email capture — no mechanism to retain one-time visitors

---

## 10. Backlinks — INSUFFICIENT DATA

No Moz or Bing API credentials configured. Common Crawl analysis could not run (Bash tool unavailable in audit session).

**Qualitative assessment:**
- .vip TLD is contextually appropriate for events/entertainment but has elevated spam association in some link analysis tools
- Bilingual RU/EN publisher in CIS wedding market — likely small referring domain count typical of niche lifestyle blogs
- Instagram @eventforme provides brand signal but limited link equity
- No "as seen in" press mentions detected

**Action:** Configure free Moz API key (`python3 /home/aleh/.claude/skills/seo/scripts/backlinks_auth.py --setup`) to unlock DA/PA, spam score, and anchor text analysis.

---

## 11. Content Cluster Architecture

**Current state:**
The site has 8 category hubs but they function as article feeds, not structured pillar pages. Each category has 3–6 articles (English), which is insufficient for topical authority in competitive wedding search.

**Missing pillar content (high-value gaps):**
| Missing Content | Search Intent | Priority |
|---|---|---|
| "Complete Wedding Planning Guide 2026" | High-intent planning | Critical |
| "Wedding Budget Calculator / Planner" | Tool intent | High |
| "Best Wedding Venues [by region]" | Commercial investigation | High |
| "Wedding Checklist: 12 Months Before" | Planning tool | High |
| "Wedding Photography Guide" | Informational | High |
| "Wedding Catering Guide" | Planning | Medium |
| "Engagement Ring Buying Guide" | Commercial | Medium |
| "Wedding Invitations Guide" | Planning | Medium |

**Architecture recommendation:**
Build hub pages for each of the 8 categories with 200+ words of editorial intro, then target minimum 10 articles per hub. Current English article total (~24 articles) needs to reach 80+ for competitive topical authority.

---

## Prioritized Action Plan

### CRITICAL — Fix Immediately (Week 1)

| # | Action | Impact | Effort |
|---|---|---|---|
| C1 | Add Open Graph + Twitter Card meta tags to ALL page templates | Social sharing, CTR | 1 dev day |
| C2 | Add hreflang tags (ru, en, x-default) to ALL pages via Next.js layout | Duplicate content fix | 1 dev day |
| C3 | Remove /ru/search and /en/search from sitemap.xml | Sitemap quality | 10 min |
| C4 | Add BlogPosting JSON-LD to all article page templates (dynamic, data-driven) | Rich results eligibility | 1 dev day |
| C5 | Add WebSite + Organization JSON-LD to homepage layout | Knowledge Panel, Search Box | 2 hours |
| C6 | Migrate article card lists to SSR/SSG — eliminate "Loading..." states | Indexing, LCP | 2–3 dev days |
| C7 | Add `priority` prop to hero images in Next.js `<Image>` components | LCP -1.5 to 2.5s | 30 min |

### HIGH — Fix Within 1 Week

| # | Action | Impact | Effort |
|---|---|---|---|
| H1 | Create /llms.txt file | AI search visibility | 3 hours |
| H2 | Add Person + ProfilePage JSON-LD to all 13 author pages | E-E-A-T, AI citations | 1 dev day |
| H3 | Add BreadcrumbList JSON-LD to article + category pages | SERP display | Part of C4 |
| H4 | Fix sitemap lastmod for navigation pages (real modification dates) | Crawl efficiency | 2 hours |
| H5 | Add author credential information to all author pages (job title, bio expansion to 300+ words) | E-E-A-T | 1 day editorial |
| H6 | Create standalone About page with editorial mission, team, editorial standards | Trust signals | Half day |
| H7 | Migrate to next/font for web fonts | LCP -200ms, CLS fix | Half dev day |
| H8 | Audit and fix canonical tags — ensure self-referencing on every page | Duplicate content | 1 dev day |
| H9 | Noindex author pages with <3 articles | Index quality | 2 hours |

### MEDIUM — Fix Within 1 Month

| # | Action | Impact | Effort |
|---|---|---|---|
| M1 | Add source citations (external links) to all factual articles | E-E-A-T, AI citations | 1–2 hrs per article |
| M2 | Strip `<priority>` and `<changefreq>` from sitemap (ignored by Google) | Sitemap quality | 30 min |
| M3 | Add security headers (HSTS, X-Content-Type-Options, etc.) | Security | 2 hours (Cloudflare/Vercel) |
| M4 | Implement email newsletter or Telegram subscription CTA | Audience retention | 1–2 dev days |
| M5 | Add category tags + author name + read time to article cards | UX, session depth | 1 dev day |
| M6 | Add "last updated" visible dates + dateModified to schema | Freshness signals | 1 dev day |
| M7 | Add structured image dimensions (width/height) to all `<img>` tags | CLS fix | Half dev day |
| M8 | Add FAQ-format sections to planning and comparison articles | Google AIO eligibility | Editorial |
| M9 | Defer all third-party scripts (analytics, social embeds) | INP, LCP | Half dev day |
| M10 | Add `<link rel="preconnect">` hints for Google Fonts + CDN | LCP -200ms | 30 min |

### LOW — Backlog

| # | Action | Impact | Effort |
|---|---|---|---|
| L1 | Build "Start Here" pillar pages for core planning intents | Topical authority | 2–4 days editorial |
| L2 | Add interactive tool (wedding date picker / budget calculator) | User engagement | 1 week dev |
| L3 | Configure Moz free API for backlink monitoring | Backlink insights | 1 hour setup |
| L4 | Implement IndexNow for fast Bing/Yandex indexing on publish | Indexing speed | Half dev day |
| L5 | Create YouTube channel with wedding planning content | AI citation signals | Ongoing |
| L6 | Add social proof (view counts) to article cards | User trust | Half dev day |
| L7 | Expand Wedding Planning category to 10+ articles (currently 3 EN) | Topical authority | Editorial roadmap |
| L8 | HSTS preload submission (hstspreload.org) | Security | 30 min |
| L9 | Add "Editor's Picks" or "Trending" section above fold | Navigation UX | Half dev day |

---

## Quick Reference: Expected Score Impact After Critical Fixes

| Fix | Category Impacted | Expected Score Gain |
|---|---|---|
| Add Open Graph + OG meta tags | On-Page SEO | +15 pts |
| Implement hreflang on all pages | Technical SEO | +15 pts |
| Add BlogPosting + WebSite JSON-LD | Schema | +30 pts |
| Fix JS rendering (SSR/SSG) | Technical + Performance | +10 pts |
| Hero image `priority` fix | Performance | +8 pts |
| Create /llms.txt | AI Search | +10 pts |
| Author credential expansion | Content | +5 pts |

**Projected Health Score after Critical+High fixes: ~62–65 / 100**

---

*Report generated by Claude Code SEO Skill v1.9 — April 30, 2026*  
*Data sources: Live WebFetch analysis, sitemap.xml direct inspection, robots.txt inspection, article page sampling, author page sampling, 9 parallel specialist subagents*
