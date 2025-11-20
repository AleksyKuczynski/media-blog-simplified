// src/app/fonts/fonts.ts
import { Dela_Gothic_One, Jost, Literata, Poiret_One } from 'next/font/google'

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