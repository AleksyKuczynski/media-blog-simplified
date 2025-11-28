// src/main/lib/actions/getArticleCardData.ts
'use server'

import { Lang } from "@/config/i18n";
import { fetchArticleCard } from "@/api/directus";


export async function getArticleCardData(slug: string, lang: Lang) {
  return await fetchArticleCard(slug, lang);
}
