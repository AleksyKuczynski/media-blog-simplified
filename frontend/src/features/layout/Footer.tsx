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
          <div className={FOOTER_STYLES.grid}>
            
            {/* Logo + Contact Button */}
            <section className={FOOTER_STYLES.logoSection}>
              <div className={FOOTER_STYLES.contact.logoWrapper}>
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

            {/* Social Links */}
            <section className={FOOTER_STYLES.socialSection}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.socialLinks.title}
              </h3>
              <nav 
                className={FOOTER_STYLES.social.wrapper}
                aria-label={footer.socialLinks.title}
              >
                {SOCIAL_PLATFORMS.map((platform, index) => {
                  const Icon = platform.icon;
                  return (
                    <Link
                      key={platform.key}
                      href={seo.site.socialProfiles[index]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={FOOTER_STYLES.social.link}
                      aria-label={platform.ariaLabel}
                    >
                      <Icon className={FOOTER_STYLES.social.icon} />
                    </Link>
                  );
                })}
              </nav>
            </section>

            {/* About */}
            <section className={FOOTER_STYLES.aboutSection}>
              <h3 className={FOOTER_STYLES.section.heading}>
                {footer.about.title}
              </h3>
              <p className={FOOTER_STYLES.section.description}>
                {footer.about.description}
              </p>
            </section>

            {/* Legal */}
            <section className={FOOTER_STYLES.legalSection}>
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

            {/* Quick Links */}
            <section className={FOOTER_STYLES.quickLinksSection}>
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

          {/* Copyright */}
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