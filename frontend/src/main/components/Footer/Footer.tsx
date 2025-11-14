// frontend/src/main/components/Footer/Footer.tsx
// SEO-OPTIMIZED: Responsive 1>2>4 columns, sitemap, legal links, contact modal

'use client';

import { useState } from 'react';
import { Dictionary, Lang } from '@/main/lib/dictionary';
import Link from 'next/link';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { ContactModal } from './ContactModal';

interface FooterProps {
  lang: Lang;
  dictionary: Dictionary;
}

export default function Footer({ lang, dictionary }: FooterProps) {
  const { footer, navigation, seo } = dictionary;
  const currentYear = new Date().getFullYear();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Process copyright template with current year and site name
  const copyrightText = processTemplate(footer.legal.copyright, {
    siteName: seo.site.name,
    year: currentYear.toString(),
  });

  // Enhanced structured data for Organization (email hidden from UI, kept in schema)
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
    <>
      <footer 
        className="bg-sf-cont text-on-sf-var py-12 md:py-16"
        role="contentinfo"
        aria-label={footer.accessibility.footerNavigation}
      >
        {/* Enhanced structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(organizationSchema, null, 2) 
          }}
        />

        <div className="container mx-auto px-4">
          {/* Footer Grid - Responsive 1>2>4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            
            {/* Column 1: About */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-prcolor">
                {footer.about.title}
              </h3>
              <p className="text-sm leading-relaxed">
                {footer.about.description}
              </p>
            </section>

            {/* Column 2: Quick Links */}
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
                    href={`/${lang}/authors`}
                    className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                  >
                    {navigation.labels.authors}
                  </Link>
                </div>
                {/* Sitemap link for SEO */}
                <div className="pt-2 border-t border-ol-var/20">
                  <Link 
                    href="/sitemap.xml"
                    className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.legal.sitemap}
                  </Link>
                </div>
              </nav>
            </section>

            {/* Column 3: Social Links */}
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

            {/* Column 4: Legal + Contact */}
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-prcolor">
                {footer.legal.title}
              </h3>
              <nav className="space-y-2">
                {/* Privacy Policy link */}
                <div>
                  <Link 
                    href={`/${lang}/privacy-policy`}
                    className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                  >
                    {footer.legal.privacyPolicy}
                  </Link>
                </div>
                {/* Terms of Service link */}
                <div>
                  <Link 
                    href={`/${lang}/terms`}
                    className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                  >
                    {footer.legal.terms}
                  </Link>
                </div>
                {/* Contact Us button - Opens modal instead of mailto */}
                <div className="pt-2 border-t border-ol-var/20">
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="inline-block px-4 py-2 text-sm font-medium text-on-pr bg-pr-cont hover:bg-pr-fix rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2"
                    aria-label={footer.contact.buttonLabel}
                  >
                    {footer.contact.buttonLabel}
                  </button>
                </div>
              </nav>
            </section>
          </div>

          {/* Footer Bottom - Copyright */}
          <div className="mt-12 pt-8 border-t border-ol-var/20">
            <div className="text-center text-sm text-on-sf-var">
              <p>
                {copyrightText}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        dictionary={dictionary}
        fallbackEmail={seo.site.contactEmail}
      />
    </>
  );
}