import { Lang, getDictionary } from '@/config/i18n';
import { fetchRubricBasics, fetchAllCategories } from '@/api/directus';
import BreadcrumbsWrapper from '@/features/navigation/Breadcrumbs/BreadcrumbsWrapper';

export default async function CollectionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang as Lang);

  const [rubrics, categories] = await Promise.all([
    fetchRubricBasics(lang as Lang),
    fetchAllCategories(lang as Lang),
  ]);

  return (
    <>
      <BreadcrumbsWrapper
        lang={lang as Lang}
        dictionary={dictionary}
        rubrics={rubrics}
        categories={categories}
      />
      {children}
    </>
  );
}