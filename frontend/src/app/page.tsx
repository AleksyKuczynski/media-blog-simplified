// src/app/page.tsx
import { DEFAULT_LANG } from '@/config/constants/constants'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/config/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = getDictionary(DEFAULT_LANG)
  
  return {
    title: dictionary.seo.site.name,
    description: dictionary.seo.site.description,
    alternates: {
      canonical: `/${DEFAULT_LANG}`,
      languages: {
        'en': '/en',
        'ru': '/ru',
      }
    },
  }
}

export default function RootPage() {
  redirect(`/${DEFAULT_LANG}`)
}