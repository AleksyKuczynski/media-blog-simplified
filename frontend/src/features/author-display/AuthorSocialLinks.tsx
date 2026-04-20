// src/features/author-display/AuthorSocialLinks.tsx

import { Author } from '@/api/directus';
import { AuthorSocialLinkLabels } from '@/config/i18n/types';

type SocialField = keyof Pick<
  Author,
  'telegram_url' | 'behance_url' | 'personal_website_url' |
  'facebook_url' | 'instagram_url' | 'youtube_url' | 'twitter_url' | 'linkedin_url'
>;

interface SocialLinkConfig {
  field: SocialField;
  labelKey: keyof AuthorSocialLinkLabels;
  rel: string;
}

const SOCIAL_LINKS: SocialLinkConfig[] = [
  { field: 'telegram_url',          labelKey: 'telegram',         rel: 'noopener noreferrer me' },
  { field: 'behance_url',           labelKey: 'behance',          rel: 'noopener noreferrer me' },
  { field: 'personal_website_url',  labelKey: 'personalWebsite',  rel: 'noopener noreferrer me' },
  { field: 'facebook_url',          labelKey: 'facebook',         rel: 'noopener noreferrer me' },
  { field: 'instagram_url',         labelKey: 'instagram',        rel: 'noopener noreferrer me' },
  { field: 'youtube_url',           labelKey: 'youtube',          rel: 'noopener noreferrer me' },
  { field: 'twitter_url',           labelKey: 'twitter',          rel: 'noopener noreferrer me' },
  { field: 'linkedin_url',          labelKey: 'linkedin',         rel: 'noopener noreferrer me' },
];

interface AuthorSocialLinksProps {
  author: Pick<Author, SocialField>;
  labels: AuthorSocialLinkLabels;
  className?: string;
  linkClassName?: string;
}

export function AuthorSocialLinks({
  author,
  labels,
  className,
  linkClassName,
}: AuthorSocialLinksProps) {
  const activeLinks = SOCIAL_LINKS.filter(({ field }) => !!author[field]);
  if (activeLinks.length === 0) return null;

  return (
    <ul className={className} aria-label="Social profiles">
      {activeLinks.map(({ field, labelKey, rel }) => (
        <li key={field}>
          <a
            href={author[field] as string}
            rel={rel}
            target="_blank"
            className={linkClassName}
          >
            {labels[labelKey]}
          </a>
        </li>
      ))}
    </ul>
  );
}
