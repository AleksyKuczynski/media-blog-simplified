// src/main/components/SEO/schemas/RelatedLinksSchema.tsx

import { Dictionary } from '@/main/lib/dictionary';
import { processTemplate } from '@/main/lib/dictionary/helpers/templates';
import { SchemaBuilder, SchemaComposer } from '../core/SchemaBuilder';

interface RelatedLinksSchemaProps {
  dictionary: Dictionary;
  rubric: {
    slug: string;
    name: string;
  };
  categories?: Array<{
    slug: string;
    name: string;
  }>;
  currentArticleUrl: string;
}

/**
 * Structured data schema for RelatedLinks component
 * Optimized for Google and Yandex SEO with Russian market targeting
 */
export default function RelatedLinksSchema({
  dictionary,
  rubric,
  categories = [],
  currentArticleUrl
}: RelatedLinksSchemaProps): React.ReactElement {
  try {
    const baseUrl = dictionary.seo.site.url.replace(/\/$/, '');
    
    // Generate template-based descriptions using existing logic
    const articlesCollectionTitle = processTemplate(dictionary.sections.templates.collectionTitle, { 
      section: dictionary.sections.labels.articles 
    });

    const collectionDescription = processTemplate(dictionary.sections.templates.itemInCollection, {
      item: articlesCollectionTitle,
      collection: rubric.name
    });

    // Create breadcrumb data for the rubric context
    const breadcrumbs = [
      {
        name: dictionary.navigation.labels.home,
        href: '/ru',
      },
      {
        name: rubric.name,
        href: `/ru/${rubric.slug}`,
      },
    ];

    // Use SchemaComposer for standardized schema generation
    const composer = new SchemaComposer(dictionary, currentArticleUrl)
      .addBreadcrumbs(breadcrumbs)
      .addCollectionPage({
        name: rubric.name,
        description: collectionDescription,
        itemCount: 0, // Will be populated by the actual rubric page
        collectionType: 'rubrics',
      });

    // Add category schemas
    if (categories.length > 0) {
      categories.forEach(category => {
        composer.addCustomSchema({
          '@type': 'DefinedTerm',
          '@id': `${baseUrl}/ru/category/${category.slug}#term`,
          name: category.name,
          url: `${baseUrl}/ru/category/${category.slug}`,
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: dictionary.sections.rubrics.readMoreAbout,
            url: `${baseUrl}/ru/articles`, // Point to articles page instead of non-existent /categories
          },
        });
      });
    }

    // Build the combined schema
    const schema = composer.build();

    return (
      <SchemaBuilder
        schema={schema}
        dictionary={dictionary}
        priority="normal"
        enableValidation={true}
        enableOptimization={true}
      />
    );
    
  } catch (error) {
    console.error('RelatedLinksSchema: Error generating schema', error);
    return <></>;
  }
}