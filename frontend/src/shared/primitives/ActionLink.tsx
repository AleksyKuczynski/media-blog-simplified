// features/shared/primitives/ActionLink.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'default';

interface ActionLinkProps {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}

const VARIANT_STYLES = {
  primary: 'text-on-pr hover:text-on-pr-var focus:text-on-pr-fix transition-colors duration-200',
  secondary: 'text-on-sec hover:text-on-sec-var focus:text-on-sec-fix transition-colors duration-200',
  tertiary: 'text-on-tr hover:text-on-tr-var focus:text-on-tr-fix transition-colors duration-200',
  default: 'text-on-sf-var hover:text-on-pr transition-colors duration-200',
} as const;

const BASE_STYLES = 'mt-4 font-medium transition-colors duration-200 flex justify-end items-end';
const INNER_STYLES = 'inline-flex items-center gap-2 group';

export function ActionLink({ 
  href, 
  children, 
  variant = 'default',
  className 
}: ActionLinkProps) {
  const content = (
    <>
      {children}
      <span 
        className="transform transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      >
        ▶
      </span>
    </>
  );

  return (
    <div className={cn(BASE_STYLES, className)}>
      {href ? (
        <Link 
          href={href}
          className={cn(INNER_STYLES, VARIANT_STYLES[variant], 'uppercase pr-4 md:pr-6 xl:pr-8')}
        >
          {content}
        </Link>
      ) : (
        <span className={cn(INNER_STYLES, VARIANT_STYLES[variant])}>
          {content}
        </span>
      )}
    </div>
  );
}