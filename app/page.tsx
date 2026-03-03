import Link from 'next/link'
import AboutSection from './components/main/AboutSection'
import HeroSection from './components/main/HeroSection'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <AboutSection />
      <Link
        href="/apply"
        className="fixed bottom-6 w-[90%] left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full font-bold text-secondary text-[17px] text-center shadow-lg whitespace-nowrap"
        style={{ backgroundColor: '#c6beb8' }}
      >
        소셜링 신청하기
      </Link>
    </div>
  )
}
