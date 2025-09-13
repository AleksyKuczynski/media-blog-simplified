// src/main/components/Footer/Footer.tsx
// MIGRATED: Updated to use unified dictionary system

import { Dictionary, Lang } from '@/main/lib/dictionary/types';
import Link from 'next/link';

interface FooterProps {
  lang: Lang;
  dictionary: Dictionary; // UPDATED: Use new unified dictionary
}

export default function Footer({ lang, dictionary }: FooterProps) {
  // UPDATED: Use new dictionary structure
  const { footer, navigation } = dictionary;
  const currentYear = new Date().getFullYear();

  // Enhanced structured data using new dictionary
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": dictionary.seo.site.name,
    "url": dictionary.seo.site.url,
    "description": dictionary.seo.site.organizationDescription,
    "logo": "https://event4me.eu/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": dictionary.seo.site.contactEmail,
      "contactType": "customer support"
    },
    "sameAs": dictionary.seo.site.socialProfiles,
    "areaServed": dictionary.seo.site.geographicAreas
  };

  return (
    <footer className="bg-sf-cont text-on-sf-var py-16">
      {/* Enhanced structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4">
        
        {/* Improved layout for better accessibility */}
        <div className="flex flex-col space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
          
          {/* About Section - UPDATED: Use new dictionary structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.about.title}
            </h3>
            <p className="text-on-sf-var">
              {footer.about.description}
            </p>
          </div>

          {/* Essential Navigation - UPDATED: Use new dictionary structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.quickLinks.title}
            </h3>
            <nav className="space-y-2" aria-label="Быстрая навигация">
              <div>
                <Link 
                  href="/ru" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.labels.home}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/articles" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.labels.articles}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/rubrics" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.labels.rubrics}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/authors" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.labels.authors}
                </Link>
              </div>
            </nav>
          </div>

          {/* Social Links - UPDATED: Use new dictionary structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.socialLinks.title}
            </h3>
            <div className="space-y-2">
              <div>
                <Link 
                  href={dictionary.seo.site.socialProfiles[0]} // Telegram
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  Telegram
                </Link>
              </div>
              <div>
                <Link 
                  href={dictionary.seo.site.socialProfiles[1]} // VK
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  VKontakte
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="mt-12 pt-8 border-t border-ol-var/20 text-center text-sm text-on-sf-var">
          <p>
            © {currentYear} {dictionary.seo.site.name}. 
            {dictionary.seo.regional.geographicCoverage === 'Russia' ? 
              ' Медиа о культурных событиях.' : 
              ' Cultural events media.'
            }
          </p>
        </div>
      </div>
    </footer>
  )
}