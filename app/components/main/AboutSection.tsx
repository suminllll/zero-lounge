import GallerySliderWrapper from './GallerySliderWrapper'
import SocialButtons from './SocialButtons'
import PartyCards from './PartyCards'
import IntroSection from './sections/IntroSection'
import WhoSection from './sections/WhoSection'
import NoticeSection from './sections/NoticeSection'
import ReviewSection from './sections/ReviewSection'
import QnaSection from './sections/QnaSection'

interface AboutSectionProps {
  showWine: boolean
}

const AboutSection = ({ showWine }: AboutSectionProps) => {
  return (
    <section className="pt-30 pb-10 flex flex-col gap-20">
      <IntroSection />

      <div>
        {showWine && (
          <div className="w-full flex flex-col items-center justify-center mt-25">
            <p className="mb-10 text-2xl">{'< 대화형 파티 종류 >'}</p>
            <PartyCards />
          </div>
        )}
      </div>

      <WhoSection />

      <NoticeSection showWine={showWine} />

      <ReviewSection />

      <GallerySliderWrapper />

      <div id="party-cards" className="w-full flex justify-center ">
        <PartyCards showWine={showWine} />
      </div>
      <QnaSection />

      <p className="text-center text-xl font-bold leading-snug">우리, 곧 만나요.</p>

      <div className="flex justify-center items-center flex-col mt-25">
        <SocialButtons />
      </div>
    </section>
  )
}

export default AboutSection
