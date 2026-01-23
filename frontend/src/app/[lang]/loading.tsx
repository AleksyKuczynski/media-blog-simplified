// src/app/[lang]/loading.tsx

import { HomePageSkeleton } from './HomePageSkeleton';
import { getDictionary } from '@/config/i18n';
import { DEFAULT_LANG } from '@/config/constants/constants';

export default function Loading() {
  const dictionary = getDictionary(DEFAULT_LANG);
  
  return <HomePageSkeleton dictionary={dictionary} />;
}