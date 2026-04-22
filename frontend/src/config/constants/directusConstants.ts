// src/config/constants/directusConstants.ts

// For server-to-server API calls: prefer internal Docker hostname (avoids public internet roundtrip)
export const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

// For public-facing asset URLs embedded in HTML: must be reachable from the internet
export const DIRECTUS_ASSETS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;
export const ITEMS_PER_PAGE = 6; // You can adjust this value as needed
export const MAX_SEARCH_PROPOSITIONS = 6; // Constant for search propositions limit
export const HERO_LATEST_ARTICLES_COUNT = 4; // Constant for the number of latest articles in the hero section
export const DEV_ARTICLE_LIMIT = process.env.DEV_ARTICLE_LIMIT ? parseInt(process.env.DEV_ARTICLE_LIMIT, 10) : undefined; // Limit for articles in development mode