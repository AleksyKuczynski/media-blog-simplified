// src/app/page.tsx - Root redirect handler
import { DEFAULT_LANG } from '@/config/constants/constants'
import { redirect } from 'next/navigation'

export default function RootPage() {
  // Redirect to default language (English)
  redirect(`/${DEFAULT_LANG}`)
}