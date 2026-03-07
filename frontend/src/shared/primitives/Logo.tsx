// src/main/components/Logo.tsx - SEO-Enhanced Logo (Non-Destructive)
import Link from 'next/link';
import { dictionary, Lang } from '../../config/i18n';
import { NavigationLink } from '@/features/navigation/Header/NavigationLink';

interface LogoProps {
  lang: Lang;
  variant: 'desktop' | 'mobile' | 'footer';
  className?: string;
  role?: string;
  'aria-label'?: string;
}

const variantStyles = {
  desktop: 'h-20',
  mobile: 'w-24 md:w-16 landscape:h-14 portrait:h-20 md:portrait:h-16',
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
    no-underline
    ${className}
  `;

  return (
    <NavigationLink 
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
          viewBox="0 0 10.83 10.83" 
          className={`w-full h-full ${variant === 'footer' ? 'text-on-sf-var' : ''}`}
        >
          <g>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-tr-cont group-hover:fill-tr-fix transition-colors'}`}
              d="M0.92 0l1.95 0c-0.06,0.03 -0.11,0.07 -0.16,0.1 -0.39,0.25 -1.06,0.83 -1.07,1.34 0,0.17 0.09,0.28 0.2,0.38 -0.01,0.01 -0.03,0.02 -0.04,0.03 -0.39,0.2 -0.75,0.5 -0.93,0.92 -0.14,0.3 -0.11,0.51 0.02,0.81 0.23,0.52 1.07,0.49 1.53,0.39 0.38,-0.08 0.75,-0.22 1.1,-0.4 0.25,-0.12 0.52,-0.31 0.56,-0.61 0,-0.08 -0.01,-0.25 -0.05,-0.32 -0.03,-0.04 -0.09,0.04 -0.14,0.08 -0.49,0.32 -1.03,0.56 -1.59,0.75 -0.2,0.07 -0.89,0.28 -1.02,0.01 -0.1,-0.19 -0.02,-0.38 0.1,-0.55 0.27,-0.36 0.72,-0.63 1.11,-0.88 0.31,-0.2 0.71,-0.26 0.99,-0.47 0.07,-0.07 0.17,-0.28 0.16,-0.38 -0.01,-0.04 -0.04,-0.06 -0.1,-0.04 -0.27,0.1 -0.54,0.22 -0.82,0.3 -0.11,0.04 -0.62,0.17 -0.68,0.02 -0.1,-0.25 0.61,-0.77 0.82,-0.92 0.27,-0.18 0.74,-0.45 1.06,-0.49 0.06,0 0.33,-0.02 0.37,0.19 0.03,0.11 0.02,0.33 -0.1,0.58 -0.03,0.07 -0.02,0.09 0.03,0.11 0.05,0.01 0.16,0 0.2,-0.03 0.06,-0.03 0.09,-0.09 0.14,-0.2 0.09,-0.21 0.14,-0.44 0.09,-0.64 0.32,0.14 0.54,0.46 0.54,0.84l0 3.35c0,0.51 -0.41,0.92 -0.92,0.92l-3.35 0c-0.51,0 -0.92,-0.41 -0.92,-0.92l0 -3.35c0,-0.51 0.41,-0.92 0.92,-0.92z"/>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-sec-cont group-hover:fill-sec-fix transition-colors'}`}
              d="M9.91 0l-3.36 0c-0.5,0 -0.91,0.41 -0.91,0.92l0 3.35c0,0.51 0.41,0.92 0.91,0.92l0.84 0c-0.06,-0.56 -0.12,-1.11 -0.14,-1.61l-0.86 0 0.39 -0.47 0.45 0c-0.01,-1.18 0.22,-2.06 1.04,-2.28 1.15,-0.3 1.72,0.31 1.73,1.1l-0.47 0.57c-0.05,-0.63 -0.3,-1.5 -1.03,-1.32 -0.51,0.12 -0.55,0.9 -0.43,1.93l0.95 0 -0.38 0.47 -0.51 0c0.07,0.51 0.17,1.06 0.25,1.61l1.53 0c0.5,0 0.92,-0.41 0.92,-0.92l0 -3.35c0,-0.51 -0.42,-0.92 -0.92,-0.92z"/>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-pr-cont group-hover:fill-pr-fix transition-colors'}`}
              d="M9.91 10.83l-1.49 0 0.5 -0.62 1.64 -2.02 0 0 -2.4 -0.26 -0.75 -2.29 0 0 -1.64 2.02 -0.13 0.17 0 -1.28c0,-0.5 0.41,-0.91 0.91,-0.91l3.36 0c0.5,0 0.92,0.41 0.92,0.91l0 3.36c0,0.5 -0.42,0.92 -0.92,0.92zm-2.36 0l-1 0c-0.5,0 -0.91,-0.42 -0.91,-0.92l0 -1.01 0.41 -0.5 1.09 -1.35 0.5 1.52 1.6 0.18 0 0 -1.1 1.35 -0.59 0.73z"/>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-sec-cont group-hover:fill-sec-fix transition-colors'}`}
              d="M2.6 6.49l0.23 -0.27c0.47,-0.56 1.3,-0.63 1.86,-0.16 0.56,0.47 0.63,1.3 0.16,1.86l-2.21 2.64c-0.12,0.15 -0.32,0.13 -0.43,-0.03l-1.97 -2.81c-0.42,-0.6 -0.27,-1.42 0.32,-1.84 0.6,-0.42 1.43,-0.28 1.85,0.32l0.19 0.29z"/>          </g>
        </svg>
        
        {/* Schema.org metadata - invisible but SEO-helpful */}
        <meta itemProp="url" content={`https://${dictionary.seo.site.url}/${lang}`} />
        <meta itemProp="name" content="EventForMe" />
        {variant !== 'mobile' && (
          <>
            <meta itemProp="sameAs" content={`https://${dictionary.seo.site.url}/${lang}`} />
            <meta itemProp="alternateName" content={dictionary.seo.site.name} />
            <meta itemProp="description" content={dictionary.seo.site.description} />
            <meta itemProp="foundingDate" content="2020" />
            <meta itemProp="areaServed" content="Russia" />
            <meta itemProp="knowsAbout" content={dictionary.seo.site.organizationDescription} />
          </>
        )}
      </div>
      
      {/* Hidden text for screen readers only */}
      <span className="sr-only">
        EventForMe — медиа-проект о культурных событиях. Перейти на главную страницу.
      </span>
    </NavigationLink>
  );
}