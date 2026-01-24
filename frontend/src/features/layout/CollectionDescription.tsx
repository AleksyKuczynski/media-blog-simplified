// src/features/layout/CollectionDescription.tsx

import { cn } from '@/lib/utils';
import { COLLECTION_DESCRIPTION_STYLES } from './layout.styles';

interface CollectionDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export default function CollectionDescription({ 
  children, 
  className 
}: CollectionDescriptionProps) {
  return (
    <p className={cn(
      COLLECTION_DESCRIPTION_STYLES,
      className
    )}>
      {children}
    </p>
  );
}