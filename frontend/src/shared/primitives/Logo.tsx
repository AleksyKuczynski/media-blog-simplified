// src/main/components/Logo.tsx - SEO-Enhanced Logo (Non-Destructive)
import { off } from 'node:cluster';
import { dictionary, Lang } from '../../config/i18n';
import { NavigationLink } from '@/features/navigation/Header/NavigationLink';

interface LogoProps {
  lang: Lang;
  variant: 'desktop' | 'mobile' | 'offcanvas' | 'footer';
  className?: string;
  role?: string;
  'aria-label'?: string;
}

const variantStyles = {
  desktop: 'w-16',
  mobile: 'w-12 lg:w-16',
  offcanvas: 'w-16 lg:w-20',
  footer: 'w-60 h-28'
}

const containerStyles = {
  desktop: 'group flex items-center justify-center py-2',
  mobile: 'z-40 flex justify-center',
  offcanvas: 'z-40 flex justify-center',
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
        className={`relative aspect-square ${variantStyles[variant]}`}
        role={role}
        itemProp="logo"
        itemScope
        itemType="https://schema.org/ImageObject"
      >
        {/* Keep the existing SVG exactly as it is */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 10400 10400" 
          className='w-full h-full'
        >
          <g>
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-tr-cont group-hover:fill-tr-fix transition-colors'}`}
              d="M866.43 0l1405.55 0c-198.45,141.75 -444.75,350.67 -629.24,581.53 -157.51,197.12 -270.73,411.38 -274.29,616.93 -2.38,139.58 53.26,245.86 151.63,341.4 -185.66,97.16 -361.17,217.73 -510.69,364.12 -219.91,215.3 -437.41,555.27 -420.35,875.13 16.5,307.97 193.45,629.54 492.06,741.85 342.17,112.77 711.22,107.53 1061.13,34.89 352.81,-73.19 695.83,-204.36 1015.52,-369.51 242.39,-121.42 497.35,-304.69 535.39,-593.98 7.26,-80.64 -8.77,-249.05 -47.64,-321.3 -23.18,-42.88 -73.33,-64.25 -109.52,-24.13 -13.91,12.67 -78.59,65.85 -92.74,70.35 -223.07,146.36 -455.68,272.82 -695.31,383.89 -307.31,142.42 -779.92,334.28 -1129.83,398.49 -104.32,19.13 -414.61,66.29 -477.79,-64.21 -37.94,-37.92 -35.97,-174.23 -23.76,-225.58 91.83,-385.49 771.33,-796.11 1104.56,-1009.01 129.7,-83.47 278.07,-141.11 424.72,-198.06 171.33,-66.55 340.48,-132.28 482.87,-238.15 80.74,-65.5 248.76,-401.1 113.69,-470.2 -59.02,-30.23 -118,-0.19 -172.58,21.82 -312.62,126.5 -756.92,319.48 -1097.09,328.52 -73.22,1.92 -131.14,-5.16 -141.26,-30.28 -73.7,-186.06 593.05,-677.23 734.09,-772.22 240.32,-161.86 650.46,-400.38 939.65,-436.73 104.54,-13.11 257.44,4.94 283.71,128.31 32.55,152.76 -26.15,360.69 -90.2,499.77 -33.77,73.36 -31.13,140.37 57.9,166.29 60.04,17.53 176.77,3.34 229.58,-30.47 179.4,-114.76 260.71,-523.1 237.41,-750.46 390.88,83.47 686.36,432.6 686.36,847.45l0 3177.04c0,476.56 -389.91,866.45 -866.45,866.45l-3177.08 0c-476.54,0 -866.43,-389.89 -866.43,-866.45l0 -3177.04c0,-476.56 389.89,-866.45 866.43,-866.45z"
            />
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-sec-cont group-hover:fill-sec-fix transition-colors'}`}
              d="M9531.12 0l-3177.07 0c-476.54,0 -866.45,389.89 -866.45,866.45l0 3177.04c0,476.56 389.91,866.45 866.45,866.45l559.37 0c-65.68,-448.13 -120.05,-886.97 -151.02,-1301.56l-738.52 0 414.2 -493.62 298.91 0c-29.9,-1184.08 198.5,-2090.96 1019.6,-2305.87 1121.23,-293.47 1673.43,300.75 1679.71,1066.89l-460.28 560.67c-39.57,-611.16 -283.62,-1462.99 -999.54,-1291.55 -510.57,122.27 -534.91,927.79 -409.98,1969.86l853.81 0 -414.19 493.62 -372.96 0c61.59,417.83 137.18,859.74 208.52,1301.56l1689.44 0c476.54,0 866.43,-389.89 866.43,-866.45l0 -3177.04c0,-476.56 -389.89,-866.45 -866.43,-866.45z"
            />
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-sec-cont group-hover:fill-sec-fix transition-colors'}`}
              d="M2477.1 6296.51l210.49 -250.85c446.72,-532.39 1240.43,-601.83 1772.83,-155.1 532.38,446.72 601.83,1240.43 155.1,1772.83l-2103.05 2506.3c-118.61,141.36 -305.36,128.99 -414.95,-27.51l-1869.81 -2670.37c-398.65,-569.31 -260.29,-1353.93 309.02,-1752.56 569.31,-398.63 1353.94,-260.29 1752.57,309.02l187.8 268.24z"
            />
            <path 
              className={`${variant === 'footer' ? 'fill-current' : 'fill-pr-cont group-hover:fill-pr-fix transition-colors'}`}
              d="M9531.12 10397.57l-617.72 0 1484.17 -1768.76 0 902.31c0,476.55 -389.9,866.45 -866.45,866.45zm-1454.24 0l-1722.81 0c-476.55,0 -866.44,-389.9 -866.44,-866.45l0 -35.58 626.68 -746.85 1058.96 -1262.02 0 0.02 452.31 1454.82 1511.27 192.81 -1058.95 1262.02 -1.02 1.23zm-2589.25 -1898.97l0 -2144.53c0,-476.55 389.89,-866.44 866.44,-866.44l3177.05 0c476.55,0 866.45,389.89 866.45,866.44l0 2274.73 -2266.9 -289.23 -678.47 -2182.24 -0.01 0 -1588.43 1893.02 -376.13 448.25z"
            />         
          </g>
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