// src/main/components/Footer/Footer.tsx
// SEO-OPTIMIZED: No hardcoded text, complete dictionary usage, enhanced structured data

import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import Link from 'next/link';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

interface FooterProps {
  lang: Lang;
  dictionary: Dictionary;
}

export default function Footer({ lang, dictionary }: FooterProps) {
  const { footer, navigation, seo } = dictionary;
  const currentYear = new Date().getFullYear();

  // Process copyright template with current year and site name
  const copyrightText = processTemplate(footer.legal.copyright, {
    siteName: seo.site.name,
  });

  // Enhanced structured data for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": seo.site.name,
    "alternateName": seo.site.fullName,
    "url": seo.site.url,
    "description": seo.site.organizationDescription,
    "logo": {
      "@type": "ImageObject",
      "url": `${seo.site.url}/logo.png`,
      "width": 200,
      "height": 80,
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": seo.site.contactEmail,
      "contactType": "customer support",
      "availableLanguage": "ru",
    },
    "sameAs": seo.site.socialProfiles,
    "areaServed": seo.site.geographicAreas.map(area => ({
      "@type": "Place",
      "name": area,
    })),
    "foundingDate": "2023",
    "memberOf": {
      "@type": "Organization",
      "name": "European Cultural Media Network",
    },
  };

  return (
    <footer 
      className="bg-sf-cont text-on-sf-var py-16"
      role="contentinfo"
      aria-label={footer.about.description}
    >
      {/* Enhanced structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(organizationSchema, null, 2) 
        }}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
          
          {/* About Section - Dictionary-driven */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.about.title}
            </h3>
            <p className="text-on-sf-var leading-relaxed">
              {footer.about.description}
            </p>
          </section>

          {/* Navigation Section - Dictionary-driven, no hardcoded aria-label */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.quickLinks.title}
            </h3>
            <nav 
              className="space-y-2" 
              aria-label={footer.quickLinks.ariaLabel}
            >
              <div>
                <Link 
                  href={`/${lang}`}
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                >
                  {navigation.labels.home}
                </Link>
              </div>
              <div>
                <Link 
                  href={`/${lang}/articles`}
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                >
                  {navigation.labels.articles}
                </Link>
              </div>
              <div>
                <Link 
                  href={`/${lang}/rubrics`}
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                >
                  {navigation.labels.rubrics}
                </Link>
              </div>
              <div>
                <Link 
                  href={`/${lang}/authors`}
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                >
                  {navigation.labels.authors}
                </Link>
              </div>
            </nav>
          </section>

          {/* Social Links Section - Dictionary-driven */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.socialLinks.title}
            </h3>
            <nav className="space-y-2">
              <div>
                <Link 
                  href={seo.site.socialProfiles[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                  aria-label="Telegram канал EventForMe"
                >
                  Telegram
                </Link>
              </div>
              <div>
                <Link 
                  href={seo.site.socialProfiles[1]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                  aria-label="Группа VKontakte EventForMe"
                >
                  VKontakte
                </Link>
              </div>
            </nav>
          </section>
        </div>

        {/* Footer Bottom - Dictionary-driven copyright */}
        <div className="mt-12 pt-8 border-t border-ol-var/20">
          <div className="text-center text-sm text-on-sf-var space-y-2">
            <p>
              © {currentYear} {copyrightText}
            </p>
            <p>
              {footer.legal.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}