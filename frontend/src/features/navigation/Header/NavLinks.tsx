// features/navigation/Header/NavLinks.tsx
'use client'

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { getHeaderNavigationItems } from '@/config/i18n/helpers/navigation';
import { NAV_LINK_STYLES } from '../navigation.styles';
import { cn } from '@/lib/utils';
import { NavigationLink } from './NavigationLink';
import { getNavImageSrc, isLinkActive } from './utils/navLinks.utils';

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  variant?: 'desktop' | 'mobile';
}

export default function NavLinks({ dictionary, lang, variant = 'desktop' }: NavLinksProps) {
  const pathname = usePathname();
  
  try {
    const navigationLinks = getHeaderNavigationItems(dictionary, lang);

    if (variant === 'mobile') {
      return (
        <>
          {navigationLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            const imageSrc = getNavImageSrc(link.key);
            
            return (
              <li 
                key={link.key}
                className={NAV_LINK_STYLES.mobile.listItem}
                role="menuitem"
              >
                <NavigationLink 
                  href={link.href}
                  className={cn(
                    NAV_LINK_STYLES.mobile.link,
                    active && NAV_LINK_STYLES.mobile.active
                  )}
                  aria-label={`${link.label} - ${link.description}`}
                  aria-current={active ? 'page' : undefined}
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
                </NavigationLink>
              </li>
            );
          })}
        </>
      );
    }

    // Desktop variant
    return (
      <>
        {navigationLinks.map((link) => {
          const active = isLinkActive(pathname, link.href);
          
          return (
            <li 
              key={link.key}
              className={NAV_LINK_STYLES.listItem}
              role="menuitem"
            >
              <NavigationLink 
                href={link.href}
                className={cn(
                  NAV_LINK_STYLES.base,
                  active && NAV_LINK_STYLES.active
                )}
                aria-label={`${link.label} - ${link.description}`}
                aria-current={active ? 'page' : undefined}
                title={link.description}
                tabIndex={active ? -1 : undefined}
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
              </NavigationLink>
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