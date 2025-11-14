// frontend/src/app/ru/privacy-policy/page.tsx
// Privacy Policy placeholder page - GDPR compliant basic version

import { Metadata } from 'next';
import Link from 'next/link';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

export async function generateMetadata(): Promise<Metadata> {
  const title = processTemplate(dictionary.seo.templates.pageTitle, {
    title: dictionary.footer.legal.privacyPolicy,
    siteName: dictionary.seo.site.name,
  });

  const description = `Политика конфиденциальности ${dictionary.seo.site.name}. Информация о сборе, обработке и защите персональных данных.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${dictionary.seo.site.url}/ru/privacy-policy`,
      siteName: dictionary.seo.site.name,
      locale: dictionary.locale,
      type: 'website',
    },
    alternates: {
      canonical: `${dictionary.seo.site.url}/ru/privacy-policy`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-on-sf mb-4">
          {dictionary.footer.legal.privacyPolicy}
        </h1>
        <p className="text-on-sf-var">
          Последнее обновление: {currentDate}
        </p>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none space-y-8">
        
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Введение
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            {dictionary.seo.site.name} («мы», «наш») уважает вашу конфиденциальность и стремится 
            защитить ваши персональные данные. Настоящая Политика конфиденциальности описывает, 
            как мы собираем, используем и защищаем информацию при использовании нашего сайта.
          </p>
        </section>

        {/* Data Collection */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Сбор информации
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            Мы собираем следующие типы информации:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
            <li>
              <strong>Автоматически собираемая информация:</strong> IP-адрес, тип браузера, 
              операционная система, страницы просмотра, время посещения
            </li>
            <li>
              <strong>Cookies:</strong> Мы используем cookies для улучшения пользовательского 
              опыта. Подробнее в разделе «Использование Cookies»
            </li>
            <li>
              <strong>Аналитика:</strong> Мы используем Яндекс.Метрику для анализа трафика сайта
            </li>
          </ul>
        </section>

        {/* Cookie Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Использование Cookies
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            Мы используем следующие типы cookies:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
            <li>
              <strong>Необходимые cookies:</strong> Обеспечивают базовую функциональность сайта 
              (сохранение настроек, предпочтений пользователя)
            </li>
            <li>
              <strong>Аналитические cookies:</strong> Помогают понять, как посетители используют 
              сайт (Яндекс.Метрика)
            </li>
            <li>
              <strong>Функциональные cookies:</strong> Запоминают ваш выбор и предпочтения
            </li>
          </ul>
          <p className="text-on-sf-var leading-relaxed mt-4">
            Вы можете управлять настройками cookies через баннер согласия на сайте или в 
            настройках вашего браузера.
          </p>
        </section>

        {/* Data Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Использование данных
          </h2>
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

        {/* Data Protection */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Защита данных
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Мы применяем современные технические и организационные меры для защиты ваших 
            персональных данных от несанкционированного доступа, изменения, раскрытия или 
            уничтожения.
          </p>
        </section>

        {/* Third Party Services */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Сторонние сервисы
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            Мы используем следующие сторонние сервисы:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
            <li>
              <strong>Яндекс.Метрика:</strong> Для веб-аналитики. 
              <a 
                href="https://yandex.ru/legal/confidential/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-prcolor hover:underline ml-1"
              >
                Политика конфиденциальности Яндекс
              </a>
            </li>
          </ul>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Ваши права (GDPR)
          </h2>
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

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Контактная информация
          </h2>
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

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Изменения в политике
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Мы можем периодически обновлять настоящую Политику конфиденциальности. О существенных 
            изменениях мы будем уведомлять через сайт. Рекомендуем регулярно просматривать эту 
            страницу для получения актуальной информации.
          </p>
        </section>
      </div>

      {/* Back to home */}
      <div className="mt-12 pt-8 border-t border-ol-var">
        <Link 
          href={`/${DEFAULT_LANG}`}
          className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
        >
          ← Вернуться на главную
        </Link>
      </div>
    </article>
  );
}