// src/app/fonts/fonts.ts
import { Jost, Literata, Unbounded } from 'next/font/google'

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

export const fontDisplay = Unbounded({
  subsets: ['latin', 'cyrillic'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-display',
})