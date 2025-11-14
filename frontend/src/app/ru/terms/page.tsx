// frontend/src/app/ru/terms/page.tsx
// Terms of Service placeholder page

import { Metadata } from 'next';
import Link from 'next/link';
import { dictionary } from '@/main/lib/dictionary';
import { DEFAULT_LANG } from '@/main/lib/constants/constants';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';

export async function generateMetadata(): Promise<Metadata> {
  const title = processTemplate(dictionary.seo.templates.pageTitle, {
    title: dictionary.footer.legal.terms,
    siteName: dictionary.seo.site.name,
  });

  const description = `Условия использования ${dictionary.seo.site.name}. Правила и условия доступа к контенту и использования сайта.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${dictionary.seo.site.url}/ru/terms`,
      siteName: dictionary.seo.site.name,
      locale: dictionary.locale,
      type: 'website',
    },
    alternates: {
      canonical: `${dictionary.seo.site.url}/ru/terms`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsPage() {
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
          {dictionary.footer.legal.terms}
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
            Общие положения
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            Добро пожаловать на {dictionary.seo.site.name}. Используя наш сайт, вы соглашаетесь 
            с настоящими Условиями использования. Пожалуйста, внимательно ознакомьтесь с ними 
            перед использованием сайта.
          </p>
          <p className="text-on-sf-var leading-relaxed">
            Если вы не согласны с какими-либо условиями, пожалуйста, воздержитесь от использования 
            нашего сайта.
          </p>
        </section>

        {/* Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Принятие условий
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Используя сайт {dictionary.seo.site.name}, вы подтверждаете, что:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4 mt-4">
            <li>Вы достигли совершеннолетия в вашей юрисдикции</li>
            <li>Вы обладаете полной правоспособностью для принятия данных условий</li>
            <li>Вы обязуетесь соблюдать все применимые законы и правила</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Интеллектуальная собственность
          </h2>
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

        {/* User Conduct */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Правила использования
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            При использовании сайта вы соглашаетесь не:
          </p>
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

        {/* Content Usage */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Использование контента
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            Вы можете:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
            <li>Читать и просматривать контент для личного некоммерческого использования</li>
            <li>Делиться ссылками на статьи в социальных сетях</li>
            <li>Цитировать материалы с обязательной ссылкой на источник</li>
          </ul>
          <p className="text-on-sf-var leading-relaxed mt-4 mb-4">
            Вы не можете без письменного разрешения:
          </p>
          <ul className="list-disc list-inside space-y-2 text-on-sf-var ml-4">
            <li>Копировать, воспроизводить или распространять контент в коммерческих целях</li>
            <li>Изменять или создавать производные работы на основе нашего контента</li>
            <li>Использовать контент в других публикациях или на других сайтах</li>
          </ul>
        </section>

        {/* External Links */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Внешние ссылки
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Наш сайт может содержать ссылки на сторонние сайты. Мы не несем ответственности за 
            содержание, политику конфиденциальности или практику сторонних сайтов. Переход по 
            внешним ссылкам осуществляется на ваш собственный риск.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Отказ от гарантий
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Сайт предоставляется «как есть», без каких-либо явных или подразумеваемых гарантий. 
            Мы не гарантируем, что сайт будет работать без перерывов или ошибок, что дефекты будут 
            исправлены, или что сайт свободен от вирусов или других вредоносных компонентов.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Ограничение ответственности
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            В максимальной степени, разрешенной законом, {dictionary.seo.site.name} не несет 
            ответственности за любые прямые, косвенные, случайные, специальные или последующие 
            убытки, возникающие в результате использования или невозможности использования сайта.
          </p>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Изменения условий
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Мы оставляем за собой право изменять настоящие Условия использования в любое время. 
            Существенные изменения вступают в силу после публикации на сайте. Продолжение 
            использования сайта после изменений означает ваше согласие с новыми условиями.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Применимое право
          </h2>
          <p className="text-on-sf-var leading-relaxed">
            Настоящие Условия использования регулируются и толкуются в соответствии с 
            законодательством Российской Федерации. Все споры, возникающие в связи с настоящими 
            условиями, подлежат разрешению в судах по месту нахождения {dictionary.seo.site.name}.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-on-sf mb-4">
            Контактная информация
          </h2>
          <p className="text-on-sf-var leading-relaxed mb-4">
            По вопросам, связанным с Условиями использования, вы можете связаться с нами:
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
      </div>

      {/* Footer navigation */}
      <div className="mt-12 pt-8 border-t border-ol-var flex flex-col sm:flex-row gap-4 justify-between">
        <Link 
          href={`/${DEFAULT_LANG}`}
          className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
        >
          ← Вернуться на главную
        </Link>
        <Link 
          href={`/${DEFAULT_LANG}/privacy-policy`}
          className="inline-flex items-center text-prcolor hover:text-pr-fix transition-colors duration-200"
        >
          Политика конфиденциальности →
        </Link>
      </div>
    </article>
  );
}