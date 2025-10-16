// src/app/page.tsx - Root redirect to Russian version
import { DEFAULT_LANG } from '@/main/lib/constants'
import { redirect } from 'next/navigation'

export default function RootPage() {
  // ✅ AUTOMATIC REDIRECT: Always redirect to Russian version
  redirect(DEFAULT_LANG)
}