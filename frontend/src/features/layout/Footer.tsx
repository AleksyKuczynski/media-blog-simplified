// frontend/src/features/layout/Footer.tsx
'use client';

import { useState } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import Link from 'next/link';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { ContactModal } from './ContactModal';
import { FOOTER_STYLES } from './styles';

interface FooterProps {
  lang: Lang;
  dictionary: Dictionary;
}

export default function Footer({ lang, dictionary }: FooterProps) {
  const { footer, navigation, seo } = dictionary;
  const currentYear = new Date().getFullYear();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const copyrightText = processTemplate(footer.legal.copyright, {
    siteName: seo.site.name,
    year: currentYear.toString(),
  });

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
        className={FOOTER_STYLES.container}
        role="contentinfo"
        aria-label={footer.accessibility.footerNavigation}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(organizationSchema, null, 2) 
          }}
        />

        <div className={FOOTER_STYLES.innerContainer}>
          <div className={FOOTER_STYLES.grid}>
            
            {/* Column 1: About */}
            <section className={FOOTER_STYLES.section.wrapper}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.about.title}
              </h3>
              <p className={FOOTER_STYLES.section.description}>
                {footer.about.description}
              </p>
            </section>

            {/* Column 2: Quick Links */}
            <section className={FOOTER_STYLES.section.wrapper}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.quickLinks.title}
              </h3>
              <nav 
                className={FOOTER_STYLES.nav.wrapper}
                aria-label={footer.quickLinks.ariaLabel}
              >
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {navigation.labels.home}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}/articles`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {navigation.labels.articles}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}/authors`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {navigation.labels.authors}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}/rubrics`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {navigation.labels.rubrics}
                  </Link>
                </div>
              </nav>
            </section>

            {/* Column 3: Social Links */}
            <section className={FOOTER_STYLES.section.wrapper}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.socialLinks.title}
              </h3>
              <nav className={FOOTER_STYLES.nav.wrapper}>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={seo.site.socialProfiles[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={FOOTER_STYLES.link.external}
                    aria-label="Telegram канал EventForMe"
                  >
                    Telegram
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={seo.site.socialProfiles[1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={FOOTER_STYLES.link.external}
                    aria-label="Группа VKontakte EventForMe"
                  >
                    VKontakte
                  </Link>
                </div>
              </nav>
            </section>

            {/* Column 4: Legal + Contact */}
            <section className={FOOTER_STYLES.section.wrapper}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.legal.title}
              </h3>
              <nav className={FOOTER_STYLES.nav.wrapper}>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}/privacy-policy`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {footer.legal.privacyPolicy}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href={`/${lang}/terms`}
                    className={FOOTER_STYLES.link.base}
                  >
                    {footer.legal.terms}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.nav.itemWrapper}>
                  <Link 
                    href="/sitemap.xml"
                    className={FOOTER_STYLES.link.base}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer.legal.sitemap}
                  </Link>
                </div>
                <div className={FOOTER_STYLES.contact.divider}>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className={FOOTER_STYLES.contact.button}
                    aria-label={footer.contact.buttonLabel}
                  >
                    {footer.contact.buttonLabel}
                  </button>
                </div>
              </nav>
            </section>
          </div>

          {/* Footer Bottom - Copyright */}
          <div className={FOOTER_STYLES.copyright.wrapper}>
            <div className={FOOTER_STYLES.copyright.text}>
              <p>{copyrightText}</p>
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