// src/app/[lang]/terms/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/features/layout/Section';
import { getDictionary, Lang } from '@/config/i18n';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { safeGenerateMetadata } from '@/shared/errors/lib/metadataErrorHandler';

export const revalidate = 86400; // 24 hours

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    const title = processTemplate(dictionary.seo.templates.pageTitle, {
      title: dictionary.footer.legal.terms,
      siteName: dictionary.seo.site.name,
    });

    const description = lang === 'ru' 
      ? `Условия использования ${dictionary.seo.site.name}. Правила и условия доступа к контенту и использования сайта.`
      : `Terms of Use for ${dictionary.seo.site.name}. Rules and conditions for accessing and using the site.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${dictionary.seo.site.url}/${lang}/terms`,
        siteName: dictionary.seo.site.name,
        locale: dictionary.locale,
        type: 'website',
      },
      alternates: {
        canonical: `${dictionary.seo.site.url}/${lang}/terms`,
        languages: {
          'ru': `${dictionary.seo.site.url}/ru/terms`,
          'en': `${dictionary.seo.site.url}/en/terms`,
          'x-default': `${dictionary.seo.site.url}/en/terms`,
        },

      },
      robots: {
        index: true,
        follow: true,
      },
    };
  });
}

// Language-specific content components
const RussianTermsContent = ({ dictionary }: { dictionary: any }) => (
  <div className="prose prose-lg max-w-none space-y-8">
    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Общие положения</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Добро пожаловать на {dictionary.seo.site.name}. Используя наш сайт, вы соглашаетесь 
        с настоящими Условиями использования. Пожалуйста, внимательно ознакомьтесь с ними 
        перед использованием сайта.
      </p>
      <p className="text-on-sf-var leading-relaxed">
        Если вы не согласны с какими-либо условиями, пожалуйста, воздержитесь от использования нашего сайта.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Принятие условий</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Используя сайт {dictionary.seo.site.name}, вы подтверждаете, что:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Вы достигли совершеннолетия в вашей юрисдикции</li>
        <li>Вы обладаете полной правоспособностью для принятия данных условий</li>
        <li>Вы обязуетесь соблюдать все применимые законы и правила</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Интеллектуальная собственность</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Весь контент на сайте {dictionary.seo.site.name}, включая, но не ограничиваясь:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Статьи, тексты, изображения, фотографии</li>
        <li>Графика, логотипы, иконки</li>
        <li>Видео- и аудиоматериалы</li>
        <li>Программное обеспечение и исходный код</li>
        <li>Дизайн и макеты страниц</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4">
        является собственностью {dictionary.seo.site.name} или наших авторов и партнеров и 
        защищено законами об авторском праве и интеллектуальной собственности.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Правила использования</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">При использовании сайта вы соглашаетесь не:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Нарушать законы Российской Федерации или международные законы</li>
        <li>Размещать оскорбительный, клеветнический или незаконный контент</li>
        <li>Нарушать права интеллектуальной собственности третьих лиц</li>
        <li>Распространять вирусы или вредоносное программное обеспечение</li>
        <li>Пытаться получить несанкционированный доступ к системе</li>
        <li>Использовать автоматизированные средства сбора информации (scraping)</li>
        <li>Выдавать себя за другое лицо или организацию</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Использование контента</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">Вы можете:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Читать и просматривать контент для личного некоммерческого использования</li>
        <li>Делиться ссылками на статьи в социальных сетях</li>
        <li>Цитировать материалы с обязательной ссылкой на источник</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4 mb-4">Вы не можете без письменного разрешения:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Копировать, воспроизводить или распространять контент в коммерческих целях</li>
        <li>Изменять или создавать производные работы на основе нашего контента</li>
        <li>Использовать контент в других публикациях или на других сайтах</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Отказ от гарантий</h2>
      <p className="text-on-sf-var leading-relaxed">
        Сайт предоставляется «как есть», без каких-либо явных или подразумеваемых гарантий. 
        Мы не гарантируем, что сайт будет работать без перебоев или ошибок.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Применимое право</h2>
      <p className="text-on-sf-var leading-relaxed">
        Настоящие Условия использования регулируются и толкуются в соответствии с 
        законодательством Российской Федерации. Все споры, возникающие в связи с настоящими 
        условиями, подлежат разрешению в судах по месту нахождения {dictionary.seo.site.name}.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Контактная информация</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        По вопросам, связанным с Условиями использования, вы можете связаться с нами:
      </p>
      <ul className="list-none space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${dictionary.seo.site.contactEmail}`} className="text-prcolor hover:underline">
            {dictionary.seo.site.contactEmail}
          </a>
        </li>
      </ul>
    </section>
  </div>
);

const EnglishTermsContent = ({ dictionary }: { dictionary: any }) => (
  <div className="prose prose-lg max-w-none space-y-8">
    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">General Provisions</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Welcome to {dictionary.seo.site.name}. By using our site, you agree to these Terms of Use. 
        Please read them carefully before using the site.
      </p>
      <p className="text-on-sf-var leading-relaxed">
        If you do not agree with any of these terms, please refrain from using our site.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Acceptance of Terms</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        By using {dictionary.seo.site.name}, you confirm that:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>You have reached the age of majority in your jurisdiction</li>
        <li>You have full legal capacity to accept these terms</li>
        <li>You undertake to comply with all applicable laws and regulations</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Intellectual Property</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        All content on {dictionary.seo.site.name}, including but not limited to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Articles, texts, images, photographs</li>
        <li>Graphics, logos, icons</li>
        <li>Video and audio materials</li>
        <li>Software and source code</li>
        <li>Page designs and layouts</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4">
        is the property of {dictionary.seo.site.name} or our authors and partners and is protected 
        by copyright and intellectual property laws.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">User Conduct</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">When using the site, you agree not to:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Violate laws of the Russian Federation or international laws</li>
        <li>Post offensive, defamatory, or illegal content</li>
        <li>Infringe on third-party intellectual property rights</li>
        <li>Distribute viruses or malicious software</li>
        <li>Attempt to gain unauthorized access to the system</li>
        <li>Use automated means of information collection (scraping)</li>
        <li>Impersonate another person or organization</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Content Usage</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">You may:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Read and view content for personal non-commercial use</li>
        <li>Share links to articles on social media</li>
        <li>Quote materials with proper attribution</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4 mb-4">You may not without written permission:</p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Copy, reproduce, or distribute content for commercial purposes</li>
        <li>Modify or create derivative works based on our content</li>
        <li>Use content in other publications or on other sites</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Disclaimer of Warranties</h2>
      <p className="text-on-sf-var leading-relaxed">
        The site is provided "as is" without any express or implied warranties. We do not guarantee 
        that the site will operate without interruptions or errors.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Governing Law</h2>
      <p className="text-on-sf-var leading-relaxed">
        These Terms of Use are governed by and construed in accordance with the laws of the Russian 
        Federation. All disputes arising in connection with these terms shall be resolved in courts 
        at the location of {dictionary.seo.site.name}.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Contact Information</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        For questions related to the Terms of Use, you can contact us:
      </p>
      <ul className="list-none space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${dictionary.seo.site.contactEmail}`} className="text-prcolor hover:underline">
            {dictionary.seo.site.contactEmail}
          </a>
        </li>
      </ul>
    </section>
  </div>
);

export default async function TermsPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);
  
  const currentDate = new Date().toLocaleDateString(dictionary.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const lastUpdatedLabel = lang === 'ru' ? 'Последнее обновление' : 'Last updated';
  const backToHomeLabel = lang === 'ru' ? '← Вернуться на главную' : '← Back to Home';
  const privacyPolicyLabel = lang === 'ru' ? 'Политика конфиденциальности →' : 'Privacy Policy →';

  return (
    <Section className="py-8" ariaLabel={dictionary.footer.legal.terms}>
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-on-sf mb-4">
            {dictionary.footer.legal.terms}
          </h1>
          <p className="text-on-sf-var">
            {lastUpdatedLabel}: {currentDate}
          </p>
        </header>

        {/* Language-specific content */}
        {lang === 'ru' ? (
          <RussianTermsContent dictionary={dictionary} />
        ) : (
          <EnglishTermsContent dictionary={dictionary} />
        )}

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-ol-var flex flex-col sm:flex-row gap-4 justify-between">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
          >
            {backToHomeLabel}
          </Link>
          <Link 
            href={`/${lang}/privacy-policy`}
            className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
          >
            {privacyPolicyLabel}
          </Link>
        </div>
      </article>
    </Section>
  );
}