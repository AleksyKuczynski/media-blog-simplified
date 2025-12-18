// src/api/directus/fetchCategoriesForArticle.ts

import { Category, DIRECTUS_URL } from "./index";
import { Lang } from "@/config/i18n";

export async function fetchCategoriesForArticle(slug: string, lang: Lang): Promise<Category[]> {
    try {
        const junctionUrl = `${DIRECTUS_URL}/items/articles_categories?filter[articles_slug][_eq]=${slug}&fields=categories_slug`;
        const junctionResponse = await fetch(junctionUrl);
        
        if (!junctionResponse.ok) {
            throw new Error(`Failed to fetch article-category relations. Status: ${junctionResponse.status}`);
        }

        const junctionData = await junctionResponse.json();
        const categorySlugs = junctionData.data.map((item: any) => item.categories_slug);

        const categoriesPromises = categorySlugs.map(async (categorySlug: string) => {
            const categoryUrl = `${DIRECTUS_URL}/items/categories/${categorySlug}?fields=slug`;
            const translationUrl = `${DIRECTUS_URL}/items/categories_translations?filter[categories_slug][_eq]=${categorySlug}&filter[languages_code][_eq]=${lang}&fields=name`;

            const [categoryResponse, translationResponse] = await Promise.all([
                fetch(categoryUrl),
                fetch(translationUrl)
            ]);

            if (!categoryResponse.ok || !translationResponse.ok) {
                throw new Error(`Failed to fetch category data or translation. Status: ${categoryResponse.status}, ${translationResponse.status}`);
            }

            const categoryData = await categoryResponse.json();
            const translationData = await translationResponse.json();

            const category: Category = {
                slug: categoryData.data.slug,
                name: translationData.data[0]?.name || categoryData.data.slug // Fallback to slug if translation is not available
            };

            return category;
        });

        const categories = await Promise.all(categoriesPromises);
        return categories;
    } catch (error) {
        return [];
    }
}