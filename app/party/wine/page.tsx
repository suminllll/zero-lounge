import Image from 'next/image'
import PartyApplyButton from '@/app/components/party/PartyApplyButton'

export default function WinePartyPage() {
  return (
    <main className="min-h-screen relative text-primary">
      {/* 헤더 이미지 */}
      <div className="relative w-full h-[45vh] bg-[#2a2220]">
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
        <div className="absolute bottom-6 left-5 z-10">
          <h1 className="text-2xl font-bold text-white">와인 파티</h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-secondary to-transparent" />
      </div>

      {/* 내용 */}
      <div className="px-5 py-10 flex flex-col gap-8">
        <div className="pt-8 flex flex-col gap-6 text-sm leading-7 ">
          <p>
            와인과 함께 하는 대화형 소셜링이에요.
            <br />
            편안한 분위기에서 다양한 사람들과 이야기해요.
          </p>
          <p>
            혼자 오셔도 괜찮아요.
            <br />
            90% 이상의 게스트 분들이 혼자 방문해요.
          </p>
        </div>

        <div className="border border-primary/30 rounded-3xl py-8 flex flex-col gap-8 text-center">
          <div>
            <p className="font-bold ">제공 메뉴</p>
            <p className="text-sm mt-1  leading-6">
              과일 플래터
              <br />
              치즈 플래터
              <br />
              유자 샐러드
              <br />
              핑거푸드
            </p>
          </div>
          <div>
            <p className="font-bold text-base">제공 주류</p>
            <p className="text-sm mt-1 ">레드와인 / 화이트 와인 / 논알콜 무제한 제공</p>
          </div>

          <div>
            <p className="font-bold text-base">참가비</p>
            <p className="text-sm mt-1  leading-6">49,000원</p>
          </div>
        </div>
      </div>

      {/* 참가신청 버튼 */}
      <PartyApplyButton href="/apply?party=wine" />
    </main>
  )
}
