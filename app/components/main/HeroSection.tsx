import Image from 'next/image'

const HeroSection = () => {
  return (
    <section className="relative">
      <div className="relative">
        <Image
          src={'/images/heroSlide1.jpg'}
          alt={'hero side1'}
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="relative">
        <Image
          src={'/images/heroMain1.jpg'}
          alt={'heroMain'}
          width={1920}
          height={1080}
          className="w-full h-auto"
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <h1 className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-10 text-center text-primary font-bold text-xl md:text-4xl leading-8 md:leading-13">
        혼자 오는 사람들을 위한 라운지,
        <br />
        자연스럽게 대화가 시작되는 곳.
      </h1>
    </section>
  )
}

export default HeroSection
