// features/navigation/NavLinks.tsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dictionary, Lang } from '@/config/i18n';
import { getHeaderNavigationItems } from '@/config/i18n/helpers/navigation';
import { NAV_LINK_STYLES } from './styles';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  dictionary: Dictionary;
  lang: Lang;
  className?: string;
}

export default function NavLinks({ dictionary, lang, className }: NavLinksProps) {
  const pathname = usePathname();
  
  try {
    const navigationLinks = getHeaderNavigationItems(dictionary, lang);

    return (
      <>
        {navigationLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
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