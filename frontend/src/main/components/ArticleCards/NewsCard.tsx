// src/main/components/ArticleCards/NewsCard.tsx
// MIGRATED: Uses new dictionary system
import Link from 'next/link';
import { NewsCardProps } from './interfaces';

/**
 * NewsCard - MIGRATED to use dictionary.common instead of dict.common
 */
export function NewsCard({ 
  article, 
  formattedDate, 
  articleLink, 
  dictionary // MIGRATED: Now uses full dictionary
}: NewsCardProps) {
  const translation = article.translations[0];

  return (
    <article className="
      bg-sf-cont p-4
      shadow-sm rounded-2xl
      hover:shadow-md transition-shadow duration-200
    ">
      <Link href={articleLink} className="block h-full">
        <h2 className="
          text-lg mb-2 font-display
          text-on-sf hover:text-pr-cont transition-colors duration-200
        ">
          {translation.title}
        </h2>
        
        <p className="text-xs mb-2 text-on-sf-var">
          {formattedDate}
        </p>
        
        <p className="line-clamp-3 text-sm text-on-sf-var mb-3">
          {translation.description}
        </p>
        
        <div>
          <span className="
            text-xs font-semibold
            text-pr-cont hover:text-pr-fix
            transition-colors duration-200
          ">
            {dictionary.common.readMore} {/* MIGRATED: Use dictionary.common */}
          </span>
        </div>
      </Link>
    </article>
  );
}