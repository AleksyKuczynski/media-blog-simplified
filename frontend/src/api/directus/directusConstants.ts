// src/api/directus/constants.ts

export const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL;
export const ITEMS_PER_PAGE = 6; // You can adjust this value as needed
export const MAX_SEARCH_PROPOSITIONS = 6; // Constant for search propositions limit
export const HERO_LATEST_ARTICLES_COUNT = 4; // Constant for the number of latest articles in the hero section