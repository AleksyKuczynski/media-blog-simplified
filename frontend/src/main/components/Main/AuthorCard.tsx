// src/main/components/Main/AuthorCard.tsx

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/main/lib/utils/utils';
import { DIRECTUS_URL, AuthorDetails } from '@/main/lib/directus/index';
import { Lang } from '@/main/lib/dictionary';

interface AuthorCardProps {
  author: AuthorDetails;
  linkToProfile?: boolean;
  lang: Lang;
}

// ✅ EXTRACT AUTHOR CARD STYLING INTO CONSTANTS
export const AUTHOR_CARD_STYLES = {
  // Container styling
  container: 'h-full relative overflow-hidden bg-sf-cont rounded-3xl shadow-sm hover:shadow-md dark:hover:shadow-[0px_0px_7px_5px_rgba(255,255,255,0.2)] transition-shadow duration-200 group',
  
  // Link wrapper (when linkToProfile is true)
  link: 'block h-full',
  
  // Grid layout
  grid: 'grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 p-6',
  
  // Avatar container
  avatarContainer: 'relative w-full aspect-square sm:row-span-1 rounded-2xl overflow-hidden',
  
  // Avatar image
  avatarImage: 'object-cover w-full h-full group-hover:scale-105 transition-transform duration-200',
  
  // Avatar fallback (when no image)
  avatarFallback: 'w-full h-full bg-gradient-to-br from-pr-cont to-pr-fix flex items-center justify-center',
  avatarFallbackText: 'text-on-pr-cont text-4xl font-bold',
  
  // Author name
  name: 'font-bold text-lg sm:text-xl transition-colors duration-600 self-end text-on-sf hover:text-pr-cont',
  
  // Bio text
  bio: 'text-on-sf-var sm:col-span-2 transition-colors duration-600 line-clamp-5 text-sm sm:text-base',
} as const;

// ✅ SKELETON STYLES - Derived from AuthorCard constants
export const AUTHOR_CARD_SKELETON_STYLES = {
  // Inherit base structure
  container: cn(AUTHOR_CARD_STYLES.container, 'animate-pulse'),
  grid: AUTHOR_CARD_STYLES.grid,
  
  // Skeleton-specific elements
  avatar: cn(AUTHOR_CARD_STYLES.avatarContainer, 'bg-sf-hi'),
  name: 'h-6 bg-on-sf/10 rounded self-end',
  nameSecond: 'h-6 w-3/4 bg-on-sf/10 rounded',
  bio: 'h-4 bg-on-sf/10 rounded',
} as const;

// ✅ UPDATED: AuthorCard using extracted constants
export default function AuthorCard({ author, linkToProfile = true, lang }: AuthorCardProps) {
  const CardContent = () => (
    <div className={AUTHOR_CARD_STYLES.container}>
      <div className={AUTHOR_CARD_STYLES.grid}>
        {/* Avatar Section */}
        <div className={AUTHOR_CARD_STYLES.avatarContainer}>
          {author.avatar ? (
            <Image
              src={`${DIRECTUS_URL}/assets/${author.avatar}?width=400&height=400&quality=80&format=webp`}
              alt={author.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={AUTHOR_CARD_STYLES.avatarImage}
            />
          ) : (
            <div className={AUTHOR_CARD_STYLES.avatarFallback}>
              <span className={AUTHOR_CARD_STYLES.avatarFallbackText}>
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        {/* Author Name */}
        <h3 className={AUTHOR_CARD_STYLES.name}>
          {author.name}
        </h3>
        
        {/* Bio */}
        {author.bio && (
          <p className={AUTHOR_CARD_STYLES.bio}>
            {author.bio}
          </p>
        )}
      </div>
    </div>
  );

  if (linkToProfile) {
    return (
      <Link href={`/${lang}/authors/${author.slug}`} className={AUTHOR_CARD_STYLES.link}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
}