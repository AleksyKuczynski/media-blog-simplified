# Breadcrumbs Components

Context-aware breadcrumb navigation system with multiple breadcrumb path generation for comprehensive SEO coverage.

## Overview

The breadcrumb system provides two components:
- **Breadcrumbs** - Simple, straightforward breadcrumb navigation
- **SmartBreadcrumbs** - Context-aware breadcrumbs that adapt to user's navigation path

## Components

### Breadcrumbs.tsx
Simple breadcrumb component for general pages (rubrics, authors, categories).

**Type**: Server Component  
**Usage**: General pages (non-articles)

```tsx
<Breadcrumbs
  items={[
    { label: 'Рубрики', href: '/ru/rubrics' },
    { label: 'Культура', href: '/ru/kultura' }
  ]}
  rubrics={rubrics}
  lang={lang}
  translations={translations}
/>
```

**Props**:
- `items: BreadcrumbItem[]` - Breadcrumb trail items
- `rubrics: RubricBasic[]` - Available rubrics (for context)
- `lang: Lang` - Current language
- `translations: object` - Labels (home, allRubrics, allAuthors)

**Features**:
- Automatic home link prepending
- Context detection (authors/rubrics)
- Schema.org structured data
- Responsive overflow handling

### SmartBreadcrumbs.tsx
Context-aware breadcrumbs for article pages that detect user's navigation path.

**Type**: Server Component (async)  
**Usage**: Article pages only

```tsx
<SmartBreadcrumbs
  articleData={{
    title: 'Article Title',
    slug: 'article-slug',
    rubricSlug: 'kultura',
    rubricName: 'Культура', // Pre-translated
    authors: [...],
    categories: [...]
  }}
  dictionary={dictionary}
  lang={lang}
/>
```

**Props**:
- `articleData: object` - Article metadata
  - `title: string` - Article title
  - `slug: string` - Article slug
  - `rubricSlug: string` - Parent rubric slug
  - `rubricName: string` - **Pre-translated** rubric name
  - `authors?: Array` - Article authors
  - `categories?: Array` - Article categories
- `dictionary: Dictionary` - Full dictionary
- `lang: Lang` - Current language
- `className?: string` - Optional container styles

**Features**:
- Detects user's referrer (where they came from)
- Generates contextual breadcrumb path
- Creates multiple SEO schemas (primary, canonical, alternatives)
- Handles language switching
- External/direct navigation detection

## Context Detection

SmartBreadcrumbs detects navigation context from HTTP referrer:

### Detected Contexts

| Context | Referrer Pattern | Breadcrumb Path |
|---------|-----------------|-----------------|
| **Rubric** | `/ru/kultura` | Home → Культура → Article |
| **Author** | `/ru/authors/ivan-petrov` | Home → Authors → Ivan Petrov → Article |
| **Category** | `/ru/category/theatre` | Home → Articles → Theatre → Article |
| **Search** | `/ru/search?q=opera` | Home → Search: "opera" → Article |
| **Featured** | `/ru` | Home → Article |
| **Articles** | `/ru/articles` | Home → Articles → Article |
| **External** | `google.com` | Home → Rubric → Article |
| **Direct** | (none) | Home → Rubric → Article |
| **Language Switch** | `/en/...` | Home → Rubric → Article |

### Context Detection Logic

```typescript
// Detects from server-side headers
const context = await detectBreadcrumbContext(dictionary, lang);

// Returns one of:
// { type: 'rubric', contextData: { rubricSlug } }
// { type: 'author', contextData: { authorSlug } }
// { type: 'category', contextData: { categorySlug } }
// { type: 'search', contextData: { searchQuery } }
// { type: 'featured' }
// { type: 'external', referrerPath }
// { type: 'direct' }
```

## SEO Schema Generation

SmartBreadcrumbs generates multiple BreadcrumbList schemas for maximum SEO coverage:

### Schema Types

1. **Primary Schema** - User's actual navigation path
2. **Canonical Schema** - Standard path (Home → Rubric → Article)
3. **Alternative Schemas** - Other valid paths (via author, category, etc.)

### Example Output

For an article accessed via author page:

```json
// Primary (user's path)
{
  "@type": "BreadcrumbList",
  "@id": "...#primary-breadcrumb",
  "itemListElement": [
    { "position": 1, "name": "Главная", "item": "/ru" },
    { "position": 2, "name": "Авторы", "item": "/ru/authors" },
    { "position": 3, "name": "Иван Петров", "item": "/ru/authors/ivan-petrov" },
    { "position": 4, "name": "Article Title", "item": "/ru/kultura/article-slug" }
  ]
}

// Canonical (standard path)
{
  "@type": "BreadcrumbList",
  "@id": "...#canonical-breadcrumb",
  "itemListElement": [
    { "position": 1, "name": "Главная", "item": "/ru" },
    { "position": 2, "name": "Культура", "item": "/ru/kultura" },
    { "position": 3, "name": "Article Title", "item": "/ru/kultura/article-slug" }
  ]
}

// Alternative (via category if applicable)
{
  "@type": "BreadcrumbList",
  "@id": "...#alt-breadcrumb-1",
  "itemListElement": [...]
}
```

## Styling

Both components use centralized styles from `styles.ts`:

```typescript
import { BREADCRUMB_STYLES } from './styles';

// Available style constants:
BREADCRUMB_STYLES.nav.container       // Nav wrapper
BREADCRUMB_STYLES.list.base          // List container
BREADCRUMB_STYLES.item.container     // List item
BREADCRUMB_STYLES.separator.container // Chevron wrapper
BREADCRUMB_STYLES.separator.icon     // Chevron icon
BREADCRUMB_STYLES.link.base          // Link styles
BREADCRUMB_STYLES.currentPage.base   // Current page (last item)
```

### Visual Design

- **Links**: Primary color, underline on hover
- **Current page**: Muted color, no interaction
- **Separator**: Chevron right icon, primary color
- **Container**: Horizontal scroll on overflow

## Helper Functions

### `enhanceArticleForBreadcrumbs()`
Prepares article data for SmartBreadcrumbs.

```typescript
const articleData = enhanceArticleForBreadcrumbs(
  article,
  rubricName, // Pre-translated
  rubricSlug
);
```

**Important**: `rubricName` must be already translated before calling this function.

### `detectBreadcrumbContext()`
Server-side context detection from headers.

```typescript
const context = await detectBreadcrumbContext(dictionary, lang);
```

**Location**: `/lib/utils/breadcrumbContextDetector.ts`

### `generateContextualBreadcrumbs()`
Generates breadcrumb paths based on detected context.

```typescript
const { userPath, canonicalPath, seoAlternatives } = 
  generateContextualBreadcrumbs(context, articleData, dictionary, lang);
```

## Schema Integration

Breadcrumb schemas are managed by dedicated schema component:

**Location**: `/shared/seo/schemas/BreadcrumbSchema.tsx`

```typescript
// Generate all schemas
const schemas = generateSmartBreadcrumbSchemas(
  baseUrl,
  lang,
  rubricSlug,
  articleSlug,
  displayPath,
  canonicalPath,
  seoAlternatives
);

// Render schemas
<BreadcrumbSchemas schemas={schemas} />
```

## Types

### BreadcrumbItem
```typescript
interface BreadcrumbItem {
  label: string;
  href: string;
}
```

### SmartBreadcrumbItem
```typescript
interface SmartBreadcrumbItem {
  label: string;
  href: string;
  context?: string;
  ariaLabel?: string;
}
```

### BreadcrumbContext
```typescript
interface BreadcrumbContext {
  type: 'rubric' | 'author' | 'category' | 'featured' | 'search' | 
        'external' | 'direct' | 'articles' | 'language-switch';
  referrerPath?: string;
  contextData?: {
    authorName?: string;
    authorSlug?: string;
    categoryName?: string;
    categorySlug?: string;
    searchQuery?: string;
    rubricName?: string;
    rubricSlug?: string;
    previousLang?: string;
  };
}
```

## Usage Examples

### Simple Breadcrumbs (Rubric Page)
```tsx
// app/[lang]/[rubric]/page.tsx
<Breadcrumbs
  items={[
    { 
      label: rubric.name, 
      href: `/${lang}/${rubric.slug}` 
    }
  ]}
  rubrics={allRubrics}
  lang={lang}
  translations={{
    home: dictionary.navigation.labels.home,
    allRubrics: dictionary.navigation.labels.rubrics,
    allAuthors: dictionary.navigation.labels.authors
  }}
/>
```

### Smart Breadcrumbs (Article Page)
```tsx
// app/[lang]/[rubric]/[slug]/page.tsx
import SmartBreadcrumbs, { enhanceArticleForBreadcrumbs } from '@/features/navigation/Breadcrumbs/SmartBreadcrumbs';

// Prepare data
const rubric = await fetchRubricBasics(params.rubric, lang);
const article = await fetchFullArticle(params.slug, lang);

const articleData = enhanceArticleForBreadcrumbs(
  article,
  rubric.name, // Already translated from Directus
  rubric.slug
);

// Render
<SmartBreadcrumbs
  articleData={articleData}
  dictionary={dictionary}
  lang={lang}
/>
```

## Accessibility

### ARIA Labels
```typescript
aria-label={dictionary.navigation.accessibility.breadcrumbNavigation}
```

### Semantic HTML
- `<nav>` wrapper with appropriate label
- `<ol>` for ordered list
- `<li>` for each item
- `aria-current="page"` on last item

### Screen Readers
- Announces "Breadcrumb navigation"
- Reads each link in sequence
- Indicates current page location

## Performance

### Server-Side Rendering
Both components are SSR:
- No client-side JavaScript
- Fast initial render
- SEO-friendly

### Async Operations
SmartBreadcrumbs uses async:
- Reads server headers
- No blocking for user
- Cached between requests

## Testing

### Manual Tests
- [ ] Home link works
- [ ] All intermediate links work
- [ ] Current page is not clickable
- [ ] Overflow scrolls horizontally
- [ ] Context detection correct
- [ ] Multiple schemas generated
- [ ] Works in both languages

### SEO Validation
- [ ] Schema validates at schema.org
- [ ] Google Rich Results Test passes
- [ ] All paths are valid URLs
- [ ] Breadcrumbs show in search results

## Common Issues

### Wrong Context Detected
**Cause**: Referrer header missing or incorrect  
**Solution**: Check server headers, ensure HTTPS

### Rubric Name Not Translated
**Cause**: Passing untranslated rubric name  
**Solution**: Translate rubric name before calling `enhanceArticleForBreadcrumbs`

### Multiple Primary Schemas
**Cause**: Component rendered multiple times  
**Solution**: Ensure single SmartBreadcrumbs per page

## Related Files

- `/lib/utils/breadcrumbContextDetector.ts` - Context detection logic
- `/shared/seo/schemas/BreadcrumbSchema.tsx` - Schema generation
- `/features/navigation/styles.ts` - Parent navigation styles
- `/config/i18n/helpers/navigation.ts` - Navigation helpers

## Future Enhancements

- [ ] Add user preference persistence
- [ ] Support custom breadcrumb paths
- [ ] Add breadcrumb trail analytics
- [ ] Implement breadcrumb A/B testing
- [ ] Add breadcrumb navigation history