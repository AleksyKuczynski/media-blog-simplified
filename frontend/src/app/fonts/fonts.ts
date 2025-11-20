// src/app/fonts/fonts.ts
import { Alegreya, Alice, Andika, Bona_Nova, Bona_Nova_SC, Days_One, Dela_Gothic_One, Gentium_Book_Plus, Gentium_Plus, Jost, Literata, Orelega_One, Poiret_One, Prosto_One, Russo_One, Seymour_One, Unbounded, Vollkorn, Yeseva_One } from 'next/font/google'

export const fontSans = Jost({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: 'variable',
  variable: '--font-sans',
})

export const fontSerif = Literata({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  weight: 'variable',
  variable: '--font-serif',
})

export const fontDisplay = Poiret_One({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
})

export const fontCustom = Dela_Gothic_One({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  display: 'swap',
  variable: '--font-custom',
})