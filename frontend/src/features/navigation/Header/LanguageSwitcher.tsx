// features/navigation/Header/LanguageSwitcher.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Lang } from '@/config/i18n'
import { 
  getAlternateLang, 
  getLanguageLabel, 
  getFallbackUrl,
  setLanguagePreferenceCookie,
  getLanguageSwitchAriaLabel
} from './utils/languageSwitcher.utils'
import { useAlternateLanguageUrl } from './utils/useAlternateLanguageUrl'

interface LanguageSwitcherProps {
  currentLang: Lang
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const alternateLang = getAlternateLang(currentLang)
  const label = getLanguageLabel(currentLang)
  const fallbackUrl = getFallbackUrl(currentLang)
  
  const alternateUrl = useAlternateLanguageUrl(
    pathname, 
    currentLang, 
    alternateLang, 
    fallbackUrl
  )
  
  const handleClick = () => {
    setLanguagePreferenceCookie(alternateLang)
  }

  return (
    <Link
      href={alternateUrl}
      onClick={handleClick}
      className="px-3 py-1.5 text-sm font-medium text-on-sf-var hover:text-on-sf hover:bg-sf-hi rounded-full transition-all duration-200"
      aria-label={getLanguageSwitchAriaLabel(alternateLang)}
      lang={alternateLang}
    >
      {label}
    </Link>
  )
}