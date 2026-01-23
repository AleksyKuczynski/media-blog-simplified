// frontend/src/features/navigation/QuickNavButton.tsx
import Link from 'next/link';
import Image from 'next/image';
import { QUICK_NAV_STYLES } from '../styles';

type NavType = 'articles' | 'rubrics' | 'authors';

interface QuickNavButtonProps {
  type: NavType;
  href: string;
  label: string;
  ariaLabel: string;
}

const IMAGE_MAP: Record<NavType, string> = {
  articles: '/articles.png',
  rubrics: '/rubrics.png',
  authors: '/authors.png',
};

export default function QuickNavButton({
  type,
  href,
  label,
  ariaLabel,
}: QuickNavButtonProps) {
  const imageSrc = IMAGE_MAP[type];

  return (
    <Link 
      href={href}
      className={QUICK_NAV_STYLES.link}
      aria-label={ariaLabel}
    >
      <div className={QUICK_NAV_STYLES.icon}>
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 64px, (max-width: 1280px) 80px, 96px"
        />
      </div>
      {label}
    </Link>
  );
}