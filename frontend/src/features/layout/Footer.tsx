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
        <OrganizationSchema 
          dictionary={dictionary} 
          contactType="customer support" 
        />

        <div className={FOOTER_STYLES.innerContainer}>
          <div className={FOOTER_STYLES.grid}>
            {/* LEFT COLUMN: About + Social (lg+) */}
            <div className="flex flex-col gap-8 lg:col-span-1">
              {/* About */}
              <section className={FOOTER_STYLES.section.wrapper}>
                <h3 className="sr-only">{footer.about.title}</h3>
                <div className="mb-4">
                  <Logo 
                    lang={lang} 
                    variant="footer"
                    aria-label={`${seo.site.name} - ${footer.about.title}`}
                  />
                </div>
                <p className={FOOTER_STYLES.section.description}>
                  {footer.about.description}
                </p>
              </section>

              {/* Social Links */}
              <section className={FOOTER_STYLES.section.wrapper}>
                <h3 className={FOOTER_STYLES.section.heading}>
                  {footer.socialLinks.title}
                </h3>
                <nav className={FOOTER_STYLES.nav.wrapper}>
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
            </div>

            {/* RIGHT COLUMN: Legal + Contact on left, Quick Links on right (lg+) */}
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:col-span-1">
              {/* Legal + Contact */}
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
                </nav>
                <div className={FOOTER_STYLES.contact.divider}>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className={FOOTER_STYLES.contact.button}
                    aria-label={footer.contact.buttonLabel}
                  >
                    {footer.contact.buttonLabel}
                  </button>
                </div>
              </section>

              {/* Quick Links - last on mobile, bottom-right on md+, right column on lg+ */}
              <section className={cn(FOOTER_STYLES.section.wrapper, "order-first md:order-last")}>
                <h3 className={FOOTER_STYLES.section.heading}>
                  {footer.quickLinks.title}
                </h3>
                <nav 
                  className={FOOTER_STYLES.nav.wrapper}
                  aria-label={footer.quickLinks.ariaLabel}
                >
                  {footerNavItems.map((item) => (
                    <div key={item.key} className={FOOTER_STYLES.nav.itemWrapper}>
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
          </div>

          {/* Copyright */}
          <div className={FOOTER_STYLES.copyright.wrapper}>
            <div className={FOOTER_STYLES.copyright.text}>
              <p>{copyrightText}</p>
            </div>
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