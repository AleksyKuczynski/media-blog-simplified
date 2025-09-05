import { Lang } from "../dictionaries/dictionariesTypes";
import { Rubric } from "../directus";

export function getRubricSEOData(rubric: Rubric, lang: Lang) {
  const translation = rubric.translations.find(t => t.languages_code === lang) || rubric.translations[0];
  
  if (!translation) {
    return null;
  }

  return {
    slug: rubric.slug,
    name: translation.name,
    description: translation.description || `Статьи в рубрике ${translation.name}`,
    metaTitle: translation.meta_title || translation.name,
    metaDescription: translation.meta_description || `Все статьи в рубрике ${translation.name} на EventForMe`,
    focusKeyword: translation.focus_keyword || translation.name,
    ogTitle: translation.og_title || translation.meta_title || translation.name,
    ogDescription: translation.og_description || translation.meta_description || `Статьи в рубрике ${translation.name}`,
    yandexDescription: translation.yandex_description || translation.meta_description || `Рубрика ${translation.name}`,
    articleCount: rubric.articleCount,
    url: `https://event4me.eu/ru/${rubric.slug}`
  };
}