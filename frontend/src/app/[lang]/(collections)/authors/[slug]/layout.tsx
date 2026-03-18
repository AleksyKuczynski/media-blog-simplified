import { Lang, getDictionary } from '@/config/i18n';
import { fetchRubricBasics, fetchAllCategories, fetchAuthorBySlug } from '@/api/directus';
import Breadcrumbs from '@/features/navigation/Breadcrumbs/Breadcrumbs';

export default async function AuthorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang; slug: string }>;
}) {
  const { lang, slug } = await params;
  const dictionary = getDictionary(lang);
  const pathname = `/${lang}/authors/${slug}`;

  const [rubrics, categories, author] = await Promise.all([
    fetchRubricBasics(lang),
    fetchAllCategories(lang),
    fetchAuthorBySlug(slug, lang),
  ]);

  return (
    <>
      <Breadcrumbs
        lang={lang}
        dictionary={dictionary}
        rubrics={rubrics}
        categories={categories}
        pathname={pathname}
        authorName={author?.name}
      />
      {children}
    </>
  );
}