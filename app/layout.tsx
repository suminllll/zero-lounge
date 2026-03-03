import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import QueryProvider from './components/QueryProvider'

const suit = localFont({
  src: '../public/fonts/SUIT-Variable.ttf',
  display: 'swap',
  variable: '--font-suit',
})

const SITE_URL = 'https://zero-lounge.vercel.app' // 배포 후 실제 도메인으로 교체

export const metadata: Metadata = {
  title: 'ZERO LOUNGE | 혼자 오는 사람들을 위한 소셜링',
  description:
    '낯선 사람이 편한 사람이 되는 자리. 내향인을 위한 소셜 파티, ZERO LOUNGE. 공덕·애오개 사이에서 매주 열리는 대화 중심 소셜링.',
  keywords: ['소셜링', '내향인 파티', '와인 파티', '혼자 술자리', '공덕 소셜링', '제로라운지', 'ZERO LOUNGE', '2030 모임'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'ZERO LOUNGE | 혼자 와도 괜찮아요',
    description: '낯선 사람이 편한 사람이 되는 자리. 내향인을 위한 소셜 파티.',
    url: SITE_URL,
    siteName: 'ZERO LOUNGE',
    images: [
      {
        url: '/images/heroSlide1.jpg',
        width: 1200,
        height: 630,
        alt: 'ZERO LOUNGE 소셜링',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZERO LOUNGE | 혼자 와도 괜찮아요',
    description: '낯선 사람이 편한 사람이 되는 자리. 내향인을 위한 소셜 파티.',
    images: ['/images/heroSlide1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${suit.className} antialiased m-0 p-0 min-h-screen relative`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  )
}
