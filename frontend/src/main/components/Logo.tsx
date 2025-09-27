// src/main/components/Logo.tsx - SEO-Enhanced Logo (Non-Destructive)
import Link from 'next/link';
import { Lang } from '../lib/dictionary/types';

interface LogoProps {
  lang: Lang;
  variant: 'desktop' | 'mobile' | 'footer';
  className?: string;
  role?: string;
  'aria-label'?: string;
}

const variantStyles = {
  desktop: 'h-20',
  mobile: 'w-80 h-[37.33px] sm:landscape:h-14 portrait:h-20',
  footer: 'w-60 h-28'
}

const containerStyles = {
  desktop: 'group flex items-center justify-center py-2',
  mobile: 'z-40 flex justify-center sm:landscape:justify-start',
  footer: 'flex items-center justify-center'
}

export default function Logo({ 
  lang, 
  variant, 
  className = '',
  role = 'img',
  'aria-label': ariaLabel
}: LogoProps) {
  // Enhanced container classes without borders on focus/active
  const linkClasses = `
    ${containerStyles[variant]}
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
    rounded-lg transition-all duration-200 no-underline
    ${className}
  `;

  return (
    <Link 
      href={`/${lang}`} 
      aria-label={ariaLabel || "EventForMe - Home"}
      title="EventForMe - Главная страница"
      className={linkClasses}
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Keep existing logo structure intact, just add schema.org metadata */}
      <div 
        className={`relative ${variantStyles[variant]}`}
        role={role}
        itemProp="logo"
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        {/* Keep the existing SVG exactly as it is */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 599 279" 
          className={`w-full h-full ${variant === 'footer' ? 'text-on-sf-var' : ''}`}
        >
          <g>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-pr-cont group-hover:fill-pr-fix transition-colors'}`}
              d="M50 237c0,1 -1,1 -2,1l-34 0c0,0 -1,0 -1,1l0 16c0,4 1,7 3,9 2,2 5,3 8,3 3,0 5,-1 7,-3 2,-2 3,-4 4,-7 0,-1 1,-1 2,-1l11 1c1,0 1,0 1,0 0,0 0,1 0,1 -1,6 -3,12 -7,15 -4,4 -10,5 -17,5 -8,0 -14,-2 -18,-6 -5,-4 -7,-10 -7,-17l0 -50c0,-7 2,-13 7,-17 5,-4 11,-7 18,-7 8,0 14,2 18,7 4,4 7,10 7,17l0 31zm-25 -43c-3,0 -6,1 -8,3 -2,2 -3,5 -3,9l0 19c0,0 0,1 1,1l20 0c0,0 1,0 1,-1l0 -19c0,-4 -1,-7 -3,-9 -2,-2 -5,-3 -8,-3zm59 84c-1,0 -1,0 -2,-1l-18 -92 0 -1c0,-1 0,-1 1,-1l13 0c1,0 2,0 2,1l11 70c0,0 0,0 0,0 0,0 0,0 0,0l11 -70c0,-1 1,-1 2,-1l13 0c1,0 1,0 1,0 0,0 0,1 0,1l-18 92c0,1 -1,1 -2,1l-13 0zm97 -41c0,1 -1,1 -1,1l-34 0c0,0 -1,0 -1,1l0 16c0,4 1,7 3,9 2,2 5,3 8,3 3,0 5,-1 7,-3 2,-2 3,-4 4,-7 0,-1 1,-1 2,-1l11 1c1,0 1,0 1,0 0,0 0,1 0,1 -1,6 -3,12 -7,15 -4,4 -10,5 -17,5 -8,0 -14,-2 -18,-6 -5,-4 -7,-10 -7,-17l0 -50c0,-7 2,-13 7,-17 5,-4 11,-7 18,-7 8,0 14,2 18,7 4,4 7,10 7,17l0 31zm-25 -43c-3,0 -6,1 -8,3 -2,2 -3,5 -3,9l0 19c0,0 0,1 1,1l20 0c0,0 1,0 1,-1l0 -19c0,-4 -1,-7 -3,-9 -2,-2 -5,-3 -8,-3zm76 -12c6,0 11,2 14,6 3,4 5,10 5,18l0 70c0,1 -1,1 -1,1l-11 0c-1,0 -1,0 -1,-1l0 -69c0,-4 -1,-7 -3,-10 -2,-2 -4,-3 -7,-3 -3,0 -6,1 -8,3 -2,2 -3,5 -3,9 0,1 0,1 0,1l0 69c0,1 -1,1 -2,1l-11 0c-1,0 -1,0 -1,-1l0 -92c0,-1 1,-2 1,-2l11 0c1,0 2,1 2,2l0 4c0,0 0,0 0,0 0,0 0,0 1,0 4,-4 9,-7 15,-7zm66 10c0,1 -1,1 -1,1l-10 0c0,0 -1,0 -1,1l0 61c0,4 1,7 2,8 1,2 4,2 7,2l1 0c1,0 2,1 2,2l0 10c0,1 -1,1 -2,1l-5 0c-6,0 -11,-1 -14,-4 -3,-2 -5,-7 -5,-14 0,-43 0,-72 0,-96 0,-1 1,-1 2,-1l11 0c1,0 1,1 1,1l0 18c0,0 0,1 1,1l10 0c1,0 1,1 1,2l0 7z"
            />
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-tr-cont group-hover:fill-tr-fix transition-colors'}`}
              d="M509 182c6,0 11,2 14,7 3,4 5,11 5,19l0 69c0,1 -1,2 -2,2l-11 0c-1,0 -1,-1 -1,-2l0 -68c0,-4 -1,-8 -3,-10 -2,-2 -4,-4 -7,-4 -3,0 -6,1 -8,4 -2,2 -3,6 -3,10l0 69c0,1 -1,2 -2,2l-11 0c-1,0 -2,-1 -2,-2l0 -68c0,-4 -1,-8 -3,-10 -2,-2 -4,-4 -7,-4 -3,0 -6,1 -8,4 -2,2 -3,6 -3,10l0 69c0,1 -1,2 -1,2l-11 0c-1,0 -2,-1 -2,-2l0 -92c0,-1 1,-1 2,-1l11 0c1,0 1,0 1,1l0 4c0,0 0,0 0,0 0,0 0,0 1,0 2,-2 4,-4 7,-5 3,-1 5,-2 8,-2 8,0 13,3 16,10 0,0 0,0 0,0 0,0 0,0 0,-1 2,-3 5,-6 8,-7 3,-1 6,-2 10,-2zm90 55c0,1 -1,1 -1,1l-34 0c0,0 -1,0 -1,1l0 16c0,4 1,7 3,9 2,2 5,3 8,3 3,0 5,-1 7,-3 2,-2 3,-4 4,-7 0,-1 1,-1 2,-1l11 1c1,0 1,0 1,0 0,0 0,1 0,1 -1,6 -3,12 -7,15 -4,4 -10,5 -17,5 -8,0 -14,-2 -18,-6 -5,-4 -7,-10 -7,-17l0 -50c0,-7 2,-13 7,-17 5,-4 11,-7 18,-7 8,0 14,2 18,7 4,4 7,10 7,17l0 31zm-25 -43c-3,0 -6,1 -8,3 -2,2 -3,5 -3,9l0 19c0,0 0,1 1,1l20 0c0,0 1,0 1,-1l0 -19c0,-4 -1,-7 -3,-9 -2,-2 -5,-3 -8,-3z"
            />
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-tr-cont group-hover:fill-tr-fix transition-colors'}`}
              d="M285 48c13,23 41,35 67,32 1,-15 2,-30 5,-44 3,-15 11,-34 28,-36 19,-1 25,26 21,44 -5,23 -16,39 -39,47 0,8 0,19 0,28 2,2 4,3 6,5 17,-3 33,-16 43,-29 3,-4 11,-10 16,-5 6,7 -4,14 -6,21 -2,8 0,20 6,25 7,6 21,5 27,-3 6,-8 9,-24 6,-34 -7,1 -21,0 -23,-9 -2,-7 4,-13 10,-15 7,-3 18,1 23,6 10,-4 22,-12 27,-23 -6,-5 -10,-12 -9,-20 1,-8 9,-17 17,-13 7,3 9,15 8,22 4,2 8,2 12,1 3,-1 6,-3 9,-3 5,-1 9,3 8,8 -1,5 -4,10 -6,14 -3,7 -5,19 0,26 5,8 19,5 24,0 8,-6 15,-17 20,-26 1,-1 2,-2 3,-1l8 1c2,0 2,2 2,4 -7,12 -15,25 -26,34 -12,9 -34,16 -44,0 -7,-11 -5,-28 0,-40 -5,1 -11,0 -16,-1 -7,13 -19,23 -32,29 3,15 -2,35 -12,47 -11,14 -33,19 -47,7 -8,-7 -11,-20 -11,-30 -8,6 -21,14 -30,18 7,11 9,25 6,37 -3,21 -9,42 -13,63 -1,3 -1,6 -2,8 -2,6 -10,13 -15,7 -6,-7 -4,-87 -4,-113 -6,-2 -13,-6 -12,-14 1,-6 6,-11 12,-11 0,-5 0,-13 0,-19 -31,4 -65,-8 -81,-36 -1,-1 0,-2 1,-3l10 -8c1,-1 3,-1 4,1zm83 29c15,-6 24,-17 27,-32 2,-8 1,-25 -10,-28 -8,-2 -11,13 -12,18 -3,14 -4,28 -5,42zm0 66c0,16 -1,58 -1,74 3,-10 7,-29 9,-44 2,-11 0,-21 -8,-30z"
            />
          </g>
        </svg>
        
        {/* Schema.org metadata - invisible but SEO-helpful */}
        <meta itemProp="url" content="https://event4me.eu" />
        <meta itemProp="name" content="EventForMe" />
        {variant !== 'mobile' && (
          <>
            <meta itemProp="sameAs" content="https://event4me.eu/ru" />
            <meta itemProp="alternateName" content="Event4Me" />
            <meta itemProp="description" content="Медиа-проект о культурных событиях, музыке и современных идеях" />
            <meta itemProp="foundingDate" content="2024" />
            <meta itemProp="areaServed" content="Russia" />
            <meta itemProp="knowsAbout" content="События, Культура, Музыка, Идеи" />
          </>
        )}
      </div>
      
      {/* Hidden text for screen readers only */}
      <span className="sr-only">
        EventForMe — медиа-проект о культурных событиях. Перейти на главную страницу.
      </span>
    </Link>
  );
}