// src/main/components/Main/RubricCard.tsx - MIGRATED: Uses unified dictionary
import Link from "next/link";
import Image from "next/image";
import { Dictionary } from '@/main/lib/dictionary/types';
import { getLocalizedArticleCount } from '@/main/lib/dictionary/helpers';
import { Asset } from '@/main/lib/directus/directusInterfaces';
import { DIRECTUS_URL } from '@/main/lib/directus/directusConstants';

interface RubricCardProps {
  rubric: {
    slug: string;
    name: string;
    description?: string;
    articleCount: number;
    nav_icon?: string;
    iconMetadata?: Asset | null;
  };
  dictionary: Dictionary; // UPDATED: Use unified dictionary type
}

export function RubricCard({ rubric, dictionary }: RubricCardProps) {
  // UPDATED: Use language-agnostic helper with dictionary pluralization
  const articleCountText = getLocalizedArticleCount(
    rubric.articleCount, 
    dictionary.common.articles
  );
  
  // Generate icon URL if available
  const iconUrl = rubric.nav_icon ? `${DIRECTUS_URL}/assets/${rubric.nav_icon}` : null;
  
  // UPDATED: Use dictionary for accessibility text
  const iconAlt = rubric.iconMetadata?.title || 
    `${dictionary.accessibility.rubricVisualIndicator} ${rubric.name}`;

  return (
    <Link 
      href={`/ru/${rubric.slug}`} 
      className="block group"
      aria-label={`${rubric.name} - ${articleCountText}`}
      title={`${dictionary.sections.rubrics.exploreRubric} "${rubric.name}" (${articleCountText})`}
    >
      <article 
        className="
          h-full bg-sf-cont rounded-2xl border border-ol-var 
          shadow-sm hover:shadow-lg transition-all duration-300
          p-6 hover:scale-105 focus-within:ring-2 focus-within:ring-primary
          flex flex-col items-center text-center min-h-[200px]
        "
        itemScope 
        itemType="https://schema.org/Article"
      >
        {/* Icon Display Section */}
        {iconUrl && rubric.iconMetadata && (
          <header className="mb-4">
            <div className="
              w-16 h-16 mx-auto mb-3 flex items-center justify-center
              bg-sf-hi rounded-full group-hover:bg-pr-cont/10 transition-colors
            ">
              <Image
                src={iconUrl}
                alt={iconAlt}
                width={rubric.iconMetadata.width > 40 ? 40 : rubric.iconMetadata.width}
                height={rubric.iconMetadata.height > 40 ? 40 : rubric.iconMetadata.height}
                className="
                  max-w-10 max-h-10 object-contain
                  group-hover:scale-110 transition-transform duration-200
                "
                priority={false}
                loading="lazy"
                itemProp="image"
              />
            </div>
          </header>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Title */}
          <h3 
            className="text-xl font-bold text-on-sf mb-3 group-hover:text-primary transition-colors"
            itemProp="name"
          >
            {rubric.name}
          </h3>

          {/* Description - NEW: Enhanced with proper truncation */}
          {rubric.description && (
            <p 
              className="text-on-sf-var text-sm mb-4 leading-relaxed"
              itemProp="description"
            >
              {rubric.description.length > 100 
                ? `${rubric.description.substring(0, 100).trim()}...`
                : rubric.description
              }
            </p>
          )}

          {/* Article Count */}
          <div className="text-sm text-muted-foreground mt-auto">
            <span itemProp="articleCount">
              {articleCountText}
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <footer className="mt-4 pt-4 border-t border-ol-var/30 w-full text-center">
          <span className="text-sm text-primary font-medium group-hover:underline">
            {dictionary.sections.rubrics.exploreRubric} →
          </span>
        </footer>
      </article>
    </Link>
  );
}