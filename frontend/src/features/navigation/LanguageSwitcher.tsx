// src/main/components/Navigation/LanguageSwitcher.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang } from '@/config/i18n'
import { resolveAlternateLanguageUrl } from '@/lib/actions/resolveAlternateLanguageUrl'

interface LanguageSwitcherProps {
  currentLang: Lang
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const [alternateUrl, setAlternateUrl] = useState<string>(`/${currentLang === 'en' ? 'ru' : 'en'}`)
  
  const alternateLang: Lang = currentLang === 'en' ? 'ru' : 'en'
  const label = currentLang === 'en' ? 'РУС' : 'EN'
  
  useEffect(() => {
    let mounted = true
    
    async function resolveUrl() {
      const url = await resolveAlternateLanguageUrl(pathname, currentLang, alternateLang)
      
      if (mounted) {
        setAlternateUrl(url)
      }
    }
    
    resolveUrl()
    
    return () => {
      mounted = false
    }
  }, [pathname, currentLang, alternateLang])
  
  const handleClick = () => {
    document.cookie = `preferred-language=${alternateLang}; path=/; max-age=31536000; SameSite=Lax`
  }

  return (
    <Link
      href={alternateUrl}
      onClick={handleClick}
      className="px-3 py-1.5 text-sm font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi rounded-full transition-all duration-200"
      aria-label={`Switch to ${alternateLang === 'en' ? 'English' : 'Russian'}`}
      lang={alternateLang}
    >
      {label}
    </Link>
  )
}