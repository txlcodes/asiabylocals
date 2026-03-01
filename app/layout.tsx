import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.asiabylocals.com'),
  title: 'AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia | Expert Local Guides',
  description:
    'Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more. Expert-led cultural experiences, food tours, heritage walks, and immersive travel adventures.',
  keywords:
    'Asia tours, local guides Asia, cultural experiences Asia, authentic travel Asia, Asia travel, local tours Asia, India tours, Japan tours, Thailand tours, Vietnam tours, Indonesia tours, Singapore tours, Malaysia tours, Philippines tours, Cambodia tours, Myanmar tours, Sri Lanka tours, Nepal tours, Bangladesh tours, cultural tours Asia, food tours Asia, heritage tours Asia, immersive travel Asia, expert local guides Asia',
  authors: [{ name: 'AsiaByLocals' }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  other: {
    'language': 'en',
    'revisit-after': '7 days',
    'distribution': 'global',
    'rating': 'general',
    'geo.region': 'AS',
    'geo.placename': 'Asia',
    'ICBM': '35.0, 105.0',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'AsiaByLocals',
  },
  themeColor: '#10B981',
  openGraph: {
    type: 'website',
    url: 'https://www.asiabylocals.com/',
    title: 'AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia',
    description:
      'Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more.',
    images: [
      {
        url: 'https://www.asiabylocals.com/favicon-96x96-v7.png',
        width: 1200,
        height: 630,
        alt: 'AsiaByLocals - Authentic Travel Experiences in Asia',
      },
    ],
    siteName: 'AsiaByLocals',
    locale: 'en_US',
    alternateLocale: ['en_GB'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia',
    description:
      'Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more.',
    images: [
      {
        url: 'https://www.asiabylocals.com/favicon-96x96-v7.png',
        alt: 'AsiaByLocals - Authentic Travel Experiences',
      },
    ],
    creator: '@asiabylocals',
    site: '@asiabylocals',
  },
  icons: {
    icon: [
      { url: '/favicon-96x96-v7.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-v7.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-v7.ico',
    apple: [{ url: '/apple-touch-icon-v7.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest?v=7',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'AsiaByLocals',
  description:
    'Authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, Singapore, Malaysia, Philippines, Cambodia, Myanmar, Sri Lanka, Nepal, and Bangladesh.',
  url: 'https://www.asiabylocals.com',
  logo: 'https://www.asiabylocals.com/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SG',
  },
  areaServed: [
    { '@type': 'Country', name: 'India' },
    { '@type': 'Country', name: 'Japan' },
    { '@type': 'Country', name: 'Thailand' },
    { '@type': 'Country', name: 'Vietnam' },
    { '@type': 'Country', name: 'Indonesia' },
    { '@type': 'Country', name: 'Singapore' },
    { '@type': 'Country', name: 'Malaysia' },
    { '@type': 'Country', name: 'Philippines' },
    { '@type': 'Country', name: 'Cambodia' },
    { '@type': 'Country', name: 'Myanmar' },
    { '@type': 'Country', name: 'Sri Lanka' },
    { '@type': 'Country', name: 'Nepal' },
    { '@type': 'Country', name: 'Bangladesh' },
  ],
  sameAs: [
    'https://www.facebook.com/asiabylocals',
    'https://www.instagram.com/asiabylocals',
    'https://twitter.com/asiabylocals',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" itemScope itemType="https://schema.org/TravelAgency">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <div id="app-root">
          {children}
        </div>
      </body>
    </html>
  )
}
