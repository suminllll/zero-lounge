import Image from 'next/image'
import Link from 'next/link'

export default function PartyCards() {
  return (
    <div className="relative z-10 w-[90%] max-w-4xl flex flex-col gap-5 ">
      <Link href="/party/introvert" className="glass-card-v2 p-5 cursor-pointer group">
        <div className="transition-transform duration-300 group-hover:scale-105">
          <Image
            src={'/images/cocktail1.jpeg'}
            alt={'내향인 파티 신청하기'}
            width={30}
            height={10}
            className="w-full h-auto rounded-2xl"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="flex flex-col justify-between gap-4 py-6 text-secondary font-bold px-3">
            <p className="text-lg font-bold">내향인 파티 신청하기</p>
            <p className="mt-1.5 text-sm/5 text-secondary/82 font-normal">
              말차 하이볼 / 레몬 하이볼 <br /> 소주 / 맥주 / 논알콜
            </p>
          </div>
        </div>
      </Link>
      <Link href="/party/wine" className="glass-card-v2 p-5 cursor-pointer group">
        <div className="transition-transform duration-300 group-hover:scale-105">
          <Image
            src={'/images/wine.jpeg'}
            alt={'와인 파티'}
            width={30}
            height={10}
            className="w-full h-auto rounded-2xl"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="flex flex-col justify-between gap-4 py-6 text-[#362617] font-bold px-3">
            <div className="text-lg font-bold">
              와인 파티 신청하기<span className="text-xs">(3/14 화이트데이 한정) </span>
            </div>{' '}
            <p className="mt-1.5 text-sm/6 text-[#362617]/82 font-normal">
              레드와인 / 화이트 와인 / 논알콜
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
