import Image from 'next/image'
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
    <div className="relative text-secondary">
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/bgImgae.jpeg"
          alt="background"
          fill
          className="object-cover object-center"
          quality={85}
          sizes="390px"
          priority
        />
      </div>
      <HeroSection />
      <AboutSection showWine={showWine} />
      <ScheduleButton showWine={showWine} />
    </div>
  )
}
