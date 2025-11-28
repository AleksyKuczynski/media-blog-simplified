// src/main/lib/actions/getArticleCardData.ts
'use server'

import { Lang } from "@/main/lib/dictionary";
import { fetchArticleCard } from "@/main/lib/directus";


export async function getArticleCardData(slug: string, lang: Lang) {
  return await fetchArticleCard(slug, lang);
}
