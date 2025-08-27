// src/main/components/Main/AuthorCard.tsx - SIMPLIFIED
import Image from 'next/image';
import Link from 'next/link';
import { DIRECTUS_URL, AuthorDetails } from '@/main/lib/directus/index';
import { Lang } from '@/main/lib/dictionaries/dictionariesTypes';

interface AuthorCardProps {
  author: AuthorDetails;
  linkToProfile?: boolean;
  lang: Lang;
}

// Direct rounded theme styling - no more complex theme system
export default function AuthorCard({ author, linkToProfile = true, lang }: AuthorCardProps) {
  const containerClasses = `
    h-full  
    relative 
    overflow-hidden
    bg-bgcolor-alt 
    rounded-3xl
    shadow-sm
    hover:shadow-md
    dark:hover:shadow-[0px_0px_7px_5px_rgba(255,255,255,0.2)]
    transition-shadow
    duration-200
    group
  `;

  const gridContainerClasses = `
    grid
    grid-cols-1
    sm:grid-cols-2
    sm:grid-rows-2
    gap-4
    p-6
  `;

  const imageWrapperClasses = `
    relative 
    w-full
    aspect-square
    sm:row-span-1
    rounded-2xl
    overflow-hidden
  `;

  const nameClasses = `
    font-bold
    text-lg 
    sm:text-xl
    transition-colors
    duration-600
    self-end
  `;

  const bioClasses = `
    text-txcolor-secondary
    sm:col-span-2
    transition-colors 
    duration-600
    line-clamp-5
    text-sm 
    sm:text-base
  `;

  const imageClasses = `
    object-cover 
    w-full h-full
    group-hover:scale-105
    transition-transform
    duration-200
  `;

  const CardContent = () => (
    <div className={containerClasses}>
      <div className={gridContainerClasses}>
        <div className={imageWrapperClasses}>
          {author.avatar ? (
            <Image
              src={`${DIRECTUS_URL}/assets/${author.avatar.id}?width=400&height=400&quality=80&format=webp`}
              alt={author.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={imageClasses}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <h3 className={nameClasses}>
          {author.name}
        </h3>
        
        {author.bio && (
          <p className={bioClasses}>
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );

  if (linkToProfile) {
    return (
      <Link 
        href={`/ru/authors/${author.slug}`} 
        className="block h-full"
      >
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}