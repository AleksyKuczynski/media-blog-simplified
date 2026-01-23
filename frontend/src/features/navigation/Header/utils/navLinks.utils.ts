// features/navigation/Header/utils/navLinks.utils.ts

/**
 * Navigation image mapping
 */
export const NAV_IMAGE_MAP: Record<string, string> = {
  articles: '/articles.png',
  rubrics: '/rubrics.png',
  authors: '/authors.png',
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