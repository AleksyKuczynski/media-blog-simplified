// src/config/i18n/dictionaries/en.ts
import { CONTACT_EMAIL, SITE_URL } from "../../constants/constants";
import Dictionary from "../types";

/**
 * Complete English dictionary - exact structural match to Russian version
 * Uses templates extensively to avoid duplication and support multiple contexts
 * Optimized for both Google and Yandex SEO requirements
 */
export const dictionaryEN: Dictionary = {
  locale: 'en-US',
  
  // ===================================================================
  // ACCESSIBILITY - Universal accessibility labels
  // ===================================================================
  accessibility: {
    iconDescription: 'Icon',
    decorativeIcon: 'Decorative icon',
    rubricVisualIndicator: 'Rubric visual indicator',
    rubricDescription: 'Rubric description',
    expandDescription: 'Expand description',
  },

  // ===================================================================
  // BREADCRUMB - reusable labels for breadcrumbs
  // ===================================================================
  breadcrumb: {
    contexts: {
      rubric: 'rubric',
      author: 'author', 
      category: 'category',
      featured: 'featured',
      search: 'search',
      external: 'external',
      direct: 'direct',
    },
    contextAria: {
      rubricPath: 'Navigation through rubric',
      authorPath: 'Navigation through author',
      categoryPath: 'Navigation through category',
      featuredPath: 'Navigation through featured',
      searchPath: 'Navigation through search',
      canonicalPath: 'Main navigation',
    },
    templates: {
      rubricLabel: 'Rubric {name}',
      articleLabel: 'Article: {title}',
      authorProfile: 'Author profile {name}',
      categoryLabel: 'Category {name}',
      fromRubric: 'Article from rubric {rubric}',
      fromArticles: 'Article from all articles list',
      fromSearch: 'Article from search: {title}',
      searchWithQuery: '{search}: {query}',
    },
  },

  // ===================================================================
  // COMMON - Simple, reusable labels without pluralization
  // ===================================================================
  common: {
    count: {
      articles: 'articles',
      rubrics: 'rubrics',
      categories: 'categories',
      authors: 'authors',
      results: 'results',
      items: 'items',
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      goToPage: 'Go to page {page}',
      currentPage: 'Current page, page {page}',
      firstPage: 'Go to first page',
      lastPage: 'Go to last page',
    },
    actions: {
      loadMore: 'Load More',
      showMore: 'Show More',
      showLess: 'Show Less',
      readMore: 'Read More',
      explore: 'Explore',
      viewAll: 'View All',
      backTo: 'Back to',
    },
    status: {
      loading: 'Loading...',
      error: 'An error occurred',
      notFound: 'Not found',
      empty: 'Nothing here yet',
      retry: 'Try again',
    },
    published: 'Published',
    updated: 'Updated',
  },

  // ===================================================================
  // CONSENT - Consent banner content
  // ===================================================================
  consent: {
    title: 'We use cookies',
    description: 'We use cookies to improve your experience, analyze traffic, and personalize content. You can accept all or customize your preferences.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    save: 'Save Settings',
    back: 'Back',
    necessary: 'Necessary',
    analytics: 'Analytics',
    marketing: 'Marketing',
    preferences: 'Preferences',
    necessaryDescription: 'These cookies provide basic functionality and security.',
    analyticsDescription: 'Help us understand how visitors interact with the site by collecting anonymous information.',
    marketingDescription: 'Used to show relevant advertising and measure campaign effectiveness.',
    preferencesDescription: 'Allow the site to remember your preferences such as language or region.',
    privacyPolicy: 'Privacy Policy',
    alwaysActive: 'Always Active',
  },

  // ===================================================================
  // CONTENT - NEW: Content-specific labels and templates
  // ===================================================================
  content: {
    labels: {
      tableOfContents: 'Table of Contents',
      editorial: '{siteName} Editorial Team',
      readingTime: 'Reading time: {minutes} min',
      wordsCount: 'Words: {count}',
      articleImage: 'Article illustration',
      portalAdvice: 'Advice from EventForMe',
    },
    templates: {
      emptyRubric: 'No articles in rubric {name} yet',
      moreAbout: 'More about {contentType} {name}',
      writtenBy: 'By: {author}',
      publishedIn: 'Published in {rubric}',
    },
  },

  // ===================================================================
  // ERRORS - NEW: Template-driven error handling
  // ===================================================================
  errors: {
    engagement: {
      updateFailed: 'Failed to update counters',
    },
    templates: {
      loadingError: 'Error loading {contentType}',
      loadingDescription: 'An error occurred while loading {contentType}. Please try refreshing the page.',
      retryAction: 'Try again',
      backToHome: 'Back to home',
      criticalError: 'A critical error occurred',
      criticalDescription: 'Something went wrong. Please try refreshing the page.',
    },
    types: {
      article: 'article',
      rubric: 'rubric',
      author: 'author',
      page: 'page',
      content: 'content',
    },
  },

  // ===================================================================
  // FILTER - Filter and sorting interface
  // ===================================================================
  filter: {
    labels: {
      sortBy: 'Sort by',
      category: 'Category',
      allCategories: 'All Categories',
      newest: 'Newest First',
      oldest: 'Oldest First',
      mostLiked: 'Most Liked',
      mostViewed: 'Most Viewed',
      reset: 'Reset',
      apply: 'Apply',
    },
    accessibility: {
      categorySelector: 'Category selector',
      sortingControl: 'Sorting control',
      resetButton: 'Reset filters',
      filterGroup: 'Filter group',
      dropdownLabel: 'Dropdown list',
    },
  },

  // ===================================================================
  // FOOTER - Complete footer structure
  // ===================================================================
  footer: {
    about: {
      title: 'About',
      description: 'A blog about wedding planning and organisation from the experts at EventForMe. Practical guides on choosing venues, working with decorators, and creating looks for the bride and groom. Tips on budgeting, decor ideas, and wedding fashion trends. We make wedding planning a simple and straightforward process.',
    },
    quickLinks: {
      title: 'Quick Links',
      ariaLabel: 'Navigation through main site sections',
    },
    socialLinks: {
      title: 'Social Media',
    },
    legal: {
      title: 'Legal Information',
      copyright: '© {year} {siteName}. All rights reserved.',
      rights: 'All rights reserved',
      privacyPolicy: 'Privacy Policy',
      terms: 'Terms of Use',
      sitemap: 'Sitemap',
    },
    contact: {
      title: 'Contact Us',
      buttonLabel: 'Write to Us',
      emailSubject: 'Message from EventForMe',
      modal: {
        title: 'Contact Us',
        emailLabel: 'Your email',
        emailPlaceholder: 'example@mail.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Write the subject of your message',
        messageLabel: 'Message',
        messagePlaceholder: 'Tell us how we can help...',
        submitButton: 'Send',
        cancelButton: 'Cancel',
        submitting: 'Sending...',
  requiredField: 'required field',
        successMessage: 'Thank you! Your message has been sent. We will respond shortly.',
        errorMessage: 'An error occurred. Please try again later or write to',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email',
        subjectRequired: 'Subject is required',
        messageRequired: 'Message is required',
      },
    },
    accessibility: {
      skipToFooter: 'Skip to footer',
      footerNavigation: 'Footer navigation',
    },
  },

  // ===================================================================
  // METADATA - NEW: Structured metadata fallbacks
  // ===================================================================
  metadata: {
    notFound: {
      article: {
        title: 'Article not found',
        description: 'The requested article was not found',
      },
      rubric: {
        title: 'Rubric not found',
        description: 'The requested rubric was not found',
      },
      author: {
        title: 'Author not found',
        description: 'The requested author was not found',
      },
      page: {
        title: 'Page not found',
        description: 'The requested page was not found',
      },
      content: {
      title: 'Content not found',
      description: 'The requested content was not found',
      },
    },
  },

  // ===================================================================
  // NAVIGATION - Complete structured navigation
  // ===================================================================
  navigation: {
    labels: {
      home: 'Home',
      articles: 'Articles',
      rubrics: 'Rubrics',
      authors: 'Authors',
      categories: 'Categories',
      search: 'Search',
      authorArticles: 'Author Articles',
      categoryArticles: 'Category Articles',
      featuredArticles: 'Featured Articles',
      searchResults: 'Search Results',
    },
    templates: {
      pageTitle: '{page} — {siteName}',
      sectionDescription: '{action} {section} on {siteName}',
      breadcrumbSeparator: '→',
      contextualPath: '{context} → {item}',
      authorContext: 'Author {authorName}',
      categoryContext: 'Category {categoryName}',
      searchContext: 'Search: {query}',
    },
    descriptions: {
      home: 'Website homepage',
      articles: 'Tips on planning, stylish ideas and the latest trends in the world of weddings and more',
      rubrics: 'Thematic sections and categories',
      authors: 'Our authors and experts',
      search: 'Search all site materials',
      fromAuthor: 'Article from author profile',
      fromCategory: 'Article from category',
      fromFeatured: 'Article from featured on homepage',
      fromSearch: 'Article from search results',
    },
    accessibility: {
      mainNavigation: 'Main navigation',
      menuTitle: 'Site menu',
      menuDescription: 'Navigation through main sections',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      logoAlt: 'EventForMe logo',
      logoMainPageLabel: 'Go to homepage',
      primarySectionsLabel: 'Primary sections',
      mainMenuLabel: 'Main menu',
      searchAndSettingsLabel: 'Search and settings',
      siteSearchLabel: 'Site search',
      skipToContent: 'Skip to main content',
      skipToNavigation: 'Skip to navigation',
      breadcrumbNavigation: 'Breadcrumb navigation',
      paginationNavigation: 'Pagination navigation',
      pageNavigation: 'Page {current} of {total}',
    },
  },

  // ===================================================================
  // SEARCH - Complete search interface
  // ===================================================================
  search: {
    labels: {
      title: 'Search',
      placeholder: 'Search articles, authors, categories...',
      results: 'Results',
      noResults: 'Nothing found',
      searching: 'Searching...',
      submit: 'Search',
      minCharacters: 'Enter at least 3 characters',
      searchButton: 'Search',
    },
    hub: { 
      tipsTitle: 'Search tips',
      tips: [
        'Enter at least 3 chars',
        'Use keywords for better results',
        'Searching in titles and descriptions of articles, authors and categories',
      ],
      exploreHeading: 'Start exploring',
      exploreDescription: 'Popular articles for start',
      browseCategories: 'Categories review',
      browseCategoriesDescription: 'Find something interesting',
      noResultsSuggestion: 'Try to change the query or explore the articles below',
      emptyStateMessage: 'Input a query to start searching',
    },
    templates: {
      resultsFor: 'Search results for "{query}"',
      pageTitle: 'Search',
      pageDescription: 'Search articles, authors, and rubrics',
      relatedTo: 'Related to "{query}"',
      resultsDescription: 'Found {count} {countLabel} for "{query}"',
      noResultsFor: 'Nothing found for "{query}"',
    },
    accessibility: {
      searchLabel: 'Site search',
      searchButtonLabel: 'Execute search',
      searchInputLabel: 'Enter search query',
      searchDescription: 'Search all site materials',
      searchResultsLabel: 'Search results',
      clearSearchLabel: 'Clear search',
      openSearch: 'Open search',
      closeSearch: 'Close search',

    },
  },

  // ===================================================================
  // SECTIONS - Template-driven, reusable across content types
  // ===================================================================
  sections: {
    labels: {
      articles: 'articles',
      rubrics: 'rubrics',
      author: 'author',
      authors: 'authors',
      illustrator: 'illustrator',
      illustratedBy: 'Illustrated by',
      categories: 'categories',
      collection: 'collection',
      source: 'Source',
      //catalog: 'catalog',
    },
    templates: {
      pageTitle: '{section} — {siteName}',
      collectionTitle: 'All {section}',
      itemInCollection: '{item} in {collection}',
      itemByAuthor: '{item} by {author}',
      collectionOf: 'Collection of {items}',
      itemsInCollectionDescription: '{items} in {collection} on {siteName}',
      authorWorksDescription: 'Works by {author} on {siteName}',
      authorArticlesOn: 'Articles by {author} on {siteName}',
      rubricArticlesOn: 'Read articles in {rubric} on {siteName}',
      exploreRubricOn: 'Explore {rubric} on {siteName}',
      emptyCollection: 'No {items} in {collection} yet',
      totalCount: 'Total {countLabel}: {count}',
      itemDescription: 'Article {name}',
      categoryDescription: 'Articles in {categoryName} category',
      noCategoryArticles: 'No articles in {categoryName} category yet',
    },
    home: {
      welcomeTitle: {
        main: 'EventForMe:',
        sub: 'A blog about weddings and more. Tips on planning, stylish ideas and the latest trends. We make wedding planning a simple and enjoyable process.',
      },
      welcomeDescription: 'Expert articles on wedding planning, decor and fashion trends, real stories from couples, and advice from event industry professionals. From choosing a venue to organizing your honeymoon, we make wedding planning an easy and enjoyable process.',
      featuredContent: 'Featured',
      latestUpdates: 'Latest Updates',
      exploreRubrics: 'Explore Rubrics',
      viewAllArticles: 'View All Articles',
      viewAllRubrics: 'View All Rubrics',
      featuredRubrics: 'Featured Rubrics',
      featuredDescription: 'Recommended materials',
      rubricsDescription: 'Discover thematic sections',
      rubricsSectionDescription: 'Our rubrics cover all aspects of wedding planning',
      viewAllRubricsDescription: 'Complete catalog of all available rubrics',
      quickNavigation: 'Quick Navigation',
    },
    socialLinks: {
      telegram: 'Telegram',
      behance: 'Behance',
      personalWebsite: 'Personal Website',
      facebook: 'Facebook',
      instagram: 'Instagram',
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      youtube: 'YouTube'
    },
    authors: {
      allAuthors: 'All Authors',
      ourAuthors: 'Our Authors',
      noAuthorsFound: 'No authors found',
      moreAuthorsToLoad: 'More authors to load',
      collectionPageDescription: 'Our editorial team is made up of passionate professionals: wedding experts who turn dreams into detailed plans, an astropsychologist with an amazing intuition, talented stylists, tireless travelers, and photographers. We explore trends, gather insights, simplify the complex, seek out creative solutions, and share practical tools to help you create your perfect wedding.',
      profileDescription: 'Author profile and publications',
      articlesWrittenBy: 'Articles by {author}',
      authorPhoto: 'Author avatar'
    },
    illustrators: {
      ourIllustrators: 'Illustrators',
      noIllustratorsFound: 'No illustrators found',
      collectionPageDescription: 'Meet our illustrators who create visual content for our materials',
    },
    rubrics: {
      allRubrics: 'All Rubrics',
      featuredRubric: 'Featured Rubric',
      articlesInRubric: 'Articles in Rubric',
      rubricList: 'Rubric List',
      rubricsCatalog: 'Rubric Catalog',
      browseAllRubrics: 'Browse All Rubrics',
      categoriesDescription: 'Over 400 articles organized by key topics — from planning the celebration to the mystique of wedding traditions. Choose the topic that interests you and find answers to all your questions about preparing for your big day',
      collectionPageDescription: 'Explore our rubrics and find tips on planning, stylish ideas and the latest trends in the world of weddings and more',
      noRubricsAvailable: 'No rubrics available yet',
      checkBackLater: 'Check back later',
      readMoreAbout: 'Don’t miss out',
      exploreRubric: 'Explore rubric',
      iconAltText: 'Rubric icon',
      noIcon: 'No icon',
      rubricIcon: 'Rubric icon {item}',
    },
    articles: {
      allArticles: 'All Articles',
      featuredArticles: 'Featured Articles',
      latestArticles: 'Latest Articles',
      noArticlesFound: 'No articles found',
      noFeaturedArticles: 'No featured articles',
      moreArticlesToLoad: 'More articles to load',
      loadMore: 'Load More',
      collectionPageDescription: 'Read our articles about planning, stylish ideas and the latest trends in the world of weddings and more',
      byAuthor: 'by author',
      inRubric: 'in rubric',
    },
  },

  // ===================================================================
  // SEO - Enhanced with not found description
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — A Blog about Weddings and More',
      description: 'A media platform about planning, stylish ideas and trends in the world of weddings in Russia and globally',
      organizationDescription: 'EventForMe is an independent media platform covering stylish ideas and trends in the world of weddings in Russia and globally. We provide expert articles, interviews with creative personalities, and event reviews to inspire and inform our audience about the latest trends in the world of weddings and more.',
      url: SITE_URL,
      contactEmail: CONTACT_EMAIL,
      socialProfiles: [
        'https://t.me/eventforme',
        'https://instagram.com/eventforme'
      ],
      geographicAreas: ['Russia', 'Europe'],
    },
    regional: {
      language: 'en',
      region: 'US',
      targetMarkets: ['Global', 'Europe', 'North America'],
    },
    templates: {
      pageTitle: '{title} — {siteName}',
      metaDescription: '{description} on {siteName}',
      collectionPage: '{collection} — {siteName}',
      notFoundDescription: 'The requested page was not found on {siteName}',
    },
    keywords: {
      base: 'EventForMe, weddings, planning, tips, ideas, trends',
      articles: 'articles, materials, publications, content',
      rubrics: 'rubrics, categories, topics, sections',
      authors: 'authors, experts, journalists, editorial',
    },
  },

  // ===================================================================
  // SHARE - Share popup content
  // ===================================================================
  share: {
    title: 'Share Article',
    platforms: {
      telegram: 'Telegram',
      whatsapp: 'WhatsApp',
      vk: 'VK',
      twitter: 'Twitter',
      facebook: 'Facebook',
      instagram: 'Instagram',
      copy: 'Copy Link',
    },
    messages: {
      linkCopied: 'Link copied!',
      instagramCopied: 'Link copied! Paste it in the Instagram app',
    },
    accessibility: {
      shareOn: 'Share on {platform}',
      closeDialog: 'Close share dialog',
    },
  },  
};

export default dictionaryEN;