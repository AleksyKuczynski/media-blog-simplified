// src/main/components/ArticleCards/AdvertisingCard.tsx - CLEANED UP
import Link from 'next/link';
import { AdvertisingCardProps } from './interfaces';

export function AdvertisingCard({ article, articleLink, dict }: AdvertisingCardProps) {
  const translation = article.translations[0];

  return (
    <article className="
      bg-gradient-to-br from-pr-cont to-pr-fix
      text-on-pr-cont p-6 rounded-2xl
      shadow-lg hover:shadow-xl
      transition-all duration-200
      transform hover:scale-105
    ">
      <Link href={articleLink} className="block h-full">
        <div className="flex flex-col h-full">
          <h2 className="
            text-xl font-bold mb-3
            text-on-pr-cont
          ">
            {translation.title}
          </h2>
          
          {translation.description && (
            <p className="
              text-sm mb-4 flex-grow
              text-on-pr-cont/90
              line-clamp-4
            ">
              {translation.description}
            </p>
          )}
          
          <div className="mt-auto">
            <span className="
              text-sm font-semibold
              bg-on-pr-cont text-pr-cont
              px-3 py-1 rounded-full
              hover:bg-on-pr-cont/90
              transition-colors duration-200
            ">
              {dict.common.readMore}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}