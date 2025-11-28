// src/main/lib/utils/generateArticleLinkAsync.ts
import { Lang } from "../../config/i18n";
import { fetchRubricSlug, fetchLocalSlug } from "@/api/directus";

export async function generateArticleLinkAsync(
  articleSlug: string, 
  lang: Lang,
  authorSlug?: string
): Promise<string> {
  const [rubricSlug, localSlug] = await Promise.all([
    fetchRubricSlug(articleSlug),
    fetchLocalSlug(articleSlug, lang)
  ]);

  if (!rubricSlug) {
    console.error(`Unable to generate link for article: ${articleSlug}`);
    return `/${lang}`; // Fallback to home page
  }

  // Use local_slug if available, otherwise main slug
  const displaySlug = localSlug || articleSlug;
  const basePath = `/${lang}/${rubricSlug}/${displaySlug}`;
  
  if (authorSlug) {
    return `${basePath}?context=author&author=${authorSlug}`;
  }

  return basePath;
}