// src/main/components/Navigation/NavLinks.tsx
import Link from 'next/link';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import NavLinksClient from './NavLinksClient';
import { cn } from '@/main/lib/utils/utils';

interface NavLinksProps {
  lang: Lang;
  translations: NavigationTranslations;
  linkStyles: string;
  disableClientDecorations?: boolean;
}

type NavigationLink = {
  href: string;
  translationKey: keyof NavigationTranslations;
};

const NAVIGATION_LINKS: NavigationLink[] = [
  { href: '/articles', translationKey: 'articles' },
  { href: '/rubrics', translationKey: 'rubrics' },
  { href: '/authors', translationKey: 'authors' },
];

export default function NavLinks({ 
  lang, 
  translations, 
  linkStyles,
  disableClientDecorations = false 
}: NavLinksProps) {
  return (
    <>
      {NAVIGATION_LINKS.map((link) => (
        <li key={link.href}>
          <Link 
            href={`/ru${link.href}`} // ✅ HARDCODED: Static Russian URL instead of /${lang}${link.href}
            className={cn(
              linkStyles,
              !disableClientDecorations && 'nav-link'
            )}
            data-href={link.href}
          >
            {translations[link.translationKey]}
          </Link>
        </li>
      ))}
      <NavLinksClient lang={lang} translations={translations} />
    </>
  );
}