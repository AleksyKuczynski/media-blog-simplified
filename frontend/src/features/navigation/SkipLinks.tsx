// features/navigation/SkipLinks.tsx
'use client';

import { Dictionary } from '@/config/i18n';
import { getSkipLinksAccessibility, getSkipLinksData } from '@/config/i18n/helpers/navigation';
import { SKIP_LINKS_STYLES } from './navigation.styles';

interface SkipLinksProps {
  dictionary: Dictionary;
}

export default function SkipLinks({ dictionary }: SkipLinksProps) {
  try {
    const skipLinks = getSkipLinksData(dictionary);
    const accessibility = getSkipLinksAccessibility(dictionary);

    return (
      <div 
        className={SKIP_LINKS_STYLES.wrapper}
        role="region"
        aria-label={accessibility.skipLinksDescription}
      >
        <nav 
          aria-label={accessibility.keyboardNavigationLabel}
          className={SKIP_LINKS_STYLES.region}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <ul className={SKIP_LINKS_STYLES.list} role="list">
            <li>
              <a 
                href={skipLinks.skipToContent.href}
                className={SKIP_LINKS_STYLES.link}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToContent.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToNavigation.href}
                className={SKIP_LINKS_STYLES.link}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToNavigation.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToSearch.href}
                className={SKIP_LINKS_STYLES.link}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToSearch.label}</span>
              </a>
            </li>
            <li>
              <a 
                href={skipLinks.skipToFooter.href}
                className={SKIP_LINKS_STYLES.link}
                tabIndex={0}
                itemProp="url"
              >
                <span itemProp="name">{skipLinks.skipToFooter.label}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
    
  } catch (error) {
    console.error('SkipLinks: Error rendering skip links', error);
    
    return (
      <div 
        className={SKIP_LINKS_STYLES.wrapper}
        role="region"
        aria-label={dictionary.footer.accessibility.footerNavigation}
      >
        <nav 
          className={SKIP_LINKS_STYLES.region}
          aria-label={dictionary.footer.quickLinks.title}
          itemScope
          itemType="https://schema.org/SiteNavigationElement"
        >
          <ul className={SKIP_LINKS_STYLES.list} role="list">
            {/* Fallback links */}
            <li>
              <a href="#main-content" className={SKIP_LINKS_STYLES.link} itemProp="url">
                <span itemProp="name">{dictionary.navigation.accessibility.skipToContent}</span>
              </a>
            </li>
            <li>
              <a href="#main-navigation" className={SKIP_LINKS_STYLES.link} itemProp="url">
                <span itemProp="name">{dictionary.navigation.accessibility.skipToNavigation}</span>
              </a>
            </li>
            <li>
              <a href="#site-search" className={SKIP_LINKS_STYLES.link} itemProp="url">
                <span itemProp="name">{dictionary.search.accessibility.searchLabel}</span>
              </a>
            </li>
            <li>
              <a href="#site-footer" className={SKIP_LINKS_STYLES.link} itemProp="url">
                <span itemProp="name">{dictionary.footer.accessibility.skipToFooter}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}