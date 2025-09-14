// src/main/components/Main/RubricCard.tsx
// FIXED: Removed onError handler to make it Server Component compatible

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
  dictionary: Dictionary;
}

/**
 * RubricCard - Server Component compatible (no event handlers)
 * NO HARDCODED TEXT - all text comes from dictionary entries
 */
export function RubricCard({ rubric, dictionary }: RubricCardProps) {
  // Fixed: Correct parameter order for getLocalizedArticleCount helper
  const articleCountText = getLocalizedArticleCount(dictionary, rubric.articleCount);
  
  // Generate icon URL if available with proper validation
  const iconUrl = rubric.nav_icon ? `${DIRECTUS_URL}/assets/${rubric.nav_icon}` : null;
  
  // Enhanced accessibility text with fallbacks
  const iconAlt = rubric.iconMetadata?.title || 
    `${dictionary.accessibility.rubricVisualIndicator} ${rubric.name}`;

  // Enhanced link accessibility
  const linkAriaLabel = `${rubric.name} - ${articleCountText}`;
  const linkTitle = `${dictionary.sections.rubrics.exploreRubric} "${rubric.name}" (${articleCountText})`;

  // Truncate description for better card layout
  const truncatedDescription = rubric.description && rubric.description.length > 100 
    ? `${rubric.description.substring(0, 100).trim()}...`
    : rubric.description;

  return (
    <Link 
      href={`/ru/${rubric.slug}`} 
      className="block group focus:outline-none"
      aria-label={linkAriaLabel}
      title={linkTitle}
    >
      <article 
        className="
          h-full bg-sf-cont rounded-2xl border border-ol-var 
          shadow-sm hover:shadow-lg transition-all duration-300
          p-6 hover:scale-105 group-focus:ring-2 group-focus:ring-primary group-focus:ring-offset-2
          flex flex-col items-center text-center min-h-[240px]
          relative overflow-hidden
        "
        itemScope 
        itemType="https://schema.org/CollectionPage"
      >
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-pr-cont/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon Display Section */}
        {iconUrl && rubric.iconMetadata ? (
          <header className="mb-4 z-10 relative">
            <div className="
              w-16 h-16 mx-auto mb-3 flex items-center justify-center
              bg-sf-hi rounded-full group-hover:bg-pr-cont/10 transition-colors duration-200
              shadow-sm group-hover:shadow-md
            ">
              {/* FIXED: Removed onError handler for Server Component compatibility */}
              <Image
                src={iconUrl}
                alt={iconAlt}
                width={Math.min(40, rubric.iconMetadata.width || 40)}
                height={Math.min(40, rubric.iconMetadata.height || 40)}
                className="
                  max-w-10 max-h-10 object-contain
                  group-hover:scale-110 transition-transform duration-200
                  filter group-hover:brightness-110
                "
                priority={false}
                loading="lazy"
                itemProp="image"
              />
            </div>
          </header>
        ) : (
          // Fallback icon when no image available
          <header className="mb-4 z-10 relative">
            <div className="
              w-16 h-16 mx-auto mb-3 flex items-center justify-center
              bg-sf-hi rounded-full group-hover:bg-pr-cont/10 transition-colors duration-200
              text-2xl text-pr-cont group-hover:text-pr-fix
            ">
              📁
            </div>
          </header>
        )}

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-center z-10 relative">
          {/* Title */}
          <h3 
            className="
              text-xl font-bold text-on-sf mb-3 
              group-hover:text-pr-fix transition-colors duration-200
              line-clamp-2
            "
            itemProp="name"
          >
            {rubric.name}
          </h3>

          {/* Description with enhanced styling */}
          {truncatedDescription && (
            <p 
              className="
                text-on-sf-var text-sm mb-4 leading-relaxed
                line-clamp-3 flex-grow
                group-hover:text-on-sf transition-colors duration-200
              "
              itemProp="description"
            >
              {truncatedDescription}
            </p>
          )}

          {/* Article Count with enhanced styling */}
          <div className="text-sm text-on-sf-var mt-auto">
            <span 
              className="
                inline-flex items-center gap-1 
                bg-sf-hi px-3 py-1 rounded-full
                group-hover:bg-pr-cont/10 transition-colors duration-200
                font-medium
              "
              itemProp="numberOfItems"
              aria-label={`${dictionary.sections.rubrics.articlesCount}: ${rubric.articleCount}`}
            >
              📄 {articleCountText}
            </span>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <footer className="mt-4 pt-4 border-t border-ol-var/30 w-full text-center z-10 relative">
          <span className="
            text-sm text-pr-cont font-medium 
            group-hover:text-pr-fix group-hover:underline 
            transition-all duration-200
            inline-flex items-center gap-1
          ">
            {dictionary.sections.rubrics.exploreRubric}
            <span 
              className="transform group-hover:translate-x-1 transition-transform duration-200" 
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </footer>

        {/* Schema.org structured data properties */}
        <div style={{ display: 'none' }}>
          <span itemProp="url">{`https://event4me.eu/ru/${rubric.slug}`}</span>
          <span itemProp="identifier">{rubric.slug}</span>
          <span itemProp="inLanguage">ru</span>
          <span itemProp="isPartOf" itemScope itemType="https://schema.org/WebSite">
            <span itemProp="name">EventForMe</span>
            <span itemProp="url">https://event4me.eu</span>
          </span>
        </div>
      </article>
    </Link>
  );
}