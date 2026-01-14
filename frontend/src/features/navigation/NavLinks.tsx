// features/navigation/NavLinks.tsx
'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { getHeaderNavigationItems } from '@/config/i18n/helpers/navigation';
import { NAV_LINK_STYLES } from './styles';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
  variant?: 'desktop' | 'mobile';
}

const NAV_IMAGE_MAP: Record<string, string> = {
  articles: '/articles.png',
  rubrics: '/rubrics.png',
  authors: '/authors.png',
};

export default function NavLinks({ dictionary, lang, className, variant = 'desktop' }: NavLinksProps) {
  const pathname = usePathname();
  
  try {
    const navigationLinks = getHeaderNavigationItems(dictionary, lang);

    if (variant === 'mobile') {
      return (
        <>
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href || pathname === `${link.href}/`;
            const imageSrc = NAV_IMAGE_MAP[link.key] || '/articles.png';
            
            return (
              <li 
                key={link.key}
                className={NAV_LINK_STYLES.mobile.listItem}
                role="menuitem"
              >
                <Link 
                  href={link.href}
                  className={cn(
                    NAV_LINK_STYLES.mobile.link,
                    isActive && NAV_LINK_STYLES.mobile.active
                  )}
                  aria-label={`${link.label} - ${link.description}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={NAV_LINK_STYLES.mobile.icon}>
                    <Image
                      src={imageSrc}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <span className="font-medium uppercase">
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </>
      );
    }

    return (
      <>
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href || pathname === `${link.href}/`;
          const isCurrentPage = isActive;
          
          return (
            <li 
              key={link.key}
              className={NAV_LINK_STYLES.listItem}
              role="menuitem"
            >
              <Link 
                href={link.href}
                className={cn(
                  NAV_LINK_STYLES.base,
                  isCurrentPage && NAV_LINK_STYLES.active
                )}
                aria-label={`${link.label} - ${link.description}`}
                aria-current={isCurrentPage ? 'page' : undefined}
                title={link.description}
                tabIndex={isCurrentPage ? -1 : undefined}
                itemProp="url"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
              >
                <span itemProp="name" className="font-medium">
                  {link.label}
                </span>
                <span className="sr-only" itemProp="description">
                  {link.description}
                </span>
              </Link>
            </li>
          );
        })}
      </>
    );
    
  } catch (error) {
    console.error('NavLinks: Error rendering navigation links', error);
    return null;
  }
}