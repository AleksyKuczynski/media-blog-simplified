// src/features/layout/CollectionCount.tsx

import { cn } from '@/lib/utils';
import { processTemplate } from '@/config/i18n/helpers/templates';
import { Dictionary } from '@/config/i18n';

interface CollectionCountProps {
  count: number;
  countLabel: string;
  dictionary: Dictionary;
  className?: string;
}

export default function CollectionCount({
  count,
  countLabel,
  dictionary,
  className,
}: CollectionCountProps) {
  return (
    <div className={cn('text-sm text-on-sf-var', className)}>
      {processTemplate(dictionary.sections.templates.totalCount, {
        count: count.toString(),
        countLabel,
      })}
    </div>
  );
}