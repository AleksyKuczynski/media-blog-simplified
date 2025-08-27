// src/main/components/Main/SeoBreadcrumbs.tsx
import { headers } from 'next/headers'

interface SeoBreadcrumbsProps {
  articleSlug: string;
  rubricSlug: string;
  title: string;
  // ✅ REMOVED: lang parameter - no longer needed with static Russian URLs
}

export async function SeoBreadcrumbs({ articleSlug, rubricSlug, title }: SeoBreadcrumbsProps) {
  const headersList = headers()
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
        "item": `${baseUrl}/ru` // ✅ HARDCODED: Static Russian URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Rubrics",
        "item": `${baseUrl}/ru/rubrics` // ✅ HARDCODED: Static Russian URL
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": rubricSlug,
        "item": `${baseUrl}/ru/${rubricSlug}` // ✅ HARDCODED: Static Russian URL
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": `${baseUrl}/ru/${rubricSlug}/${articleSlug}` // ✅ HARDCODED: Static Russian URL
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