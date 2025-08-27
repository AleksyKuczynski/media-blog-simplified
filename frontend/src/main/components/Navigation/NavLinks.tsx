// src/main/components/Navigation/NavLinks.tsx - SIMPLIFIED
import Link from 'next/link';
import { Lang, NavigationTranslations } from '@/main/lib/dictionaries/dictionariesTypes';
import NavLinksClient from './NavLinksClient';

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
        <li key={link.href} className="list-none">
          <Link 
            href={`/ru${link.href}`}
            className={`${linkStyles} ${!disableClientDecorations ? 'nav-link' : ''}`.trim()}
            data-href={link.href}
          >
            {translations[link.translationKey]}
          </Link>
        </li>
      ))}
      
      {/* Only include client-side active state logic if not disabled */}
      {!disableClientDecorations && (
        <NavLinksClient lang={lang} translations={translations} />
      )}
    </>
  );
}