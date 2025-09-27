// src/main/components/Main/SeoBreadcrumbs.tsx
// FIXED: Updated for Next.js 15 - headers() is now async
import { headers } from 'next/headers'

interface SeoBreadcrumbsProps {
  articleSlug: string;
  rubricSlug: string;
  title: string;
}

export async function SeoBreadcrumbs({ articleSlug, rubricSlug, title }: SeoBreadcrumbsProps) {
  // ✅ FIXED: Added await for headers() - required in Next.js 15
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/ru`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Rubrics", 
        "item": `${baseUrl}/ru/rubrics`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": rubricSlug,
        "item": `${baseUrl}/ru/${rubricSlug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": `${baseUrl}/ru/${rubricSlug}/${articleSlug}`
      }
    ]
  }

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
    />
  )
}