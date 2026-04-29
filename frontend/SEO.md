 EventForMe SEO Audit Report
                                                                                                                                                                                                                                                                
  URL: https://event4me.vip | Date: 2026-04-28 | Business Type: Publisher / Wedding Blog
                                                                                                                                                                                                                                                                
  ---
  SEO Health Score: 41 / 100                                                                                                                                                                                                                                    
                                                 
  ┌──────────────────────────┬────────┬────────┬───────────┐
  │         Category         │ Weight │ Score  │ Weighted  │                                                                                                                                                                                                    
  ├──────────────────────────┼────────┼────────┼───────────┤
  │ Technical SEO            │ 22%    │ 44/100 │ 9.7       │                                                                                                                                                                                                    
  ├──────────────────────────┼────────┼────────┼───────────┤
  │ Content Quality          │ 23%    │ 54/100 │ 12.4      │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ On-Page SEO              │ 20%    │ 28/100 │ 5.6       │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ Schema / Structured Data │ 10%    │ 12/100 │ 1.2       │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ Performance (CWV)        │ 10%    │ 50/100 │ 5.0       │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ AI Search Readiness      │ 10%    │ 47/100 │ 4.7       │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ Images                   │ 5%     │ 18/100 │ 0.9       │
  ├──────────────────────────┼────────┼────────┼───────────┤                                                                                                                                                                                                    
  │ Total                    │        │        │ 39.5 → 41 │
  └──────────────────────────┴────────┴────────┴───────────┘                                                                                                                                                                                                    
  
  ---                                                                                                                                                                                                                                                           
  Site Overview                                  

  ┌────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │   Signal   │                                                                              Detail                                                                               │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Platform   │ Next.js (confirmed via /_next/image URL pattern)                                                                                                                  │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ CMS        │ Headless, hosted at cms.event4me.vip                                                                                                                              │                                                                            
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Languages  │ Bilingual: English (/en/) + Russian (/ru/)                                                                                                                        │                                                                            
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Categories │ 8 rubrics: Ideas & Inspiration, Astrology & Mysticism, People & Events, Wedding Planning, Traditions, Honeymoon & Travel, Beauty & Wellness, Wedding Encyclopedia │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Articles   │ 27 English + 27 Russian = 43 unique URLs in sitemap                                                                                                               │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Authors    │ 12 contributors + 2 illustrators                                                                                                                                  │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Sitemap    │ 163 URLs (bilingual) — confirmed                                                                                                                                  │
  ├────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                            
  │ Robots.txt │ Properly configured, sitemap declared                                                                                                                             │
  └────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘                                                                            
                                                 
  ---
  Critical Issues
                 
  C1 — No Hreflang Tags on Any Page
                                                                                                                                                                                                                                                                
  Impact: Duplicate content penalty + language targeting failure                                                                                                                                                                                                
                                                                                                                                                                                                                                                                
  Every article, category, and author page tested shows zero hreflang tags. For a bilingual EN/RU site with parallel URL structures (/en/ and /ru/), this is a critical omission. Google cannot determine:                                                      
  - Which language version to serve to which audience
  - That the two versions are translations (not duplicate content)                                                                                                                                                                                              
  - The x-default fallback for users without a language preference
                                                                                                                                                                                                                                                                
  The Russian version is the primary market (Yandex crawl delay set in robots.txt — clear signal). Without hreflang, Russian-language content ranks against its own English counterpart.
                                                                                                                                                                                                                                                                
  Fix: Add hreflang to every page's <head>:                                                                                                                                                                                                                     
  <link rel="alternate" hreflang="en" href="https://event4me.vip/en/article-slug" />                                                                                                                                                                            
  <link rel="alternate" hreflang="ru" href="https://event4me.vip/ru/article-slug" />                                                                                                                                                                            
  <link rel="alternate" hreflang="x-default" href="https://event4me.vip/en/article-slug" />                                                                                                                                                                     
  Also declare in the sitemap as <xhtml:link rel="alternate"> within each <url> block. In Next.js, implement via next/head or via the alternates key in the App Router generateMetadata() function.                                                             
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  C2 — Meta Descriptions Missing on Article Pages
                                                                                                                                                                                                                                                                
  Impact: Google auto-generates poor snippets, lowering CTR
                                                                                                                                                                                                                                                                
  Verified absent on:                                                                                                                                                                                                                                           
  - /en/wellness/bodyguard-in-a-tube-everything-you-need-to-know-about-sunscreen                                                                                                                                                                                
  - /en/ideas/anti-bride-5-summer-looks-for-brides-who-dont-want-to-play-princess                                                                                                                                                                               
  - /en/rubrics (category hub page)                                              
                                                                                                                                                                                                                                                                
  The homepage has a description ("A blog about weddings and more. Tips on planning, stylish ideas and the latest trends.") but this appears to be a site-wide default, not page-specific.                                                                      
                                                                                                                                                                                                                                                                
  Fix: In Next.js App Router, add to every page's generateMetadata():                                                                                                                                                                                           
  export async function generateMetadata({ params }) {                                                                                                                                                                                                          
    return {                                                                                                                                                                                                                                                    
      description: article.excerpt || article.content.substring(0, 155),
    }                                                                   
  }                                                                                                                                                                                                                                                             
  Target 150-160 characters, include the primary keyword naturally.
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  C3 — No Canonical Tags Visible on Article Pages
                                                                                                                                                                                                                                                                
  Impact: Duplicate content from /en/ vs /ru/ URLs + parameter variants
                                                                                                                                                                                                                                                                
  Three separate article page fetches returned no canonical tag. With a headless Next.js setup serving bilingual content, canonicals must be explicitly set on every page. Without them:                                                                        
  - Paginated archives (/en/articles?page=2) may compete with page 1                                                                                                                                                                                            
  - ?from= parameter URLs (blocked in robots.txt) may still leak if not canonicalized                                                                                                                                                                           
  - The /en/ and /ru/ versions lack a declared canonical relationship                
                                                                                                                                                                                                                                                                
  Fix:                                                                                                                                                                                                                                                          
  // In generateMetadata()                                                                                                                                                                                                                                      
  alternates: {                                                                                                                                                                                                                                                 
    canonical: `https://event4me.vip/en/${slug}`,                                                                                                                                                                                                               
    languages: {                                 
      'en': `https://event4me.vip/en/${slug}`,                                                                                                                                                                                                                  
      'ru': `https://event4me.vip/ru/${slug}`,
    },                                                                                                                                                                                                                                                          
  },                                             

  ---                                                                                                                                                                                                                                                           
  High Priority Issues
                                                                                                                                                                                                                                                                
  H1 — All Article Images Missing Alt Text       

  Impact: Accessibility fail + lost image search traffic                                                                                                                                                                                                        
  
  Confirmed on multiple articles:                                                                                                                                                                                                                               
  - Honeymoon in Russia — 10 images, zero alt text (Divnogorye, Kazan Kremlin, Kizhi, etc.)
  - Anti-Bride — alt text not provided in markup                                                                                                                                                                                                                
  - Sunscreen — alt text absent                 
                                                                                                                                                                                                                                                                
  For a wedding planning publisher, image search is a significant discovery channel. Alt text on "Kazan Kremlin wedding venue", "spring bridal bouquet", or "anti-bride summer look" drives real traffic.
                                                                                                                                                                                                                                                                
  Fix: Populate alt text at the CMS level (Directus/headless CMS image field) so it propagates automatically. Pattern: [subject] [context] — e.g., "Kazan Kremlin — honeymoon destination in Russia" not "image1".                                              
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  H2 — OG Image Uses Dynamic Next.js URL         
                                                                                                                                                                                                                                                                
  Impact: Broken social previews on Facebook, LinkedIn, Slack
                                                                                                                                                                                                                                                                
  OG image detected as: /_next/image?url=https%3A%2F%2Fcms.event4me.vip%2Fassets%2F...                                                                                                                                                                          
                                                                                                                                                                                                                                                                
  This is a Next.js image optimization URL — a relative path with query parameters. Social crawlers (Facebook, LinkedIn, Slack, Twitter/X) do not execute JavaScript and often cannot follow Next.js image proxy URLs. Results:                                 
  - Facebook: no image preview on article shares 
  - LinkedIn: broken card                                                                                                                                                                                                                                       
  - Slack/Teams: no unfurl                       
                                                                                                                                                                                                                                                                
  Fix: Set og:image to the direct absolute URL of the image from cms.event4me.vip:
  openGraph: {                                                                                                                                                                                                                                                  
    images: [{
      url: `https://cms.event4me.vip/assets/${article.image.id}`, // direct CMS URL                                                                                                                                                                             
      width: 1200,                                                                 
      height: 630,                                                                                                                                                                                                                                              
    }]                                           
  }                                                                                                                                                                                                                                                             
  Or use Next.js generateImageMetadata to serve a statically hosted image. Avoid the /_next/image proxy for OG tags.                                                                                                                                            
  
  ---                                                                                                                                                                                                                                                           
  H3 — No Article Schema (BlogPosting) on Article Pages
                                                                                                                                                                                                                                                                
  Impact: No rich snippets, no Google Discover eligibility, weak E-E-A-T signals
                                                                                                                                                                                                                                                                
  Despite the homepage meta suggesting schema exists, every article page fetched returns no JSON-LD. This is a critical gap for a publisher. BlogPosting schema:                                                                                                
  - Enables Google Discover (major traffic source for wedding content)                                                                                                                                                                                          
  - Signals authorship to Google for E-E-A-T evaluation                                                                                                                                                                                                         
  - Enables article rich results (headline, date, author image in SERPs)
                                                                                                                                                                                                                                                                
  Fix: Add to every article page template:                                                                                                                                                                                                                      
  {                                                                                                                                                                                                                                                             
    "@context": "https://schema.org",                                                                                                                                                                                                                           
    "@type": "BlogPosting",                                                                                                                                                                                                                                     
    "headline": "{{article.title}}",             
    "description": "{{article.excerpt}}",
    "datePublished": "{{article.date_created}}",
    "dateModified": "{{article.date_updated}}",                                                                                                                                                                                                                 
    "image": { "@type": "ImageObject", "url": "https://cms.event4me.vip/assets/{{article.image.id}}", "width": 1200, "height": 630 },
    "author": { "@type": "Person", "@id": "https://event4me.vip/en/authors/{{author.slug}}/#person", "name": "{{author.name}}", "url": "https://event4me.vip/en/authors/{{author.slug}}" },                                                                     
    "publisher": { "@type": "Organization", "@id": "https://event4me.vip/#org", "name": "EventForMe", "logo": { "@type": "ImageObject", "url": "https://event4me.vip/logo.png" } },        
    "mainEntityOfPage": "https://event4me.vip/en/{{rubric}}/{{slug}}"                                                                                                                                                                                           
  }                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  H4 — Author E-E-A-T Signals Are Thin                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                
  Impact: Low trust score from Google for YMYL-adjacent content
                                                                                                                                                                                                                                                                
  Wedding planning, while not strictly YMYL, overlaps with financial planning (budgeting), health (wellness articles), and relationship guidance (psychology articles). Author bio review:                                                                      
                                                                                                                                                                                                                                                                
  - Max Neumann: "intersection of music, ceremonial traditions, and event design" — no credentials, no formal qualifications                                                                                                                                    
  - Leda Golovanova: "astropsychology" — informal expertise framing
  - Author social links: Point to @eventforme (the publication's accounts), not the author's personal profiles                                                                                                                                                  
  - Samoed Spirit: Pen name — pseudonymous authors hurt E-E-A-T significantly per Google's QRG                                                                                                                                                                  
                                                                                                                                                                                                                                                                
  Fix:                                                                                                                                                                                                                                                          
  1. Replace social links on author pages with each author's personal Instagram/LinkedIn/professional website                                                                                                                                                   
  2. Add qualifications/credentials to author bios (e.g., "certified wedding planner", "professional astrologer", "fashion journalist at [publication]")                                                                                                        
  3. For pen names (Samoed Spirit), either reveal real identity or add substantial biography establishing credibility                                   
  4. Add Person schema with sameAs pointing to the author's external professional profiles                                                                                                                                                                      
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  H5 — WebSite + Organization Schema Missing/Unconfirmed on Homepage                                                                                                                                                                                            
                                                                                                                                                                                                                                                                
  Impact: No sitelinks search box for branded queries
                                                                                                                                                                                                                                                                
  Though the homepage description mentioned Organization schema, no JSON-LD was visible in direct page fetches. The WebSite schema with SearchAction is required for Google's Sitelinks Search Box — a significant CTR advantage for branded wedding planning   
  searches.                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                                
  Fix: Add to homepage <head> site-wide:         
  [
    {                                                                                                                                                                                                                                                           
      "@context": "https://schema.org", "@type": "WebSite", "@id": "https://event4me.vip/#website",
      "name": "EventForMe", "url": "https://event4me.vip",                                                                                                                                                                                                      
      "potentialAction": { "@type": "SearchAction", "target": "https://event4me.vip/en/articles?search={search_term_string}", "query-input": "required name=search_term_string" }
    },                                                                                                                                                                                                                                                          
    {                                                                                                                                                                                                                                                           
      "@context": "https://schema.org", "@type": "Organization", "@id": "https://event4me.vip/#org",                                                                                                                                                            
      "name": "EventForMe", "url": "https://event4me.vip",                                                                                                                                                                                                      
      "sameAs": ["https://t.me/eventforme", "https://instagram.com/eventforme"]                                                                                                                                                                                 
    }
  ]                                                                                                                                                                                                                                                             
                                                 
  ---                                                                                                                                                                                                                                                           
  H6 — Security Headers Not Verified             
                                    
  Impact: Trust signals, potential mixed content
                                                                                                                                                                                                                                                                
  The .vip TLD on a headless CMS stack typically lacks HSTS, X-Content-Type-Options, X-Frame-Options, and Referrer-Policy. The Next.js app also loads assets from cms.event4me.vip — ensure CORS and CSP headers cover the cross-domain asset loading.          
                                                                                                                                                                                                                                                                
  Fix (Cloudflare Transform Rule — 15 minutes):                                                                                                                                                                                                                 
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff                                                                                                                                                                                                                               
  X-Frame-Options: SAMEORIGIN                                                                                                                                                                                                                                   
  Referrer-Policy: strict-origin-when-cross-origin
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  H7 — "Wellness" and "Wiki" Categories Are Underdeveloped
                                                                                                                                                                                                                                                                
  Impact: Thin category pages dilute topical authority
                                                                                                                                                                                                                                                                
  - Beauty & Wellness (/en/wellness): 3 articles, including one about sunscreen (1,200-1,400 words — below threshold for wellness guides)                                                                                                                       
  - Wedding Encyclopedia (/en/wiki): Only 1 article — this is the thinnest category on the site
                                                                                                                                                                                                                                                                
  Category pages with 1-3 articles have minimal ranking potential and consume crawl budget without providing value.                                                                                                                                             
                                                                                                                                                                                                                                                                
  Fix: Either expand these categories (minimum 8-10 articles each to build authority) or consolidate wiki into planning and redirect the URL. Noindex categories with fewer than 5 articles while building them out.                                            
                                                 
  ---                                                                                                                                                                                                                                                           
  Medium Priority Issues                         

  M1 — BreadcrumbList Schema Missing

  Article breadcrumbs are visible in the UI (Ideas & Inspiration > Bride > Wedding Fashion) but no BreadcrumbList JSON-LD is output. This costs SERP real-estate on category-based wedding queries.                                                             
  
  M2 — llms.txt Exists But Not Structured                                                                                                                                                                                                                       
                                                 
  The site has content at /llms.txt (prose description of the site) but it's not in the standard llms.txt format. AI crawlers will benefit more from structured sections with H1/H2 document structure.                                                         
                                                 
  Fix:                                                                                                                                                                                                                                                          
  # EventForMe                                   
              
  > An independent bilingual wedding and event planning blog with curated editorial content.
                                                                                                                                                                                                                                                                
  ## Content Sections
  - /en/ideas - Wedding ideas and inspiration                                                                                                                                                                                                                   
  - /en/planning - Wedding planning guides       
  - /en/travel - Honeymoon and travel content
  - /en/mystic - Astrology and wedding timing
                                                                                                                                                                                                                                                                
  M3 — OG Type and Twitter Card Tags Unconfirmed
                                                                                                                                                                                                                                                                
  Article pages show og:image but og:type, og:description, and twitter:card values are not confirmed. Publisher sites should use og:type = article and twitter:card = summary_large_image on all article pages.                                                 
                                                                                                                                                                                                                                                                
  M4 — Astrology Content Strategy Risk                                                                                                                                                                                                                          
                                                 
  "Astrology & Mysticism" (4 articles, including horoscopes) is a legitimate wedding niche, but Google may evaluate E-E-A-T differently for astrology content vs. wedding planning. The author (Leda Golovanova, "astropsychology") has informal credentials.   
  Ensure astrology articles have strong author E-E-A-T and clear disclaimers distinguishing entertainment from advice.
                                                                                                                                                                                                                                                                
  M5 — Rubrics Page Has Thin Content             

  /en/rubrics is 800-900 words of mostly navigation links. This page ranks for nothing but consumes crawl budget. Add a short editorial description (100-150 words) to each category card and expand the page's unique content.                                 
  
  M6 — IndexNow Not Implemented                                                                                                                                                                                                                                 
                                                 
  For a publisher posting new articles regularly, IndexNow dramatically reduces Bing/Yandex indexing latency. Implement via a Next.js API route that POSTs to api.indexnow.org on every article publish event.                                                  
                                                 
  M7 — Yandex Crawl Delay Set to 2 Seconds                                                                                                                                                                                                                      
                                                 
  Crawl-delay: 2 in the Yandex section of robots.txt slows Yandex discovery of new articles. Given the Russian primary audience, reduce to 1 second or remove entirely unless server capacity is constrained.                                                   
                                                 
  M8 — Category URL Inconsistency (Slugs vs Display Names)                                                                                                                                                                                                      
                                                 
  The displayed category is "Astrology & Mysticism" but the URL is /en/mystic. Similarly, "Beauty & Wellness" → /en/wellness. While the short slug is fine, ensure internal links and schema articleSection values consistently use the canonical name.         
                                                 
  ---                                                                                                                                                                                                                                                           
  Low Priority Issues                            
                     
  L1 — No Person Schema on Author Pages
                                                                                                                                                                                                                                                                
  Author pages exist (/en/authors/max-neumann) but carry no Person or ProfilePage schema.                                                                                                                                                                       
                                                                                                                                                                                                                                                                
  L2 — No ItemList Schema on Category Pages                                                                                                                                                                                                                     
                                                 
  Category hub pages should carry ItemList schema linking to each article — improves how Google understands content architecture.                                                                                                                               
  
  L3 — "Wedding Encyclopedia" Single Article                                                                                                                                                                                                                    
                                                 
  /en/wiki with 1 article should either be expanded aggressively or redirected/merged into Wedding Planning.                                                                                                                                                    
                                                 
  L4 — No FAQ Schema on Planning Guides                                                                                                                                                                                                                         
                                                 
  Not recommended for Google rich results (commercial site, post-Aug 2023 restriction), but high value for AI citation readiness (Perplexity, ChatGPT). Add to top planning guide articles.                                                                     
                                                 
  L5 — No RSS Feed                                                                                                                                                                                                                                              
                                                 
  Many wedding industry professionals and aggregators use RSS. A publisher blog without RSS misses a distribution channel. Next.js supports RSS generation easily.                                                                                              
                                                 
  ---                                                                                                                                                                                                                                                           
  Content Cluster Architecture Analysis          
                                                                                                                                                                                                                                                                
  Current site has 8 rubrics but they function as flat categories, not true topic clusters. The site lacks clear hub-and-spoke architecture.
                                                                                                                                                                                                                                                                
  Recommended Cluster Structure:                 
                                                                                                                                                                                                                                                                
  ┌────────────────────────┬──────────────────┬───────────────────────────────────────────────────────────────────┐                                                                                                                                             
  │      Hub (Pillar)      │ Current Coverage │                                Gap                                │
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤                                                                                                                                             
  │ Wedding Planning Guide │ 3 articles       │ Need 15+ spokes: budget, timeline, vendors, venue, invitations    │
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤
  │ Bridal Fashion & Style │ 2-3 articles     │ Need: accessories, shoes, bridesmaids, groom attire               │                                                                                                                                             
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤                                                                                                                                             
  │ Honeymoon Destinations │ 3 articles       │ Need: Europe, Asia, budget options, all-inclusive                 │                                                                                                                                             
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤                                                                                                                                             
  │ Wedding Traditions     │ 3 articles       │ Need: by culture/country, modern vs. traditional                  │
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤                                                                                                                                             
  │ Wedding Astrology      │ 4 articles       │ Niche but defensible — add: dates by zodiac sign, ceremony timing │
  ├────────────────────────┼──────────────────┼───────────────────────────────────────────────────────────────────┤                                                                                                                                             
  │ Beauty & Wellness      │ 3 articles       │ Need: skincare prep timeline, hair, fitness for brides            │
  └────────────────────────┴──────────────────┴───────────────────────────────────────────────────────────────────┘                                                                                                                                             
                                                 
  Priority gaps for ranking potential:                                                                                                                                                                                                                          
  1. "Wedding Planning Checklist" — highest-volume query in the niche, not covered
  2. "Wedding Budget Calculator/Guide" — commercial intent, high value                                                                                                                                                                                          
  3. "Wedding Venue Ideas" — hub page missing entirely                
  4. "Honeymoon Packing List" — informational, high volume, easy to write                                                                                                                                                                                       
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  Sitemap Analysis                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                
  Score: 68/100                                  
                                                                                                                                                                                                                                                                
  ┌─────────────────────────────────────┬──────────────────────────────────────────────────┐
  │               Signal                │                      Status                      │                                                                                                                                                                    
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ 163 URLs indexed                    │ ✓ Good                                           │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Bilingual parallel structure        │ ✓ Good                                           │                                                                                                                                                                    
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤
  │ Sitemap declared in robots.txt      │ ✓ Good                                           │                                                                                                                                                                    
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ lastmod dates current (2026-04-28)  │ ✓ Good                                           │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ Priority hierarchy logical          │ ✓ Good                                           │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ Hreflang <xhtml:link> in sitemap    │ ✗ Missing                                        │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ Author pages (26 URLs) included     │ ⚠ Consider noindex for thin author pages         │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ "Wedding encyclopedia" 1 article    │ ⚠ Thin category                                  │
  ├─────────────────────────────────────┼──────────────────────────────────────────────────┤                                                                                                                                                                    
  │ changefreq "weekly" on all articles │ ⚠ Inaccurate — most articles don't update weekly │
  └─────────────────────────────────────┴──────────────────────────────────────────────────┘                                                                                                                                                                    
                                                 
  Fix: Add hreflang cross-references inside each <url> block and correct changefreq to monthly for articles that don't update frequently.                                                                                                                       
                                                 
  ---                                                                                                                                                                                                                                                           
  Robots.txt Analysis                            

  Score: 75/100

  ┌────────────────────────────────────┬─────────────────────────────────────────────────────────────────┐
  │               Signal               │                             Status                              │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ Sitemap declared                   │ ✓                                                               │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ Admin/API paths blocked            │ ✓                                                               │                                                                                                                                                      
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
  │ ?from= parameter blocked           │ ✓                                                               │                                                                                                                                                      
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤                                                                                                                                                      
  │ Host declared (Yandex)             │ ✓                                                               │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤                                                                                                                                                      
  │ AI crawlers (GPTBot, ClaudeBot)    │ ✓ Allowed (default * rules)                                     │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤                                                                                                                                                      
  │ Googlebot-specific rules           │ ✓ Present                                                       │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤                                                                                                                                                      
  │ Yandex crawl delay 2s              │ ⚠ Reduce for faster indexing                                    │
  ├────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤                                                                                                                                                      
  │ AI crawlers not explicitly allowed │ ⚠ Add explicit allow rules for GPTBot, ClaudeBot, PerplexityBot │
  └────────────────────────────────────┴─────────────────────────────────────────────────────────────────┘                                                                                                                                                      
                                                
  Fix: Add explicit allow for AI crawlers:                                                                                                                                                                                                                      
  User-agent: GPTBot                            
  Allow: /                                                                                                                                                                                                                                                      
                                                
  User-agent: ClaudeBot
  Allow: /             
          
  User-agent: PerplexityBot
  Allow: /                                                                                                                                                                                                                                                      
  
  ---                                                                                                                                                                                                                                                           
  GEO / AI Search Readiness                     

  Score: 47/100

  ┌─────────────────────────────────────┬──────────────────────────────────────┐                                                                                                                                                                                
  │               Signal                │                Status                │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ AI crawlers allowed                 │ ✓                                    │
  ├─────────────────────────────────────┼──────────────────────────────────────┤
  │ llms.txt exists                     │ ✓ (prose format)                     │
  ├─────────────────────────────────────┼──────────────────────────────────────┤
  │ Structured article headings (H2/H3) │ ✓ Good                               │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ Article depth (1,800-4,000 words)   │ ✓ Good for citation                  │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ No schema for AI to parse           │ ✗ Missing                            │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ Weak author E-E-A-T                 │ ✗ Reduces AI citation probability    │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ No FAQ sections confirmed           │ ✗ Missing passage-level answers      │
  ├─────────────────────────────────────┼──────────────────────────────────────┤                                                                                                                                                                                
  │ Missing meta descriptions           │ ✗ AI summaries may miss page context │
  └─────────────────────────────────────┴──────────────────────────────────────┘                                                                                                                                                                                
  
  For AI Overviews eligibility on wedding planning queries, the most important action is: structured schema + strong author credentials + FAQ-formatted content sections.                                                                                       
                                                
  ---                                                                                                                                                                                                                                                           
  Prioritized Action Plan                       
                         
  Week 1 — Critical Fixes
                                                                                                                                                                                                                                                                
  ┌─────┬───────────────────────────────────────────────────────────────────────────┬───────────┬──────────┐
  │  #  │                                  Action                                   │  Effort   │  Impact  │                                                                                                                                                    
  ├─────┼───────────────────────────────────────────────────────────────────────────┼───────────┼──────────┤
  │ 1   │ Implement hreflang on all EN/RU pages + sitemap                           │ 1 dev day │ Critical │
  ├─────┼───────────────────────────────────────────────────────────────────────────┼───────────┼──────────┤
  │ 2   │ Add canonical tags to all article page templates                          │ 2 hours   │ Critical │                                                                                                                                                    
  ├─────┼───────────────────────────────────────────────────────────────────────────┼───────────┼──────────┤
  │ 3   │ Add meta descriptions to all article templates (dynamic from CMS excerpt) │ 2 hours   │ Critical │                                                                                                                                                    
  ├─────┼───────────────────────────────────────────────────────────────────────────┼───────────┼──────────┤                                                                                                                                                    
  │ 4   │ Fix OG image to use absolute CMS URL, not /_next/image proxy              │ 1 hour    │ High     │
  ├─────┼───────────────────────────────────────────────────────────────────────────┼───────────┼──────────┤                                                                                                                                                    
  │ 5   │ Add image alt text fields in CMS and populate for existing articles       │ 3 hours   │ High     │
  └─────┴───────────────────────────────────────────────────────────────────────────┴───────────┴──────────┘                                                                                                                                                    
                                                
  Week 2 — Schema + E-E-A-T                                                                                                                                                                                                                                     
                                                
  ┌─────┬──────────────────────────────────────────────────────────────────────────────────────┬────────────────┬────────┐
  │  #  │                                        Action                                        │     Effort     │ Impact │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────┼────────────────┼────────┤                                                                                                                                      
  │ 6   │ Add BlogPosting JSON-LD to article templates                                         │ 3 hours        │ High   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────┼────────────────┼────────┤                                                                                                                                      
  │ 7   │ Add BreadcrumbList schema to article + category templates                            │ 2 hours        │ High   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────┼────────────────┼────────┤                                                                                                                                      
  │ 8   │ Add WebSite + Organization schema to homepage/layout                                 │ 1 hour         │ High   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────┼────────────────┼────────┤                                                                                                                                      
  │ 9   │ Update author bios: add credentials, personal social links, replace site-level links │ 2 hours/author │ High   │
  ├─────┼──────────────────────────────────────────────────────────────────────────────────────┼────────────────┼────────┤                                                                                                                                      
  │ 10  │ Add security headers via Cloudflare                                                  │ 15 min         │ High   │
  └─────┴──────────────────────────────────────────────────────────────────────────────────────┴────────────────┴────────┘                                                                                                                                      
                                                
  Month 1 — Content & Architecture                                                                                                                                                                                                                              
  
  ┌─────┬───────────────────────────────────────────────────────────────┬──────────┬────────┐                                                                                                                                                                   
  │  #  │                            Action                             │  Effort  │ Impact │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤
  │ 11  │ Write "Wedding Planning Checklist" pillar page (3,000+ words) │ 2 days   │ High   │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤
  │ 12  │ Write "Wedding Budget Guide" (2,500+ words)                   │ 1.5 days │ High   │                                                                                                                                                                   
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 13  │ Expand Wedding Encyclopedia to 8-10 articles                  │ 5 days   │ Medium │                                                                                                                                                                   
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 14  │ Add Person schema to all author pages                         │ 1 hour   │ Medium │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 15  │ Implement IndexNow on article publish events                  │ 2 hours  │ Medium │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 16  │ Structure llms.txt properly                                   │ 30 min   │ Medium │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 17  │ Reduce Yandex crawl delay to 0.5s                             │ 5 min    │ Medium │
  ├─────┼───────────────────────────────────────────────────────────────┼──────────┼────────┤                                                                                                                                                                   
  │ 18  │ Add RSS feed                                                  │ 2 hours  │ Low    │
  └─────┴───────────────────────────────────────────────────────────────┴──────────┴────────┘                                                                                                                                                                   
                                                
  Ongoing                                                                                                                                                                                                                                                       
                                                
  - Grow each category to 10+ articles before targeting competitive head terms                                                                                                                                                                                  
  - Add explicit AI crawler allow rules to robots.txt
  - Build author external presence (bylines on other wedding publications)                                                                                                                                                                                      
  - Submit sitemap to Google Search Console and Bing Webmaster Tools                                                                                                                                                                                            
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  Summary                                       
         
  EventForMe has a solid editorial foundation — good article depth (1,800-4,000 words), a structured 8-category taxonomy, 12+ contributors, and a modern headless Next.js/CMS stack. The bilingual structure is a strategic strength that's being left on the
  table by the absence of hreflang tags.                                                                                                                                                                                                                        
  
  The three highest-impact actions are:                                                                                                                                                                                                                         
  1. Hreflang implementation — the single most impactful fix for the bilingual site
  2. Article meta descriptions + canonical tags — basic on-page fundamentals that are missing across the board                                                                                                                                                  
  3. BlogPosting schema — unlocks Google Discover traffic and rich snippets for a publisher site              
                                                                                                                                                                                                                                                                
  Once technical fundamentals are in place, the content strategy should pivot to building true topic clusters around "Wedding Planning" and "Honeymoon" as primary pillar hubs, which are under-resourced relative to search demand.                            
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                                                                                                                                                                                    
  Built by agricidaniel — Join the AI Marketing Hub community                                                                                                                                                                                                   
  🆓 Free  → https://www.skool.com/ai-marketing-hub          
  ⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro                                                                                                                                                                                                         
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                
✻ Worked for 5m 30s · 1 local agent still running                                                                                                                                                                                                               
                                                
● Agent "Search Experience Optimization audit" completed                                                                                                                                                                                                        
                                                                                  
● Agent "GEO and AI search optimization audit" completed                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                
● Two more specialist agents completed. Adding their findings — several new Critical issues surfaced.
                                                                                                                                                                                                                                                                
  ---                                           
  Audit Update: SXO + GEO Agent Findings                                                                                                                                                                                                                        
                                        
  ---                                                                                                                                                                                                                                                           
  New Critical Issue: C4 — Homepage May Be Client-Side Rendered                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                
  Source: GEO agent (live crawl)                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                
  The GEO agent's crawl detected "Loading..." placeholders on the homepage, confirming partial or full CSR (client-side rendering) on the homepage despite the site running Next.js. This means:                                                                
                                                                                                                                                                                                                                                                
  - AI crawlers (GPTBot, ClaudeBot, PerplexityBot) that don't execute JavaScript see a near-empty homepage                                                                                                                                                      
  - The homepage contributes zero topical authority to AI training corpora and citation indexes
  - Google's crawler handles JavaScript, but slower crawl tier = slower indexing                                                                                                                                                                                
                                                                                                                                                                                                                                                                
  Article pages return full SSR content (confirmed via direct fetches) — so only the homepage is affected. The fix is to migrate the homepage to Next.js getStaticProps or App Router with server components (no "use client" on the root layout).              
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  New Critical Issue: C5 — Homepage H1 Is a Brand Name, Not a Search Query
                                                                          
  Source: SXO agent
                                                                                                                                                                                                                                                                
  Current homepage H1/title: "EventForMe — A Blog about Weddings and More"
                                                                                                                                                                                                                                                                
  This is identical for both the title tag and H1 — zero keyword differentiation, and no search volume on branded terms for a new site. The homepage has no mechanism to rank for any discovery query.                                                          
  
  Fix:                                                                                                                                                                                                                                                          
  <title>Wedding Planning Ideas, Inspiration & Guides | EventForMe</title>
  <h1>Wedding Planning Ideas, Inspiration & Expert Guides</h1>            
  The title tag and H1 should differ — title handles the SERP snippet, H1 handles on-page relevance.                                                                                                                                                            
  
  ---                                                                                                                                                                                                                                                           
  New High Issue: H8 — English Pages Have Russian-Transliterated URL Slugs
                                                                                                                                                                                                                                                                
  Source: SXO agent (confirmed via live fetch)  
                                                                                                                                                                                                                                                                
  Example: /en/planning/angely-i-demony-chestnyj-razgovor-o-detyah-na-svadbe
                                                                                                                                                                                                                                                                
  This is a Russian-language slug served under the /en/ path. English-speaking users see Cyrillic-derived strings in the browser address bar and in Google SERP displayed URLs, which:                                                                          
  - Reduces click confidence for English-language searchers
  - Signals to Google that /en/ is a translation layer over Russian-first content (weakens authority)                                                                                                                                                           
  - Cannot rank for English-language queries with keyword-bearing URLs                               
                                                                                                                                                                                                                                                                
  Fix: Create English slugs for the /en/ content tree (e.g., /en/planning/children-at-weddings-pros-cons-guide). Set up 301 redirects from old Russian slugs to new English slugs. Update the sitemap. Note: this is a migration, so plan carefully to avoid    
  losing any indexed URLs.                                                                                                                                                                                                                                      
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  New High Issue: H9 — Brand Name Is Inconsistent Across the Site
                                                                 
  Source: GEO agent
                                                                                                                                                                                                                                                                
  Four different brand references found:
                                                                                                                                                                                                                                                                
  ┌─────────────────────────────┬────────────────────────────────────┐
  │          Location           │          Brand form used           │                                                                                                                                                                                          
  ├─────────────────────────────┼────────────────────────────────────┤
  │ Domain                      │ event4me.vip                       │                                                                                                                                                                                          
  ├─────────────────────────────┼────────────────────────────────────┤
  │ H1/title                    │ EventForMe                         │
  ├─────────────────────────────┼────────────────────────────────────┤
  │ llms.txt                    │ EventForMe (OK)                    │
  ├─────────────────────────────┼────────────────────────────────────┤                                                                                                                                                                                          
  │ Russian content description │ медиа-проект о культурных событиях │
  ├─────────────────────────────┼────────────────────────────────────┤                                                                                                                                                                                          
  │ Homepage description        │ "a blog about weddings"            │
  └─────────────────────────────┴────────────────────────────────────┘                                                                                                                                                                                          
                                                
  AI citation systems resolve brand entities by name consistency. "A blog" is not a citable entity — "EventForMe" is. EventForMe should be the canonical form used in every: meta description, author bio, llms.txt opening line, Organization schema, and About
   page.                                        
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  New Medium Issue: M9 — Price Inconsistency in Engagement Ring Article
                                                                                                                                                                                                                                                                
  Source: GEO agent                             

  The "World's Most Expensive Engagement Rings" article lists the Pink Star diamond as both $71.2M and $83.2M. AI fact-verification layers detect internal contradictions and deprioritize the entire article for citation, regardless of quality elsewhere.    
  This needs a factual correction with a link to the Christie's auction record.
                                                                                                                                                                                                                                                                
  ---                                           
  GEO Sub-Scores (by AI Platform)
                                                                                                                                                                                                                                                                
  ┌─────────────────────┬────────┬────────────────────────────────────────────────────────────────┐
  │      Platform       │ Score  │                          Key Blockers                          │                                                                                                                                                             
  ├─────────────────────┼────────┼────────────────────────────────────────────────────────────────┤                                                                                                                                                             
  │ Google AI Overviews │ 44/100 │ No FAQ schema, CSR homepage, no E-E-A-T markup                 │
  ├─────────────────────┼────────┼────────────────────────────────────────────────────────────────┤                                                                                                                                                             
  │ ChatGPT / GPT-4o    │ 51/100 │ No Wikipedia entity, inconsistent sourcing                     │                                                                                                                                                             
  ├─────────────────────┼────────┼────────────────────────────────────────────────────────────────┤                                                                                                                                                             
  │ Perplexity          │ 58/100 │ Best performer — structured expert content (champagne article) │                                                                                                                                                             
  ├─────────────────────┼────────┼────────────────────────────────────────────────────────────────┤                                                                                                                                                             
  │ Bing Copilot        │ 47/100 │ Weak E-E-A-T markup, no source citations                       │
  └─────────────────────┴────────┴────────────────────────────────────────────────────────────────┘                                                                                                                                                             
                                                
  Overall GEO Score: 52/100                                                                                                                                                                                                                                     
                                                
  ---
  SXO Sub-Score: 38/100
                                                                                                                                                                                                                                                                
  ┌──────────────────────────┬───────┐
  │        Dimension         │ Score │                                                                                                                                                                                                                          
  ├──────────────────────────┼───────┤          
  │ Page-type alignment      │ 4/15  │
  ├──────────────────────────┼───────┤
  │ Content depth            │ 7/15  │                                                                                                                                                                                                                          
  ├──────────────────────────┼───────┤
  │ UX / navigation signals  │ 6/15  │                                                                                                                                                                                                                          
  ├──────────────────────────┼───────┤                                                                                                                                                                                                                          
  │ Schema / structured data │ 1/15  │
  ├──────────────────────────┼───────┤                                                                                                                                                                                                                          
  │ Media (images, OG)       │ 8/15  │          
  ├──────────────────────────┼───────┤                                                                                                                                                                                                                          
  │ E-E-A-T / authority      │ 7/15  │
  ├──────────────────────────┼───────┤                                                                                                                                                                                                                          
  │ Freshness signals        │ 5/10  │          
  └──────────────────────────┴───────┘                                                                                                                                                                                                                          
  
  The article layer is the site's strongest asset. Homepage and category structural layers are suppressing what the content has earned.                                                                                                                         
                                                
  ---                                                                                                                                                                                                                                                           
  Persona Scores (from SXO agent)               
                                                                                                                                                                                                                                                                
  ┌───────────────────────────────┬────────┬──────────────────────────────────────────────────┐
  │            Persona            │ Score  │                   Primary Gap                    │                                                                                                                                                                 
  ├───────────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ Bride-to-be (primary)         │ 48/100 │ No "Start Here" path, weak author trust, no CTAs │
  ├───────────────────────────────┼────────┼──────────────────────────────────────────────────┤
  │ Spiritually-oriented bride    │ 62/100 │ Best-served persona; needs better cross-linking  │                                                                                                                                                                 
  ├───────────────────────────────┼────────┼──────────────────────────────────────────────────┤                                                                                                                                                                 
  │ Non-traditional bride         │ 55/100 │ Content scattered, no dedicated cluster          │                                                                                                                                                                 
  ├───────────────────────────────┼────────┼──────────────────────────────────────────────────┤                                                                                                                                                                 
  │ Wedding vendor / professional │ 41/100 │ No vendor section, no partnership pathway        │
  ├───────────────────────────────┼────────┼──────────────────────────────────────────────────┤                                                                                                                                                                 
  │ Casual reader                 │ 54/100 │ No newsletter, no recommendation engine          │
  └───────────────────────────────┴────────┴──────────────────────────────────────────────────┘                                                                                                                                                                 
                                                
  ---                                                                                                                                                                                                                                                           
  Updated SEO Health Score: 41 / 100            
                                    
  (Score unchanged — GEO/SXO findings were already factored into initial estimates. Specific sub-scores updated:)
                                                                                                                                                                                                                                                                
  ┌────────────────────────────────┬────────┐                                                                                                                                                                                                                   
  │            Category            │ Score  │                                                                                                                                                                                                                   
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ Technical SEO (22%)            │ 42/100 │   
  ├────────────────────────────────┼────────┤
  │ Content Quality (23%)          │ 54/100 │
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ On-Page SEO (20%)              │ 26/100 │
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ Schema / Structured Data (10%) │ 12/100 │   
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ Performance / CWV (10%)        │ 50/100 │
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ AI Search Readiness (10%)      │ 52/100 │   
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ Images (5%)                    │ 18/100 │
  ├────────────────────────────────┼────────┤                                                                                                                                                                                                                   
  │ Composite                      │ 41/100 │   
  └────────────────────────────────┴────────┘                                                                                                                                                                                                                   
  
  ---                                                                                                                                                                                                                                                           
  Final Master Action Plan                      
                          
  Week 1 — Critical Blockers
                                                                                                                                                                                                                                                                
  ┌─────┬─────────────────────────────────────────────────────────────────────┬─────────┬──────────┐
  │  #  │                                 Fix                                 │  Owner  │  Effort  │                                                                                                                                                            
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤
  │ 1   │ Hreflang on all EN/RU pages + sitemap                               │ Dev     │ 1 day    │
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤
  │ 2   │ Canonical tags on all article/category pages                        │ Dev     │ 2h       │                                                                                                                                                            
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                            
  │ 3   │ Meta descriptions on all page templates (dynamic from CMS)          │ Dev     │ 2h       │                                                                                                                                                            
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                            
  │ 4   │ Fix OG image: absolute CMS URL, not /_next/image proxy              │ Dev     │ 1h       │
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                            
  │ 5   │ Fix homepage CSR → SSR (Next.js getStaticProps or Server Component) │ Dev     │ 1-2 days │
  ├─────┼─────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                            
  │ 6   │ Rewrite homepage H1 + title tag with keyword targets                │ Content │ 30 min   │
  └─────┴─────────────────────────────────────────────────────────────────────┴─────────┴──────────┘                                                                                                                                                            
                                                
  Week 2 — Schema + E-E-A-T                                                                                                                                                                                                                                     
                                                
  ┌─────┬─────────────────────────────────────────────────────────────┬─────────┬────────┐                                                                                                                                                                      
  │  #  │                             Fix                             │  Owner  │ Effort │
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤
  │ 7   │ BlogPosting JSON-LD on all article templates                │ Dev     │ 3h     │
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤
  │ 8   │ BreadcrumbList schema on articles + categories              │ Dev     │ 2h     │                                                                                                                                                                      
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤                                                                                                                                                                      
  │ 9   │ WebSite + Organization schema on homepage                   │ Dev     │ 1h     │                                                                                                                                                                      
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤                                                                                                                                                                      
  │ 10  │ Person + ProfilePage schema on author pages                 │ Dev     │ 2h     │
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤                                                                                                                                                                      
  │ 11  │ Add image alt text to all existing articles (via CMS field) │ Content │ 3h     │
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤                                                                                                                                                                      
  │ 12  │ Security headers via Cloudflare Transform Rule              │ DevOps  │ 15 min │
  ├─────┼─────────────────────────────────────────────────────────────┼─────────┼────────┤                                                                                                                                                                      
  │ 13  │ Canonicalize brand name to "EventForMe" across all surfaces │ Content │ 1h     │
  └─────┴─────────────────────────────────────────────────────────────┴─────────┴────────┘                                                                                                                                                                      
                                                
  Month 1 — Content Architecture                                                                                                                                                                                                                                
                                                
  ┌─────┬─────────────────────────────────────────────────────────────────────────────┬─────────┬──────────┐                                                                                                                                                    
  │  #  │                                     Fix                                     │  Owner  │  Effort  │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤
  │ 14  │ Create English URL slugs for /en/ tree; set up 301 redirects                │ Dev     │ 2 days   │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤
  │ 15  │ Add explicit AI crawler directives to robots.txt                            │ Dev     │ 15 min   │                                                                                                                                                    
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 16  │ Write "Wedding Planning Checklist" pillar page (3,000+ words)               │ Content │ 2 days   │                                                                                                                                                    
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 17  │ Write "Wedding Budget Guide" pillar page                                    │ Content │ 1.5 days │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 18  │ Add FAQ sections to top 3 planning articles (+ FAQPage schema)              │ Content │ 4h       │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 19  │ Fix Pink Star price inconsistency; add source citations to factual articles │ Content │ 2h       │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 20  │ Update llms.txt: licensing, taxonomy, canonical brand name                  │ Content │ 2h       │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 21  │ Reduce Yandex crawl delay from 2s → 0.5s                                    │ Dev     │ 5 min    │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 22  │ Expand Wedding Encyclopedia: 1 article → 8+                                 │ Content │ 5 days   │
  ├─────┼─────────────────────────────────────────────────────────────────────────────┼─────────┼──────────┤                                                                                                                                                    
  │ 23  │ Implement IndexNow on article publish events                                │ Dev     │ 2h       │
  └─────┴─────────────────────────────────────────────────────────────────────────────┴─────────┴──────────┘                                                                                                                                                    
                                                
  Ongoing                                                                                                                                                                                                                                                       
                                                
  - Build topical authority: 10+ articles per category before targeting head terms                                                                                                                                                                              
  - Author bylines on external wedding publications (builds E-E-A-T off-site)
  - Consider a Wikidata entity page for EventForMe                                                                                                                                                                                                              
  - Add TL;DR summary blocks to all new articles                                                                                                                                                                                                                
  - Introduce question-format H2s on highest-traffic-potential guides                                                                                                                                                                                           
                                                                                                                                                                                                                                                                
  ---                                           
  Still waiting on the cluster agent — it will add keyword gap and topic architecture recommendations. The core audit is complete.                                                                                                                              
                                                                                                                                                                                                                                                                
✻ Baked for 59s · 1 local agent still running
                                                                                                                                                                                                                                                                
● Agent "Semantic topic clustering analysis" completed                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                
● All 9 agents complete. Here are the final cluster findings — the most actionable content intelligence from the audit.                                                                                                                                         
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  Cluster Architecture Analysis                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                
  Overall verdict: Proto-hub-and-spoke with no actual hubs. Every category page is a pure article list. No pillar pages exist. Zero editorial body-text links found in any article — every internal link is from an algorithmic "Don't Miss Out" widget. This is
   the highest-leverage improvement available requiring zero new development.                                                                                                                                                                                   
                  
  ---                                                                                                                                                                                                                                                           
  Cannibalization Pairs to Fix Now
                                                                                                                                                                                                                                                                
  ┌────────┬──────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  Pair  │                           Articles                           │                              Risk                              │                                                      Fix                                                       │   
  ├────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ HIGH   │ "Anti-Bride: 5 Summer Looks" + "5 Inspiring Bridal Looks for │ Both are fashion listicles targeting same query; Google        │ Create "Wedding Dress Styles Guide" pillar; reframe both as seasonal spokes                                    │
  │        │  Spring"                                                     │ suppresses one                                                 │                                                                                                                │
  ├────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ HIGH   │ "Pisces Wedding Tips" + "Aquarius Wedding Tips"              │ Near-identical format, identical intent, same author type      │ Create "Wedding Planning by Zodiac Sign" hub page; make each zodiac article a spoke                            │   
  ├────────┼──────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤   
  │ MEDIUM │ "May 2026 Horoscope" + "Fire Horse Year Guide"               │ Both answer "when should I get married in 2026"                │ Differentiate: Fire Horse → Chinese zodiac specifically; May Horoscope → clearly date-stamped monthly          │   
  │        │                                                              │                                                                │ resource, not evergreen                                                                                        │
  └────────┴──────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   
                  
  ---
  5 Priority Cluster Blueprints
                                                                                                                                                                                                                                                                
  Cluster 1 — CRITICAL: Wedding Planning Master Hub
                                                                                                                                                                                                                                                                
  3 articles already written, waiting for a hub                                                                                                                                                                                                                 
  
  ┌────────────────────┬──────────────────────────────────────────────────────────────────────────────────────┐                                                                                                                                                 
  │                    │                                       Details                                        │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ Pillar             │ "The Complete Wedding Planning Guide" (/en/planning/complete-wedding-planning-guide) │
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
  │ New spokes needed  │ Wedding Budget Breakdown + How to Choose a Wedding Venue                             │                                                                                                                                                 
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                                                                                                 
  │ Existing spokes    │ Planning in One Month (A16) · MC vs. Toastmaster (A17) · Children at Weddings (A15)  │                                                                                                                                                 
  ├────────────────────┼──────────────────────────────────────────────────────────────────────────────────────┤                                                                                                                                                 
  │ Effort to activate │ 3 new pieces → 5-spoke cluster live                                                  │
  └────────────────────┴──────────────────────────────────────────────────────────────────────────────────────┘                                                                                                                                                 
                  
  Wedding Budget is the single largest traffic gap on the site — the "money" taxonomy tag has zero articles, and this is a top-3 query in the entire wedding niche.                                                                                             
                  
  ---                                                                                                                                                                                                                                                           
  Cluster 2 — HIGH: Bridal Style Hub
                                    
  Resolves the A01/A05 cannibalization
                                                                                                                                                                                                                                                                
  ┌───────────────────┬────────────────────────────────────────────────────────────────────────────────────────────┐
  │                   │                                          Details                                           │                                                                                                                                            
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
  │ Pillar            │ "Wedding Style Guide: How to Define Your Aesthetic" (/en/ideas/wedding-style-guide)        │
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤
  │ New spokes needed │ Wedding Dress Styles Guide · Wedding Floristry Complete Guide · Wedding Photography Styles │                                                                                                                                            
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Existing spokes   │ Anti-Bride Fashion (A01) · Spring Bridal Looks (A05)                                       │                                                                                                                                            
  ├───────────────────┼────────────────────────────────────────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Cross-links       │ Elie Saab profile (A12) → fashion spoke; Ariel Dearie interview (A13) → floristry spoke    │
  └───────────────────┴────────────────────────────────────────────────────────────────────────────────────────────┘                                                                                                                                            
                  
  ---                                                                                                                                                                                                                                                           
  Cluster 3 — HIGH: Honeymoon Planning Hub
                                          
  3 destination guides are isolated orphans
                                                                                                                                                                                                                                                                
  ┌─────────────────────┬───────────────────────────────────────────────────────────────────────────────┐
  │                     │                                    Details                                    │                                                                                                                                                       
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
  │ Pillar              │ "Honeymoon Planning Guide" (/en/travel/honeymoon-planning-guide)              │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────┤
  │ New spokes needed   │ "Beach vs. Mountains vs. City: Choosing Your Honeymoon Style"                 │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────┤                                                                                                                                                       
  │ Existing spokes     │ Russia Honeymoon · Turkey Honeymoon · Philippines Honeymoon                   │
  ├─────────────────────┼───────────────────────────────────────────────────────────────────────────────┤                                                                                                                                                       
  │ Cross-cluster bonus │ Sunscreen article (Wellness) gains natural link from honeymoon travel context │
  └─────────────────────┴───────────────────────────────────────────────────────────────────────────────┘                                                                                                                                                       
  
  ---                                                                                                                                                                                                                                                           
  Cluster 4 — MEDIUM: Bride Beauty Hub
                                                                                                                                                                                                                                                                
  Pillar: "The Bride's Complete Beauty Timeline: 6 Months to Wedding Morning" — connects the pre-wedding checklist (A25) and sunscreen guide (A24). The psychology/relationship conflict article (A26) doesn't belong here — cross-link it to the Planning
  pillar instead.                                                                                                                                                                                                                                               
                  
  ---                                                                                                                                                                                                                                                           
  Cluster 5 — MEDIUM: Wedding Traditions Hub
                                            
  Pillar: "Wedding Traditions Explained" — activates 3 existing articles (global traditions, dove release, champagne guide). One new spoke: "Something Old, New, Borrowed, Blue." One-sentence bridge to the Astrology cluster via body text in the global
  traditions article.                                                                                                                                                                                                                                           
  
  ---                                                                                                                                                                                                                                                           
  Astrology Category: Strategic Asset, Architectural Risk
                                                                                                                                                                                                                                                                
  The astrology category is a legitimate differentiator — no major wedding site executes zodiac-based planning guidance at depth. But three risks need managing now:
                                                                                                                                                                                                                                                                
  1. A08/A09 cannibalization (fix this week via zodiac hub page)                                                                                                                                                                                                
  2. Monthly horoscopes accumulate thin expired pages — consolidate into one annually-updated "Auspicious Wedding Dates 2026: Month-by-Month" guide                                                                                                             
  3. Category proportion — if astrology grows faster than Wedding Planning, Google may reclassify the site as an astrology blog. Keep astrology at max 20% of total content.                                                                                    
                                                                                                                                                                                                                                                                
  ---                                                                                                                                                                                                                                                           
  Internal Linking: Zero Editorial Links Found                                                                                                                                                                                                                  
                                              
  The most impactful improvement that requires no new content, no development, and no budget:
                                                                                                                                                                                                                                                                
  Quick wins — add these body-text links this week:                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                
  ┌─────────────────────────────┬─────────────────────────────┬─────────────────────────────────────────────────────┐                                                                                                                                           
  │            From             │             To              │                     Anchor text                     │
  ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────────────┤                                                                                                                                           
  │ Planning in One Month (A16) │ MC vs. Toastmaster (A17)    │ "choosing your wedding entertainment team"          │
  ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────────────┤
  │ Beauty Checklist (A25)      │ Sunscreen Guide (A24)       │ "SPF is non-negotiable in pre-wedding skincare"     │
  ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────────────┤                                                                                                                                           
  │ Global Traditions (A19)     │ Fire Horse Year Guide (A10) │ "lucky charms and auspicious dates across cultures" │
  ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────────────┤                                                                                                                                           
  │ Russia Honeymoon (A21)      │ Turkey/Philippines articles │ "other adventurous honeymoon destinations"          │
  ├─────────────────────────────┼─────────────────────────────┼─────────────────────────────────────────────────────┤                                                                                                                                           
  │ Elie Saab Profile (A12)     │ Bridal Looks articles       │ contextual fashion link                             │
  └─────────────────────────────┴─────────────────────────────┴─────────────────────────────────────────────────────┘                                                                                                                                           
                  
  ---                                                                                                                                                                                                                                                           
  Critical Keyword Gaps (Zero Coverage)

  ┌───────────────────────┬─────────────────────────────┬──────────────────────────────────────────────────────────┐
  │         Topic         │        Query volume         │                      Why it matters                      │
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Wedding budget / cost │ Top-3 niche query           │ "money" tag exists with 0 articles                       │
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Venue selection       │ Top-5 niche query           │ No coverage at all                                       │                                                                                                                                            
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤
  │ Proposal & engagement │ Top-of-funnel entry point   │ Ring article covers celebrity prices, not how to propose │                                                                                                                                            
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Ceremony structure    │ Core planning need          │ Zero coverage                                            │
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Real wedding stories  │ High engagement + backlinks │ Zero showcase articles                                   │
  ├───────────────────────┼─────────────────────────────┼──────────────────────────────────────────────────────────┤                                                                                                                                            
  │ Wedding catering/food │ Reception planning staple   │ Champagne covered, food planning absent                  │
  └───────────────────────┴─────────────────────────────┴──────────────────────────────────────────────────────────┘                                                                                                                                            
                  
  ---                                                                                                                                                                                                                                                           
  Updated Final SEO Health Score
                                
  All 9 specialists complete. Score finalized:
                                                                                                                                                                                                                                                                
  ┌──────────────────────────┬────────┬──────────┐
  │         Category         │ Weight │  Score   │                                                                                                                                                                                                              
  ├──────────────────────────┼────────┼──────────┤
  │ Technical SEO            │ 22%    │ 42/100   │
  ├──────────────────────────┼────────┼──────────┤
  │ Content Quality          │ 23%    │ 54/100   │                                                                                                                                                                                                              
  ├──────────────────────────┼────────┼──────────┤
  │ On-Page SEO              │ 20%    │ 26/100   │                                                                                                                                                                                                              
  ├──────────────────────────┼────────┼──────────┤                                                                                                                                                                                                              
  │ Schema / Structured Data │ 10%    │ 12/100   │
  ├──────────────────────────┼────────┼──────────┤                                                                                                                                                                                                              
  │ Performance / CWV        │ 10%    │ 50/100   │
  ├──────────────────────────┼────────┼──────────┤                                                                                                                                                                                                              
  │ AI Search Readiness      │ 10%    │ 52/100   │
  ├──────────────────────────┼────────┼──────────┤                                                                                                                                                                                                              
  │ Images                   │ 5%     │ 18/100   │
  ├──────────────────────────┼────────┼──────────┤                                                                                                                                                                                                              
  │ SEO Health Score         │        │ 41 / 100 │
  └──────────────────────────┴────────┴──────────┘                                                                                                                                                                                                              
                  
  ---                                                                                                                                                                                                                                                           
  The 5 Moves That Will Move the Needle Most
                                            
  1. Hreflang + canonicals (1 dev day) — stops duplicate content penalty for the bilingual site, the single most damaging technical gap
  2. BlogPosting schema on all articles (3 hours) — unlocks Google Discover, rich snippets, and E-E-A-T signals across the entire article catalog                                                                                                               
  3. Add 3+ editorial body-text links per article (1 editorial day) — zero cost, zero dev, immediately improves PageRank distribution and topical authority                                                                                                     
  4. Create the Wedding Planning pillar page (2 content days) — 3 existing articles activate into a cluster; captures the highest-volume query group in the niche                                                                                               
  5. Fix homepage: SSR + keyword H1 (1 dev day + 30 min content) — homepage currently invisible to AI crawlers and ranks for nothing                                                                                                                            
                                                                                                                                                                                                                                                                
  ---   