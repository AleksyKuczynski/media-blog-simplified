// src/features/author-display/AuthorSocialLinks.tsx

import { Author } from '@/api/directus';
import { AuthorSocialLinkLabels } from '@/config/i18n/types';

interface SocialLinkConfig {
  field: keyof Pick<Author, 'telegram_url' | 'behance_url'>;
  labelKey: keyof AuthorSocialLinkLabels;
  rel: string;
}

const SOCIAL_LINKS: SocialLinkConfig[] = [
  { field: 'telegram_url', labelKey: 'telegram', rel: 'noopener noreferrer me' },
  { field: 'behance_url', labelKey: 'behance', rel: 'noopener noreferrer me' },
  // To add more platforms: add the field to Author interface, fetch it, add dictionary entry, then add here
];

interface AuthorSocialLinksProps {
  author: Pick<Author, 'telegram_url' | 'behance_url'>;
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
