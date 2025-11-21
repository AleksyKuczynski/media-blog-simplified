// src/main/lib/dictionary/dictionaries/en.ts
import { CONTACT_EMAIL, SITE_URL } from "../../constants/constants";

/**
 * Complete English dictionary
 * Translated from Russian version
 */
export const dictionaryEN = {
  locale: 'en_US',
  
  // ===================================================================
  // CONSENT - Cookie banner content
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
  // NAVIGATION - Complete structured navigation
  // ===================================================================
  navigation: {
    labels: {
      home: 'Home',
      articles: 'Articles',
      rubrics: 'Rubrics',
      authors: 'Authors',
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
      articles: 'All articles about culture and art',
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
      primarySections: 'Primary sections',
      utilityLinks: 'Utility links',
      skipToContent: 'Skip to main content',
      skipToNavigation: 'Skip to navigation',
    },
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
  // COMMON - Reusable UI elements
  // ===================================================================
  common: {
    actions: {
      readMore: 'Read more',
      loadMore: 'Load more',
      showAll: 'Show all',
      explore: 'Explore',
      viewAll: 'View all',
      backTo: 'Back to {target}',
      goTo: 'Go to {target}',
      close: 'Close',
      open: 'Open',
      filter: 'Filter',
      sort: 'Sort',
      reset: 'Reset',
      apply: 'Apply',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      share: 'Share',
      copy: 'Copy',
      download: 'Download',
      print: 'Print',
    },
    status: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      notFound: 'Not found',
      noResults: 'No results',
      empty: 'Empty',
      unavailable: 'Unavailable',
    },
    count: {
      articles: 'Articles:',
      rubrics: 'Rubrics:',
      authors: 'Authors:',
      results: 'Results:',
      items: 'Items:',
      total: 'Total:',
    },
    time: {
      published: 'Published',
      updated: 'Updated',
      created: 'Created',
      edited: 'Edited',
      ago: '{time} ago',
      justNow: 'Just now',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This week',
      thisMonth: 'This month',
    },
  },

  // ===================================================================
  // SECTIONS - Page-specific content
  // ===================================================================
  sections: {
    labels: {
      articles: 'Articles',
      rubrics: 'Rubrics',
      authors: 'Authors',
      search: 'Search',
      featured: 'Featured',
      latest: 'Latest',
      popular: 'Popular',
      recommended: 'Recommended',
    },
    templates: {
      sectionTitle: '{section}',
      collectionTitle: 'All {section}',
      totalCount: 'Total {countLabel}: {count}',
      itemsInSection: '{count} items in {section}',
      pageNumber: 'Page {current} of {total}',
    },
    home: {
      welcome: 'Welcome to EventForMe',
      tagline: 'Your source for culture and art news',
      featuredContent: 'Featured Content',
      latestArticles: 'Latest Articles',
      exploreRubrics: 'Explore Rubrics',
      rubricsDescription: 'Discover thematic sections covering various aspects of culture and art',
      viewAllRubrics: 'View all rubrics',
      quickNavigation: 'Quick Navigation',
      noFeaturedContent: 'No featured content available at the moment',
      checkBackSoon: 'Check back soon for new content',
    },
    articles: {
      allArticles: 'All Articles',
      latestArticles: 'Latest Articles',
      articlesByCategory: 'Articles by Category',
      noArticlesFound: 'No articles found',
      noArticlesInCategory: 'No articles in this category yet',
      articlesCount: 'articles',
      filterByCategory: 'Filter by category',
      sortBy: 'Sort by',
      sortOptions: {
        latest: 'Latest',
        oldest: 'Oldest',
        titleAsc: 'Title (A-Z)',
        titleDesc: 'Title (Z-A)',
      },
    },
    rubrics: {
      allRubrics: 'All Rubrics',
      exploreRubrics: 'Explore Rubrics',
      rubricIcon: '{item} icon',
      articlesInRubric: 'Articles in rubric',
      noRubricsAvailable: 'No rubrics available at the moment',
      checkBackLater: 'Check back later for new content',
    },
    authors: {
      ourAuthors: 'Our Authors',
      allAuthors: 'All Authors',
      authorProfile: 'Author Profile',
      articlesByAuthor: 'Articles by {author}',
      aboutAuthor: 'About the author',
      noAuthorsFound: 'No authors found',
      editorialTeam: 'Editorial Team',
    },
  },

  // ===================================================================
  // SEO - Meta tags and structured data
  // ===================================================================
  seo: {
    site: {
      name: 'EventForMe',
      fullName: 'EventForMe — Media about Culture and Art',
      description: 'Media platform about cultural events, contemporary art, and creative initiatives in Russia and worldwide',
      organizationDescription: 'EventForMe is an independent media platform covering current cultural events, art projects, and creative initiatives',
      url: SITE_URL,
      contactEmail: CONTACT_EMAIL,
      socialProfiles: [
        'https://t.me/eventforme',
        'https://vk.com/eventforme',
        'https://instagram.com/eventforme',
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
      base: 'EventForMe, culture, art, events, Russia',
      articles: 'articles, materials, publications, content',
      rubrics: 'rubrics, categories, topics, sections',
      authors: 'authors, experts, journalists, editorial',
    },
  },

  // ===================================================================
  // SEARCH - Search functionality
  // ===================================================================
  search: {
    labels: {
      title: 'Search',
      placeholder: 'Search articles, authors, rubrics...',
      results: 'Results',
      noResults: 'Nothing found',
      searching: 'Searching...',
      submit: 'Search',
      minCharacters: 'Enter at least 3 characters',
    },
    templates: {
      resultsFor: 'Search results for "{query}"',
      pageTitle: 'Search: {query} — {siteName}',
      foundCount: 'Found {count} results',
      noResultsFor: 'No results for "{query}"',
    },
    suggestions: {
      title: 'Suggestions',
      recentSearches: 'Recent searches',
      popularSearches: 'Popular searches',
      noSuggestions: 'No suggestions',
    },
    filters: {
      all: 'All',
      articles: 'Articles',
      authors: 'Authors',
      rubrics: 'Rubrics',
    },
  },

  // ===================================================================
  // ERRORS - Error messages
  // ===================================================================
  errors: {
    general: {
      title: 'Error',
      message: 'Something went wrong',
      retry: 'Try again',
      goHome: 'Go to homepage',
    },
    notFound: {
      title: '404 - Page Not Found',
      message: 'The page you are looking for does not exist',
      suggestion: 'It might have been moved or deleted',
    },
    serverError: {
      title: '500 - Server Error',
      message: 'Internal server error',
      suggestion: 'Please try again later',
    },
    loading: {
      title: 'Loading...',
      message: 'Please wait',
    },
  },

  // ===================================================================
  // FOOTER - Footer content
  // ===================================================================
  footer: {
    sections: {
      about: {
        title: 'About Us',
        description: 'EventForMe is a media platform dedicated to culture and art',
      },
      navigation: {
        title: 'Navigation',
        home: 'Home',
        articles: 'Articles',
        rubrics: 'Rubrics',
        authors: 'Authors',
      },
      legal: {
        title: 'Legal',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
      },
      contact: {
        title: 'Contact',
        email: 'Email',
        social: 'Social Media',
        telegram: 'Telegram',
        vk: 'VKontakte',
        instagram: 'Instagram',
      },
      form: {
        title: 'Contact Us',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'Your email',
        subjectPlaceholder: 'Subject',
        messagePlaceholder: 'Your message',
        submit: 'Send',
        successMessage: 'Your message has been sent. We will respond shortly.',
        errorMessage: 'An error occurred. Please try again later or email',
        emailRequired: 'Email is required',
        emailInvalid: 'Enter a valid email',
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
  // METADATA - SEO and metadata templates
  // ===================================================================
  metadata: {
    templates: {
      articleTitle: '{title} — {rubric} — {siteName}',
      collectionTitle: '{collection} — {siteName}',
      authorTitle: '{author} — Authors — {siteName}',
      searchTitle: 'Search: {query} — {siteName}',
      notFoundTitle: '404 - Page Not Found — {siteName}',
    },
    placeholders: {
      defaultTitle: 'EventForMe — Media about Culture and Art',
      defaultDescription: 'Media platform about cultural events, contemporary art, and creative initiatives',
    },
  },

  // ===================================================================
  // CONTENT - Content-specific labels and templates
  // ===================================================================
  content: {
    labels: {
      tableOfContents: 'Table of Contents',
      editorial: '{siteName} Editorial',
      readingTime: 'Reading time: {minutes} min',
      wordsCount: 'Words: {count}',
    },
    templates: {
      emptyRubric: 'No articles in {name} rubric yet',
      moreAbout: 'More about {contentType} {name}',
      writtenBy: 'Author: {author}',
      publishedIn: 'Published in {rubric}',
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
      shareOn: 'Share via {platform}',
      closeDialog: 'Close share dialog',
    },
  },
};

export default dictionaryEN;