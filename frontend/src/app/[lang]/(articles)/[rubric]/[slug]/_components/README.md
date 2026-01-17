## Root Level
article.styles.ts - Centralized Tailwind style constants for all article components
Header.tsx - Article header with title, image, metadata, and author attribution
Content.tsx - Main content wrapper that orchestrates markdown rendering
PreviewBanner.tsx - Draft mode indicator banner for unpublished articles
ScrollToTopButton.tsx - Fixed position button for page navigation

## content/
Paragraph.tsx - Markdown paragraph element with responsive typography
Heading.tsx - Markdown heading elements (h1-h6) with anchor links
Link.tsx - Markdown link element with external link indicators
List.tsx - Markdown ordered and unordered list wrapper
ListItem.tsx - Markdown list item element
CustomBlockquote.tsx - Enhanced blockquote block with custom styling
ImageCarousel.tsx - Multi-image carousel block for article galleries
CustomImage.tsx - Single image block with caption support
markdown-component-map.ts - Maps markdown AST nodes to React components

## navigation/
TableOfContents.tsx - Sidebar/collapsible TOC generated from article headings
QuickNavigation.tsx - Site-level navigation links (articles, rubrics)
CategoriesSection.tsx - Article category tags with links
RubricSection.tsx - Article rubric display with link
AuthorSection.tsx - Single author card with avatar and link
AuthorsSection.tsx - Multiple authors grid wrapper component

## engagement/
ArticleEngagement.tsx - Main engagement sidebar container with state management
EngagementMetric.tsx - Reusable metric display component (views, likes, shares)
EngagementIcons.tsx - SVG icon components for engagement metrics
SharePopup.tsx - Social media share modal with platform buttons

### **engagement/lib/**
api.ts - API client for fetching and updating engagement data via Next.js routes
types.ts - TypeScript interfaces for engagement data, actions, and responses
localStorage.ts - Persistent storage for like state and engagement deltas
actionLog.ts - Client-side action tracking with timestamps for reconciliation
share.ts - Share URL generation, clipboard API, and Web Share API handlers
checkRateLimit.ts - Rate limiting logic for engagement actions
hasRecentlyViewed.ts - View tracking detection to prevent duplicate counts
triggerEngagementFlow.ts - Orchestrates engagement action workflows
index.ts - Public API exports for engagement module

### **engagement/hooks/**
useEngagement.ts - Main engagement hook orchestrating views, likes, and shares
useLikeState.ts - Like button state management with optimistic updates
useShareState.ts - Share state management with platform-specific handling
useViewTracking.ts - Optional client-side view tracking with delay

## markdown/
processContent.ts - Main markdown processing pipeline orchestrator
types.ts - TypeScript interfaces for content chunks and attributes
processLinks.ts - Categorizes links into external, article slugs, and balloon tips
processCaptionLinks.ts - Simplified link processing for image captions
processArticleCards.ts - Validates article slugs and fetches card data from Directus
parseBlockquotes.ts - Extracts and processes custom blockquote syntax
parseImageFrames.ts - Converts image markdown to enriched image frames with metadata
extractImagesAndCaptions.ts - Separates images and captions from markdown
extractTables.ts - Extracts markdown tables into dedicated chunks
parseMarkdownImage.ts - Parses individual image markdown syntax
markdownToHtml.ts - Converts markdown to HTML using remark
addHeadingIds.ts - Generates unique IDs for heading elements
generateToc.ts - Creates table of contents from heading structure
validateSlug.ts - Validates article slug format and existence