# Action Plan — event4me.vip
**Date:** April 30, 2026  
**SEO Health Score:** 43 / 100  
**Target after fixes:** 62–65 / 100

---

## CRITICAL — Week 1 (Do Immediately)

### C1. Open Graph + Twitter Card Meta Tags
**What:** Add to ALL page templates in Next.js layout.tsx (or _app.tsx)  
**Why:** Zero OG tags = blank social share cards on Pinterest, Instagram, Telegram — killing referral traffic  
**How:**
```html
<meta property="og:type" content="article" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={heroImageUrl} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:site_name" content="EventForMe" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:image" content={heroImageUrl} />
```
**Owner:** Dev  **ETA:** 1 day

---

### C2. Hreflang Tags on All Pages
**What:** Add to every page via Next.js layout component  
**Why:** Bilingual /ru/ and /en/ URL trees with no hreflang = duplicate content signals + wrong language served to wrong audience  
**How:**
```html
<link rel="alternate" hreflang="ru" href="https://event4me.vip/ru/[slug]" />
<link rel="alternate" hreflang="en" href="https://event4me.vip/en/[slug]" />
<link rel="alternate" hreflang="x-default" href="https://event4me.vip/ru/[slug]" />
```
Each page must declare BOTH language variants pointing to each other. Russian is x-default (primary audience).  
**Owner:** Dev  **ETA:** 1 day

---

### C3. Remove Search Pages from Sitemap
**What:** Remove `/ru/search` and `/en/search` from sitemap.xml  
**Why:** Search result pages must not be in sitemaps — they are noindexed (verify) and dynamic  
**How:** Update sitemap generation config to exclude /search routes  
**Owner:** Dev  **ETA:** 10 minutes

---

### C4. BlogPosting JSON-LD on All Article Pages
**What:** Add dynamically-generated Article schema to every article page template  
**Why:** Ineligible for rich results, author attribution in SERPs, and Google Discover without this  
**How:** Add to article page template using data from CMS:
```json
{ "@type": "BlogPosting", "headline": "...", "author": {...}, "datePublished": "...", "image": {...} }
```
(See full sample in FULL-AUDIT-REPORT.md Section 4)  
**Owner:** Dev  **ETA:** 1 day

---

### C5. WebSite + Organization JSON-LD on Homepage
**What:** Add to homepage layout only  
**Why:** Enables Sitelinks Search Box in SERPs, establishes brand entity in Google's Knowledge Graph  
**How:** See full JSON-LD sample in FULL-AUDIT-REPORT.md Section 4  
**Note:** Verify actual search URL pattern: is it `/en/search?q=` or `/ru/search?q=`?  
**Owner:** Dev  **ETA:** 2 hours

---

### C6. Fix JavaScript Rendering ("Loading..." States)
**What:** Migrate article card lists, category feeds, and navigation to Next.js SSG or SSR  
**Why:** Confirmed "Loading..." placeholders = content absent from initial HTML = Googlebot may not index it  
**How:** Convert client-side data fetches to `getStaticProps` (SSG) or `getServerSideProps` (SSR). Priority: homepage article feed, /articles page, category hub pages  
**Owner:** Dev  **ETA:** 2–3 days

---

### C7. Hero Image Priority Fix (LCP)
**What:** Add `priority` prop to first above-fold `<Image>` on all page types  
**Why:** Next.js lazy-loads all images by default. Hero image is almost certainly the LCP element — lazy-loading it causes 1.5–2.5s LCP delay  
**How:**
```jsx
<Image src={heroImageUrl} alt={heroAlt} width={1920} height={1080} priority />
```
**Owner:** Dev  **ETA:** 30 minutes

---

## HIGH — Week 2

### H1. Create /llms.txt
**What:** Create https://event4me.vip/llms.txt with site summary, category map, author list  
**Why:** AI crawlers (ChatGPT, Perplexity, Claude) use this for accurate site understanding and citation  
**How:** Create static file in /public/llms.txt (see template in FULL-AUDIT-REPORT.md Section 6)  
**Owner:** Editorial + Dev  **ETA:** 3 hours

### H2. Person + ProfilePage JSON-LD on Author Pages
**What:** Add author schema to all 13 author page templates  
**Why:** Enables author entity disambiguation for E-E-A-T and AI citation  
**Owner:** Dev  **ETA:** 4 hours

### H3. Fix Sitemap lastmod for Navigation Pages
**What:** Update sitemap generation so navigation/category pages use real modification dates  
**Why:** All nav pages currently share `2026-04-30T09:51:53.386Z` — signals to Googlebot that all pages changed simultaneously  
**Owner:** Dev  **ETA:** 2 hours

### H4. Author Credential Expansion
**What:** Add professional title, expertise summary, and external links to all 13 author pages  
**Minimum per author:** Job title, 300+ word bio, area of expertise, 1+ external link (LinkedIn or portfolio)  
**Note:** Authors with <3 articles should be noindexed until they publish more  
**Owner:** Editorial  **ETA:** 1 day editorial work

### H5. Create About Page
**What:** Dedicated /about page with editorial mission, team overview, content standards  
**Why:** Required trust signal per Google's Quality Rater Guidelines  
**Owner:** Editorial  **ETA:** Half day

### H6. Migrate to next/font
**What:** Replace Google Fonts `<link>` or CSS `@import` with Next.js `next/font/google`  
**Why:** Eliminates external network request, enables `font-display: swap`, prevents CLS from FOUT  
**Owner:** Dev  **ETA:** Half day

### H7. Audit and Fix Canonical Tags
**What:** Verify every page has `<link rel="canonical">` pointing to itself (correct locale URL)  
**How:** Check 10 pages in Google Search Console URL Inspection Tool  
**Owner:** Dev + SEO  **ETA:** 1 day

### H8. Noindex Thin Author Pages
**What:** Add `<meta name="robots" content="noindex">` to author pages with <3 published articles  
**Owner:** Dev  **ETA:** 2 hours

---

## MEDIUM — Month 1

- [ ] Add external citations to factual articles (1–2 external links per article)
- [ ] Strip `<priority>` and `<changefreq>` from sitemap (ignored by Google)
- [ ] Add security headers via Cloudflare/Vercel (HSTS, X-Content-Type-Options, etc.)
- [ ] Add newsletter/Telegram subscription CTA with lead magnet (Wedding Checklist PDF)
- [ ] Add category tags + author name + read time to article listing cards
- [ ] Add visible "Last Updated" dates to articles + dateModified in schema
- [ ] Ensure all `<img>` tags have explicit width/height attributes
- [ ] Defer all third-party scripts (analytics, social embeds) via `strategy="lazyOnload"`
- [ ] Add `<link rel="preconnect">` for Google Fonts + image CDN origins

---

## LOW — Backlog

- [ ] Build pillar pages for core planning intents (2,500+ word guides per category)
- [ ] Add interactive wedding tools (date picker, budget calculator)
- [ ] Configure Moz free API for backlink monitoring
- [ ] Implement IndexNow for fast Bing/Yandex indexing
- [ ] Start YouTube channel with branded wedding content
- [ ] Expand Wedding Planning category from 3 to 10+ English articles
- [ ] Expand Wiki/Encyclopedia from 1 to 10+ articles
- [ ] HSTS preload submission (hstspreload.org)

---

## Score Projections

| Phase | Actions | Expected Score |
|---|---|---|
| Current | — | 43/100 |
| After Critical (Week 1) | C1–C7 | ~55/100 |
| After High (Week 2) | H1–H8 | ~62/100 |
| After Medium (Month 1) | M1–M9 | ~68/100 |
| After Low (Quarter 2) | L1–L9 | ~75/100 |
