// src/main/components/Footer/Footer.tsx
import { Dictionary, Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import Link from 'next/link';

interface FooterProps {
  lang: Lang;
  translations: Dictionary;
}

export default function Footer({ lang, translations }: FooterProps) {
  const { footer, navigation } = translations;
  const currentYear = new Date().getFullYear();

  // ✅ SIMPLIFIED: Basic structured data only
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EventForMe",
    "url": `https://event4me.eu/ru`, // ✅ HARDCODED: Static Russian URL
    "logo": "https://event4me.eu/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@event4me.eu",
      "contactType": "customer support"
    }
  };

  return (
    <footer className="bg-sf-cont text-on-sf-var py-16">
      <div className="container mx-auto px-4">
        
        {/* ✅ SIMPLIFIED: Single column layout for mobile, basic grid for desktop */}
        <div className="flex flex-col space-y-12 md:grid md:grid-cols-3 md:gap-12 md:space-y-0">
          
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.about.title}
            </h3>
            <p className="text-on-sf-var">
              {footer.about.description}
            </p>
          </div>

          {/* Essential Navigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-prcolor">
              {footer.quickLinks.title}
            </h3>
            <nav className="space-y-2">
              <div>
                <Link 
                  href="/ru" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.home}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/articles" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.articles}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/rubrics" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.rubrics}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/authors" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.authors}
                </Link>
              </div>
              <div>
                <Link 
                  href="/ru/search" 
                  className="text-on-sf-var hover:text-prcolor transition-colors duration-200"
                >
                  {navigation.search}
                </Link>
              </div>
            </nav>
          </div>

          {/* Legal & Attribution */}
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-on-sf-var">
                &copy; {currentYear} EventForMe. {footer.credentials.copyright}
              </p>
              <div className="space-y-1">
                <div>
                  <Link 
                    href="/ru/privacy-policy" 
                    className="text-sm text-on-sf-var hover:text-prcolor transition-colors duration-200"
                  >
                    {footer.credentials.privacyPolicy}
                  </Link>
                </div>
                <div>
                  <Link 
                    href="/ru/terms" 
                    className="text-sm text-on-sf-var hover:text-prcolor transition-colors duration-200"
                  >
                    {footer.credentials.termsOfService}
                  </Link>
                </div>
              </div>
            </div>

            {/* Attribution */}
            <div className="pt-4 border-t border-ol-var">
              <div className="flex items-center space-x-2 text-sm text-on-sf-var">
                <span>{footer.kuKraft.designedWithLove}</span>
                <a 
                  href="https://kukraft.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-prcolor hover:text-prcolor-dark transition-colors duration-200"
                >
                  KuKraft
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ✅ PRESERVED: SEO structured data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </footer>
  );
}