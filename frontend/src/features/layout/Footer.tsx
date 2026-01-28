// features/layout/Footer.tsx
'use client';

import { useState } from 'react';
import { Dictionary, Lang } from '@/config/i18n';
import Link from 'next/link';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { ContactModal } from './ContactModal';
import { FOOTER_STYLES } from './layout.styles';
import { getFooterNavigationItems } from '@/config/i18n/helpers/navigation';
import { OrganizationSchema } from '@/shared/seo/schemas/OrganizationSchema';
import { 
  TelegramIcon, 
  VKIcon, 
  InstagramIcon 
} from '@/app/[lang]/(articles)/[rubric]/[slug]/_components/engagement/EngagementIcons';
import Logo from '@/shared/primitives/Logo';
import { cn } from '@/lib/utils';

interface FooterProps {
  lang: Lang;
  dictionary: Dictionary;
}

// Social media platform configuration with icons
const SOCIAL_PLATFORMS = [
  {
    key: 'telegram',
    label: 'Telegram',
    icon: TelegramIcon,
    ariaLabel: 'Telegram канал EventForMe',
  },
  {
    key: 'vk',
    label: 'VKontakte',
    icon: VKIcon,
    ariaLabel: 'Группа VKontakte EventForMe',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: InstagramIcon,
    ariaLabel: 'Instagram EventForMe',
  },
] as const;

export default function Footer({ lang, dictionary }: FooterProps) {
  const { footer, seo } = dictionary;
  const footerNavItems = getFooterNavigationItems(dictionary, lang);

  const currentYear = new Date().getFullYear();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const copyrightText = processTemplate(footer.legal.copyright, {
    siteName: seo.site.name,
    year: currentYear.toString(),
  });

  return (
    <>
      <footer 
        className={FOOTER_STYLES.container}
        role="contentinfo"
        aria-label={footer.accessibility.footerNavigation}
        id="site-footer"
      >
        <OrganizationSchema dictionary={dictionary} />
        
        <div className={FOOTER_STYLES.innerContainer}>
          {/* Mobile: Logo+Button > Social > About > Legal > QuickLinks */}
          {/* MD: 2 columns (2:1) - Left: Logo+Button > Social > About | Right: Legal > QuickLinks */}
          {/* LG+: 5 equal columns - About+Social span 2 | Logo+Button center | Legal+QuickLinks right 2 */}
          <div className={cn(
            // Base mobile: single column
            'flex flex-col gap-8',
            // MD: 2 columns with 2:1 ratio
            'md:grid md:grid-cols-[2fr_1fr] md:gap-8',
            // LG+: 5 equal columns
            'lg:grid-cols-[2fr_2fr_1fr_1fr] lg:gap-6 xl:gap-8'
          )}>
            
            {/* MOBILE ORDER 1 / MD LEFT COL ORDER 1 / LG+ CENTER COL */}
            <section className={cn(
              'flex flex-col gap-4',
              'md:order-1',
              'lg:col-start-2 lg:row-start-1 lg:items-center'
            )}>
              <div className="mb-4">
                  <Logo 
                    lang={lang} 
                    variant="footer"
                    aria-label={`${seo.site.name} - ${footer.about.title}`}
                  />
                </div>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className={FOOTER_STYLES.contact.button}
                aria-label={footer.contact.buttonLabel}
              >
                {footer.contact.buttonLabel}
              </button>
            </section>

            {/* MOBILE ORDER 2 / MD LEFT COL ORDER 2 / LG+ LEFT COL 2 (Social) */}
            <section className={cn(
              'md:order-2',
              'lg:col-start-1 lg:row-start-2'
            )}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.socialLinks.title}
              </h3>
              <nav 
                className="flex gap-4 mt-4"
                aria-label={footer.socialLinks.title}>
                <div className="flex gap-4">
                    {SOCIAL_PLATFORMS.map((platform, index) => {
                      const Icon = platform.icon;
                      return (
                        <Link
                          key={platform.key}
                          href={seo.site.socialProfiles[index]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-on-sf-var hover:text-prcolor transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-prcolor focus:ring-offset-2 rounded"
                          aria-label={platform.ariaLabel}
                        >
                          <Icon className="w-6 h-6" />
                        </Link>
                      );
                    })}
                  </div>
              </nav>
            </section>

            {/* MOBILE ORDER 3 / MD LEFT COL ORDER 3 / LG+ LEFT COL 1 (About - always visible) */}
            <section className={cn(
              'md:order-3',
              'lg:col-start-1 lg:row-start-1'
            )}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.about.title}
              </h3>
              <p className={FOOTER_STYLES.section.description}>
                {footer.about.description}
              </p>
            </section>

            {/* MOBILE ORDER 4 / MD RIGHT COL ORDER 1 / LG+ RIGHT COL 1 (Legal) */}
            <section className={cn(
              'md:order-5',
              'lg:col-start-4 lg:row-start-1'
            )}>
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
              </nav>
            </section>

            {/* MOBILE ORDER 5 / MD RIGHT COL ORDER 2 / LG+ RIGHT COL 2 (Quick Links) */}
            <section className={cn(
              'md:order-4',
              'lg:col-start-3 lg:row-start-1'
            )}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.quickLinks.title}
              </h3>
              <nav 
                className={FOOTER_STYLES.nav.wrapper}
                aria-label={footer.quickLinks.ariaLabel}
              >
                {footerNavItems.map((item) => (
                  <div key={item.href} className={FOOTER_STYLES.nav.itemWrapper}>
                    <Link 
                      href={item.href}
                      className={FOOTER_STYLES.link.base}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
              </nav>
            </section>
          </div>

          {/* Copyright - unaffected */}
          <div className={FOOTER_STYLES.copyright.wrapper}>
            <p className={FOOTER_STYLES.copyright.text}>
              {copyrightText}
            </p>
          </div>
        </div>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        dictionary={dictionary}
        fallbackEmail={seo.site.contactEmail}
      />
    </>
  );
}