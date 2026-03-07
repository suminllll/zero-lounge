import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Header from './components/Header'
import ConditionalFooter from './components/ConditionalFooter'
import QueryProvider from './components/QueryProvider'

const suit = localFont({
  src: '../public/fonts/SUIT-Variable.ttf',
  display: 'swap',
  variable: '--font-suit',
})

const SITE_URL = 'https://zerolounge.kr'

export const metadata: Metadata = {
  title: 'ZERO LOUNGE | 혼자 오는 사람들을 위한 소셜링',
  description: '낯선 사람이 편한 사람이 되는 자리. 내향인을 위한 소셜 파티, ZERO LOUNGE.',
  keywords: [
    '소셜링',
    '내향인파티',
    '와인파티',
    '솔로파티',
    '제로파티',
    '제로라운지',
    '제로 라운지',
    'ZERO LOUNGE',
    '2030 모임',
    '혼술바',
    '서울 혼술바',
    '공덕 혼술바',
    '서울파티',
    '서울모임',
  ],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: 'ZERO LOUNGE | 대화형 소셜링',
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
    <html lang="ko" suppressHydrationWarning={true}>
      <body
        className={`${suit.className} antialiased m-0 p-0 min-h-screen relative`}
        suppressHydrationWarning={true}
      >
        {/* <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden md:left-1/2 md:-translate-x-1/2 md:max-w-[390px]">
          <Image
            src="/images/bgImgae.jpeg"
            alt="background"
            fill
            className="object-cover object-center"
            quality={85}
            sizes="390px"
            priority
          />
        </div> */}
        <QueryProvider>
          <div className="min-h-screen bg-white flex justify-center">
            <div className="relative w-full max-w-[390px] bg-secondary">
              <Header />
              <main>{children}</main>
              <ConditionalFooter />
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
