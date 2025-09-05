// src/main/components/Main/RubricCard.tsx - Enhanced with nav_icon support
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
          flex flex-col items-center text-center
        "
        itemScope 
        itemType="https://schema.org/Article"
      >
        {/* ✅ NEW: Icon Display Section */}
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
                // ✅ SEO: Structured data for icon
                itemProp="image"
              />
            </div>
          </header>
        )}

        {/* Enhanced heading with semantic markup */}
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
        
        {/* Article count with proper Russian text and semantic meaning */}
        <footer 
          className="text-sm text-on-sf-var mt-auto"
          aria-label={`В рубрике ${rubric.name} ${articleCountText}`}
        >
          <span itemProp="articleBody">
            {articleCountText}
          </span>
        </footer>
        
        {/* ✅ SEO: Enhanced Schema.org metadata */}
        <meta itemProp="url" content={`https://event4me.eu/ru/${rubric.slug}`} />
        <meta itemProp="inLanguage" content="ru" />
        <meta itemProp="articleSection" content={rubric.name} />
        <meta itemProp="publisher" content="EventForMe" />
        
        {/* ✅ SEO: Icon metadata for structured data */}
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