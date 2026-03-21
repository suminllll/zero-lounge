import Image from 'next/image'
import { FaQuestion, FaExclamation } from 'react-icons/fa'

const VALUE_CARDS = [
  {
    title: '편안한 분위기',
    desc: '취하지 않아도 \n충분히 \n좋을 수 있는\n 저녁의 온도를 \n만듭니다.',
  },
  {
    title: '자연스러운 대화',
    desc: '억지로 분위기를 \n맞추지 않아도 \n이야기의 흐름이\n이어지도록 \n준비합니다.',
  },
  {
    title: '오래 남는 연결',
    desc: '스쳐 지나가는 \n만남보다\n천천히 기억에 남는\n관계를 지향합니다.',
  },
]

const HeroSection = () => {
  return (
    <section>
      {/* Part 1: 어두운 배경 (herobler) + 텍스트 오버레이 */}
      <div className="relative h-[500px] overflow-hidden bg-[#2a2220] flex flex-col items-center justify-center text-center">
        <Image
          src={'/images/herobler.png'}
          alt={'hero background'}
          fill
          className="object-cover object-center scale-110 blur-[5px]"
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 390px"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-[#C2B6AA] mt-10">
          <div className="w-10 h-10 rounded-full border-2 border-[#C2B6AA] flex items-center justify-center mx-auto mb-7 text-[#C2B6AA]">
            <FaQuestion size={16} />
          </div>
          <p className="font-bold text-2xl leading-9">
            만남이 필요할수록,
            <br />
            오히려 더 조심스러워질 때가 있죠.
          </p>
          <div className="w-px h-8 bg-white/50 mx-auto my-6" />
          <p className="text-2xl   leading-9 text-[#C2B6AA]">
            편하게 대화할 수 있는
            <br />
            자리를 찾기 쉽지 않으니까요.
          </p>
        </div>

        {/* 하단 페이드 */}
        {/* <div className="absolute bottom-0 left-0 w-full h-28 bg-linear-to-t from-[#f0e8e0] to-transparent" /> */}
      </div>

      {/* Part 2: 밝은 베이지 섹션 */}
      <div className="bg-[#9f8c78] text-[#362617] text-center px-8 pt-20 pb-20">
        <div className="w-10 h-10 rounded-full border-2 border-[#362617]/60 flex items-center justify-center mx-auto mb-5">
          <FaExclamation size={16} />
        </div>
        <p className="font-bold text-2xl mb-15">그래서 준비했습니다.</p>
        <p className="font-bold text-2xl leading-9">
          처음이어도 덜 어색하고,
          <br />
          자연스럽게 이야기가 이어지는
          <br />
          대화형 파티.
        </p>
      </div>

      {/* Part 3: heroMain1 사진 */}
      <div className="relative w-full h-[370px] md:h-[320px] bg-[#2a2220]">
        <Image
          src={'/images/heroMain1.jpg'}
          alt={'heroMain1'}
          fill
          className="object-cover md:object-contain object-center"
          quality={95}
          sizes="(max-width: 768px) 100vw, 390px"
        />
        <div className="absolute top-0 left-0 w-full h-30 bg-linear-to-b from-[#9f8c78] via-[#9f8c78]/70 to-transparent" />
      </div>

      {/* Part 4: 우리가 만들고 싶은 만남의 방식 */}
      <div className="bg-secondary px-3 py-14 text-[#9f8c78]">
        <p className="text-center font-bold text-2xl mb-8">우리가 만들고 싶은 만남의 방식</p>
        <div className="flex gap-3 text-center">
          {VALUE_CARDS.map(card => (
            <div
              key={card.title}
              className="flex-1 min-w-0 border border-primary/30 rounded-2xl px-1 py-5 flex flex-col gap-3"
            >
              <p className="font-bold text-sm whitespace-nowrap text-[#d7aa7b]">{card.title}</p>
              <p className="text-xs font-light leading-5 whitespace-pre-line text-[#9f8c78]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Part 5: heroSlide9 사진 */}
      <div className="relative w-full h-[370px] md:h-[468px] bg-[#2a2220] mt-10">
        <Image
          src={'/images/heroSlide9.png'}
          alt={'heroSlide9'}
          fill
          className="object-cover md:object-contain object-center"
          quality={95}
          sizes="(max-width: 768px) 100vw, 390px"
        />
      </div>
    </section>
  )
}

export default HeroSection
