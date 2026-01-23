// src/app/[lang]/(collections)/rubrics/loading.tsx

import { RubricsPageSkeleton } from '@/features/rubric-display/RubricsPageSkeleton';
import { getDictionary } from '@/config/i18n';
import { DEFAULT_LANG } from '@/config/constants/constants';

export default function Loading() {
  const dictionary = getDictionary(DEFAULT_LANG);
  
  return (
    <RubricsPageSkeleton ariaLabel={dictionary.common.status.loading} />
  );
}