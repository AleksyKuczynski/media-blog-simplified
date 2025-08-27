// src/app/page.tsx - Root redirect to Russian version
import { redirect } from 'next/navigation'

export default function RootPage() {
  // ✅ AUTOMATIC REDIRECT: Always redirect to Russian version
  redirect('/ru')
}