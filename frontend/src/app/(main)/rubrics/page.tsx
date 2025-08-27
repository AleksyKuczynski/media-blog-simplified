// src/app/[lang]/(main)/rubrics/page.tsx
import { fetchAllRubrics } from '@/main/lib/directus/fetchAllRubrics';
import RubricCard from '@/main/components/Main/RubricCard';
import Breadcrumbs from '@/main/components/Main/Breadcrumbs';
import { getDictionary } from '@/main/lib/dictionaries';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';
import { Rubric } from '@/main/lib/directus/directusInterfaces';
import Section from '@/main/components/Main/Section';
import CardGrid from '@/main/components/Main/CardGrid';

interface AllRubricsPageProps {
  params: {
    lang: Lang;
  };
}

export default async function AllRubricsPage({ params: { lang } }: AllRubricsPageProps) {
  const rubrics = await fetchAllRubrics(lang);
  const dict = await getDictionary(lang);
  const breadcrumbItems = [
    { label: dict.sections.rubrics.allRubrics, href: `/${lang}/rubrics` },
  ];
  const rubricBasics = rubrics.map(r => ({
    slug: r.slug,
    name: r.translations.find(t => t.languages_code === lang)?.name || r.slug
  }));

  return (
    <>
      <Breadcrumbs 
        items={breadcrumbItems} 
        rubrics={rubricBasics}
        lang={lang}
        translations={{
          home: dict.navigation.home,
          allRubrics: dict.sections.rubrics.allRubrics,
          allAuthors: dict.sections.authors.ourAuthors,
        }}
      />
      <Section 
        title={dict.sections.rubrics.allRubrics}
        ariaLabel={dict.sections.rubrics.allRubrics}
      >
        <CardGrid>
          {rubrics.map((rubric: Rubric) => (
            <RubricCard 
              key={rubric.slug} 
              rubric={rubric}
              lang={lang} 
            />
          ))}
        </CardGrid>
      </Section>
    </>
  );
}