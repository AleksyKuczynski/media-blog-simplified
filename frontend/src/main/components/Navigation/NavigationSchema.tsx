// src/main/components/Navigation/NavigationSchema.tsx - Navigation Structured Data
import { Lang, NavigationTranslations } from "@/main/lib/dictionaries/dictionariesTypes";

interface NavigationSchemaProps {
  lang: Lang;
  translations: NavigationTranslations;
}

export function NavigationSchema({ lang, translations }: NavigationSchemaProps) {
  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": "https://event4me.eu/#navigation",
    "name": "Main Navigation",
    "inLanguage": "ru",
    "hasPart": [
      {
        "@type": "WebPageElement",
        "@id": "https://event4me.eu/ru/#homepage-link",
        "name": translations.home,
        "url": "https://event4me.eu/ru",
        "description": "Главная страница EventForMe"
      },
      {
        "@type": "WebPageElement", 
        "@id": "https://event4me.eu/ru/articles/#articles-link",
        "name": translations.articles,
        "url": "https://event4me.eu/ru/articles",
        "description": "Все статьи и публикации"
      },
      {
        "@type": "WebPageElement",
        "@id": "https://event4me.eu/ru/rubrics/#rubrics-link", 
        "name": translations.rubrics,
        "url": "https://event4me.eu/ru/rubrics",
        "description": "Тематические рубрики и разделы"
      },
      {
        "@type": "WebPageElement",
        "@id": "https://event4me.eu/ru/authors/#authors-link",
        "name": translations.authors, 
        "url": "https://event4me.eu/ru/authors",
        "description": "Наши авторы и эксперты"
      }
    ]
  };

  // Search functionality schema
  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://event4me.eu/#search",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://event4me.eu/ru/search?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(navigationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchSchema)
        }}
      />
    </>
  );
}