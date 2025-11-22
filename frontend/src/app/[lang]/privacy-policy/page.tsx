// src/app/[lang]/privacy-policy/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/main/components/Main/Section';
import { getDictionary, Lang } from '@/main/lib/dictionary';
import { safeGenerateMetadata } from '@/main/lib/errors/metadataErrorHandler';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

export const revalidate = 86400; // 24 hours

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  return safeGenerateMetadata(params, 'page', async (lang, dictionary) => {
    const title = processTemplate(dictionary.seo.templates.pageTitle, {
      title: dictionary.footer.legal.privacyPolicy,
      siteName: dictionary.seo.site.name,
    });

    const description = lang === 'ru'
      ? `Политика конфиденциальности ${dictionary.seo.site.name}. Информация о сборе, обработке и защите персональных данных.`
      : `Privacy Policy of ${dictionary.seo.site.name}. Information about collection, processing, and protection of personal data.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${dictionary.seo.site.url}/${lang}/privacy-policy`,
        siteName: dictionary.seo.site.name,
        locale: dictionary.locale,
        type: 'website',
      },
      alternates: {
        canonical: `${dictionary.seo.site.url}/${lang}/privacy-policy`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  });
}

// Language-specific content components
const RussianPrivacyContent = ({ dictionary }: { dictionary: any }) => (
  <div className="prose prose-lg max-w-none space-y-8">
    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Введение</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        {dictionary.seo.site.name} («мы», «наш») уважает вашу конфиденциальность и стремится 
        защитить ваши персональные данные. Настоящая Политика конфиденциальности описывает, 
        как мы собираем, используем и защищаем информацию при использовании нашего сайта.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Сбор информации</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Мы можем собирать следующие типы информации:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Технические данные (IP-адрес, тип браузера, операционная система)</li>
        <li>Данные об использовании сайта (посещенные страницы, время на сайте)</li>
        <li>Файлы cookie и аналогичные технологии</li>
        <li>Информация, которую вы предоставляете добровольно (комментарии, формы обратной связи)</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Использование данных</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Мы используем собранную информацию для:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Предоставления и улучшения наших услуг</li>
        <li>Анализа использования сайта и повышения его эффективности</li>
        <li>Персонализации контента</li>
        <li>Обеспечения безопасности сайта</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Защита данных</h2>
      <p className="text-on-sf-var leading-relaxed">
        Мы применяем современные технические и организационные меры для защиты ваших 
        персональных данных от несанкционированного доступа, изменения, раскрытия или 
        уничтожения.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Сторонние сервисы</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Мы используем следующие сторонние сервисы:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Яндекс.Метрика:</strong> Для веб-аналитики.{' '}
          <a 
            href="https://yandex.ru/legal/confidential/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-prcolor hover:underline"
          >
            Политика конфиденциальности Яндекс
          </a>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Ваши права (GDPR)</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        В соответствии с GDPR, вы имеете право:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Получить доступ к вашим персональным данным</li>
        <li>Запросить исправление неточных данных</li>
        <li>Запросить удаление ваших данных</li>
        <li>Возразить против обработки ваших данных</li>
        <li>Запросить ограничение обработки ваших данных</li>
        <li>Запросить передачу ваших данных другому контролеру</li>
        <li>Отозвать согласие на обработку данных</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Файлы cookie</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        Мы используем файлы cookie для:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Обеспечения функционирования сайта</li>
        <li>Аналитики и статистики</li>
        <li>Улучшения пользовательского опыта</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4">
        Вы можете управлять файлами cookie через настройки вашего браузера.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Контактная информация</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        По вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:
      </p>
      <ul className="list-none space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Email:</strong>{' '}
          <a 
            href={`mailto:${dictionary.seo.site.contactEmail}`}
            className="text-prcolor hover:underline"
          >
            {dictionary.seo.site.contactEmail}
          </a>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Изменения в политике</h2>
      <p className="text-on-sf-var leading-relaxed">
        Мы можем периодически обновлять настоящую Политику конфиденциальности. О существенных 
        изменениях мы будем уведомлять через сайт. Рекомендуем регулярно просматривать эту 
        страницу для получения актуальной информации.
      </p>
    </section>
  </div>
);

const EnglishPrivacyContent = ({ dictionary }: { dictionary: any }) => (
  <div className="prose prose-lg max-w-none space-y-8">
    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Introduction</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        {dictionary.seo.site.name} ("we", "our") respects your privacy and strives to protect your 
        personal data. This Privacy Policy describes how we collect, use, and protect information 
        when you use our site.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Information Collection</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Technical data (IP address, browser type, operating system)</li>
        <li>Site usage data (pages visited, time on site)</li>
        <li>Cookies and similar technologies</li>
        <li>Information you voluntarily provide (comments, feedback forms)</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Data Usage</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        We use the collected information to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Provide and improve our services</li>
        <li>Analyze site usage and enhance its effectiveness</li>
        <li>Personalize content</li>
        <li>Ensure site security</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Data Protection</h2>
      <p className="text-on-sf-var leading-relaxed">
        We employ modern technical and organizational measures to protect your personal data from 
        unauthorized access, modification, disclosure, or destruction.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Third-Party Services</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        We use the following third-party services:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Yandex.Metrica:</strong> For web analytics.{' '}
          <a 
            href="https://yandex.com/legal/confidential/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-prcolor hover:underline"
          >
            Yandex Privacy Policy
          </a>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Your Rights (GDPR)</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        In accordance with GDPR, you have the right to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Object to the processing of your data</li>
        <li>Request restriction of data processing</li>
        <li>Request transfer of your data to another controller</li>
        <li>Withdraw consent for data processing</li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Cookies</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        We use cookies to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
        <li>Ensure site functionality</li>
        <li>Analytics and statistics</li>
        <li>Improve user experience</li>
      </ul>
      <p className="text-on-sf-var leading-relaxed mt-4">
        You can manage cookies through your browser settings.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Contact Information</h2>
      <p className="text-on-sf-var leading-relaxed mb-4">
        For questions related to personal data processing, you can contact us:
      </p>
      <ul className="list-none space-y-2 text-on-sf-var ml-4">
        <li>
          <strong>Email:</strong>{' '}
          <a 
            href={`mailto:${dictionary.seo.site.contactEmail}`}
            className="text-prcolor hover:underline"
          >
            {dictionary.seo.site.contactEmail}
          </a>
        </li>
      </ul>
    </section>

    <section>
      <h2 className="text-2xl font-semibold text-on-sf mb-4">Changes to Policy</h2>
      <p className="text-on-sf-var leading-relaxed">
        We may periodically update this Privacy Policy. We will notify you of significant changes 
        through the site. We recommend reviewing this page regularly for the most current information.
      </p>
    </section>
  </div>
);

export default async function PrivacyPolicyPage({
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

  return (
    <Section className="py-8" ariaLabel={dictionary.footer.legal.privacyPolicy}>
      <article className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-on-sf mb-4">
            {dictionary.footer.legal.privacyPolicy}
          </h1>
          <p className="text-on-sf-var">
            {lastUpdatedLabel}: {currentDate}
          </p>
        </header>

        {/* Language-specific content */}
        {lang === 'ru' ? (
          <RussianPrivacyContent dictionary={dictionary} />
        ) : (
          <EnglishPrivacyContent dictionary={dictionary} />
        )}

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-ol-var">
          <Link 
            href={`/${lang}`}
            className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
          >
            {backToHomeLabel}
          </Link>
        </div>
      </article>
    </Section>
  );
}