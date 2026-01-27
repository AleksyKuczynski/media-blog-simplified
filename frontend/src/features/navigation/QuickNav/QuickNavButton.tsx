// frontend/src/features/navigation/QuickNav/QuickNavButton.tsx
import Link from 'next/link';
import Image from 'next/image';
import { QUICK_NAV_STYLES } from '../navigation.styles';
import { getNavImageSrc } from '../Header/utils/navLinks.utils';

type NavType = 'home' | 'articles' | 'rubrics' | 'authors';

interface QuickNavButtonProps {
  type: NavType;
  href: string;
  label: string;
  ariaLabel: string;
}

export default function QuickNavButton({
  type,
  href,
  label,
  ariaLabel,
}: QuickNavButtonProps) {
  const imageSrc = getNavImageSrc(type);

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
          className="object-contain"
          sizes="(max-width: 768px) 64px, (max-width: 1280px) 80px, 96px"
        />
      </div>
      {label}
    </Link>
  );
}