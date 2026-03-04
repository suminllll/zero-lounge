import Image from 'next/image'

export default function IntrovertPartyPage() {
  return (
    <main className="bg-secondary min-h-screen text-primary">
      {/* 헤더 이미지 */}
      <div className="relative w-full h-[45vh]">
        <Image
          src="/images/cocktail1.jpeg"
          alt="내향인 파티"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-6 left-5 z-10">
          <h1 className="text-2xl font-bold text-white">내향인 파티</h1>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-linear-to-t from-secondary to-transparent" />
      </div>

      {/* 내용 */}
      <div className="px-5 py-10 flex flex-col gap-8">
        <div className="pt-8 flex flex-col gap-6 text-[#c6beb8] text-[15px] leading-7 font-light">
          <p>
            하이볼과 함께 하는 대화형 소셜링이에요.
            <br />
            편안한 분위기에서 다양한 사람들과 이야기해요.
          </p>
          <p>
            혼자 오셔도 괜찮아요.
            <br />
            90% 이상의 게스트 분들이 혼자 방문해요.
          </p>
        </div>

        <div className="bg-secondary rounded-3xl py-8 flex flex-col gap-8 text-primary text-center">
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
          <div>
            <p className="font-bold text-base">제공 주류 </p>
            <p className="text-sm mt-1 font-light">
              레몬 하이볼 / 말차 하이볼
              <br />
              소주 / 맥주 무제한
              <br />
              (논알콜도 준비되어 있어요.)
            </p>
          </div>

          <div>
            <p className="font-bold text-base">참가비</p>
            <p className="text-sm mt-1 font-light leading-6">45,000원</p>
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
