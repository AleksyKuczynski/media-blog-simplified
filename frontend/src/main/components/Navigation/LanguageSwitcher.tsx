// src/main/components/Navigation/LanguageSwitcher.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang } from '@/main/lib/dictionary'
import { resolveAlternateLanguageUrl } from '@/main/lib/actions/resolveAlternateLanguageUrl'

interface LanguageSwitcherProps {
  currentLang: Lang
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const [alternateUrl, setAlternateUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const alternateLang: Lang = currentLang === 'en' ? 'ru' : 'en'
  const label = currentLang === 'en' ? 'РУС' : 'EN'
  
  useEffect(() => {
    let mounted = true
    
    async function resolveUrl() {
      setIsLoading(true)
      const result = await resolveAlternateLanguageUrl(pathname, currentLang, alternateLang)
      
      if (mounted) {
        setAlternateUrl(result.url)
        setIsLoading(false)
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
  
  // Don't render if no alternate URL found or still loading
  if (isLoading) {
    return (
      <div className="px-3 py-1.5 text-sm text-on-sf-var/50">
        {label}
      </div>
    )
  }
  
  if (!alternateUrl) {
    return null
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