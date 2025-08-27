// src/main/components/ArticleCards/NewsCard.tsx - CLEANED UP
import Link from 'next/link';
import { NewsCardProps } from './interfaces';

export function NewsCard({ article, formattedDate, articleLink, dict }: NewsCardProps) {
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
            {dict.common.readMore}
          </span>
        </div>
      </Link>
    </article>
  );
}