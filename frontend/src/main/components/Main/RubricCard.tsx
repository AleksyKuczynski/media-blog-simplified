// src/main/components/Main/RubricCard.tsx - Enhanced with description support
import Link from "next/link";
import Image from "next/image";
import { Dictionary } from '@/main/lib/dictionaries/dictionariesTypes';
import { getRussianArticleCount } from '@/main/lib/dictionaries/dictionaries';
import { Asset } from '@/main/lib/directus/directusInterfaces';
import { DIRECTUS_URL } from '@/main/lib/directus/directusConstants';

interface RubricCardProps {
  rubric: {
    slug: string;
    name: string;
    description?: string;  // ✅ NEW: Add description field
    articleCount: number;
    nav_icon?: string;
    iconMetadata?: Asset | null;
  };
  lang: string;
  dict: Dictionary;
}

export function RubricCard({ rubric, lang, dict }: RubricCardProps) {
  // Use proper Russian pluralization for article count
  const articleCountText = getRussianArticleCount(rubric.articleCount);
  
  // Generate icon URL if available
  const iconUrl = rubric.nav_icon ? `${DIRECTUS_URL}/assets/${rubric.nav_icon}` : null;
  const iconAlt = rubric.iconMetadata?.title || `Иконка рубрики ${rubric.name}`;

  return (
    <Link 
      href={`/ru/${rubric.slug}`} 
      className="block group"
      aria-label={`${rubric.name} - ${articleCountText}`}
      title={`Перейти к рубрике "${rubric.name}" (${articleCountText})`}
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

        {/* Title Section */}
        <header className={iconUrl ? "" : "mb-4"}>
          <h3 
            className="
              text-lg font-display font-semibold mb-2
              text-on-sf group-hover:text-pr-cont
              transition-colors duration-200
            "
            itemProp="name"
          >
            {rubric.name}
          </h3>
        </header>

        {/* ✅ NEW: Description Section */}
        {rubric.description && (
          <div className="flex-1 mb-4 max-w-full">
            <p 
              className="
                text-sm text-on-sf-var leading-relaxed text-center
                overflow-hidden
              "
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              itemProp="description"
              title={rubric.description} // Full description on hover
            >
              {rubric.description}
            </p>
          </div>
        )}
        
        {/* Article count with proper spacing */}
        <footer 
          className={`text-sm text-on-sf-var mt-auto ${rubric.description ? '' : 'mt-4'}`}
          aria-label={`В рубрике ${rubric.name} ${articleCountText}`}
        >
          <span itemProp="articleBody">
            {articleCountText}
          </span>
        </footer>
        
        {/* ✅ ENHANCED: Schema.org metadata with description */}
        <meta itemProp="url" content={`https://event4me.eu/ru/${rubric.slug}`} />
        <meta itemProp="inLanguage" content="ru" />
        <meta itemProp="articleSection" content={rubric.name} />
        <meta itemProp="publisher" content="EventForMe" />
        {rubric.description && (
          <meta itemProp="description" content={rubric.description} />
        )}
        
        {/* Icon metadata for structured data */}
        {iconUrl && rubric.iconMetadata && (
          <>
            <meta itemProp="image" content={iconUrl} />
            <div itemScope itemType="https://schema.org/ImageObject" className="hidden">
              <meta itemProp="url" content={iconUrl} />
              <meta itemProp="width" content={rubric.iconMetadata.width.toString()} />
              <meta itemProp="height" content={rubric.iconMetadata.height.toString()} />
              <meta itemProp="name" content={iconAlt} />
            </div>
          </>
        )}
      </article>
    </Link>
  );
}

export default RubricCard;