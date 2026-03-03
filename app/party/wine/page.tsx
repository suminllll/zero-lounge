import Image from 'next/image'
import Link from 'next/link'
import { IoChevronBack } from 'react-icons/io5'

export default function WinePartyPage() {
  return (
    <main className="bg-secondary min-h-screen text-primary">
      {/* 헤더 */}
      <div className="relative w-full h-[45vh]">
        <Image
          src="/images/wine.jpeg"
          alt="와인 파티"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <Link href="/" className="absolute top-4 left-4 text-white z-10 p-1">
          <IoChevronBack size={28} />
        </Link>
        <div className="absolute bottom-6 left-5 z-10">
          <h1 className="text-2xl font-bold text-white">와인 파티</h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-secondary to-transparent" />
      </div>

      {/* 내용 */}
      <div className="px-5 py-10 flex flex-col gap-8">
        <div className="pt-8 flex flex-col gap-6 text-[#c6beb8] text-[15px] leading-7 font-light">
          <p>
            와인과 함께 대화가 깊어지는 소셜링이에요.
            <br />
            편안한 분위기에서 새로운 사람들과 이야기해요.
          </p>
          <p>
            혼자 오셔도 괜찮아요.
            <br />
            90% 이상의 게스트 분들이 혼자 방문해요.
          </p>
        </div>

        <div className="bg-secondary rounded-3xl py-8 flex flex-col gap-6 text-primary">
          <div>
            <p className="font-bold text-base">제공 메뉴</p>
            <p className="text-sm mt-1 font-light leading-6">
              훈제 오리고기
              <br />
              떡볶이
              <br />
              소불고기 볶음밥
              <br />
              유자 샐러드
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-base">제공 주류</p>
            <p className="text-sm mt-1 font-light">
              레드와인 / 화이트 와인
              <br />
              소주 / 맥주 무제한
              <br />
              (논알콜도 준비되어 있어요.)
            </p>
          </div>
        </div>
      </div>

      {/* 참가신청 버튼 */}
      <div className="px-5 pb-10">
        <a
          href="/apply"
          className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] tracking-wide"
          style={{ backgroundColor: '#c6beb8' }}
        >
          소셜링 신청하기
        </a>
      </div>
    </main>
  )
}
