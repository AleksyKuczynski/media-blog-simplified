// features/navigation/Header/utils/navLinks.utils.ts

/**
 * Navigation image mapping
 */
export const NAV_IMAGE_MAP: Record<string, string> = {
  home: '/home.svg',
  articles: '/articles.svg',
  rubrics: '/rubrics.svg',
  authors: '/authors.svg',
};

/**
 * Get image source for navigation item
 */
export function getNavImageSrc(key: string): string {
  return NAV_IMAGE_MAP[key] || '/articles.png';
}

/**
 * Check if link is active based on pathname
 */
export function isLinkActive(pathname: string, href: string): boolean {
  return pathname === href || pathname === `${href}/`;
}