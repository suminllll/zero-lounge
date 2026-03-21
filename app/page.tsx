import Link from 'next/link'
import AboutSection from './components/main/AboutSection'
import HeroSection from './components/main/HeroSection'
import ScheduleButton from './components/main/ScheduleButton'
import { supabase, type PartySetting } from '@/lib/supabase'

export default async function Home() {
  const { data } = await supabase.from('party_settings').select('*')
  const settings = ((data as PartySetting[]) ?? []).reduce<Record<string, boolean>>(
    (acc, s) => ({ ...acc, [s.party_type]: s.is_visible }),
    {}
  )
  const showWine = settings['wine'] !== false

  return (
    <div className="relative text-primary">
      <HeroSection />
      <div className="bg-secondary px-6 pt-15 text-center">
        <Link
          id="main_1_btn"
          href="/apply"
          className="apply-btn flex items-center justify-between w-full py-4 px-6 rounded-[80px] font-bold text-secondary text-base"
          style={{ backgroundColor: '#c6beb8' }}
        >
          <span />
          <span>모임 일정 보러가기</span>
          <span className="apply-btn-arrow">&gt;</span>
        </Link>
      </div>
      <AboutSection showWine={showWine} />
      <ScheduleButton showWine={showWine} />
    </div>
  )
}
