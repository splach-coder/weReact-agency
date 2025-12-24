import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const nohemi = localFont({
  src: [
    {
      path: '../../public/fonts/Nohemi-Thin-BF6438cc5896c67.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-ExtraLight-BF6438cc58a2634.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-Regular-BF6438cc4d0e493.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-Medium-BF6438cc5883899.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-Bold-BF6438cc587b5b5.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-ExtraBold-BF6438cc5881baf.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Nohemi-Black-BF6438cc58744d4.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-nohemi',
  display: 'swap',
})