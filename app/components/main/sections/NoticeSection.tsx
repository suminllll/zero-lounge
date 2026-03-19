import Link from 'next/link'

interface NoticeSectionProps {
  showWine: boolean
}

export default function NoticeSection({ showWine }: NoticeSectionProps) {
  return (
    <div className=" w-[90%] mx-auto rounded-3xl px-6">
      <p className="text-center text-3xl font-bold italic text-primary mb-8 tracking-widest">
        NOTICE
      </p>
      <div className="border bg-secondary border-primary/30 rounded-[80px] px-8 py-10 flex flex-col gap-8 text-center text-primary">
        <div>
          <p className="font-bold text-base">장소</p>
          <p className="text-base mt-1 font-light leading-6">
            공덕역-애오개역 사이
            <br />
            <span className="text-sm">(자세한 위치는 예약 확정시 보내드려요)</span>
          </p>
        </div>

        {!showWine && (
          <>
            <div>
              <p className="font-bold text-base">제공 메뉴</p>
              <p className="text-base mt-1 font-light leading-6">
                오리고기 / 볶음밥 / 떡볶이 / 샐러드
              </p>
            </div>
            <div>
              <p className="font-bold text-base">제공 주류</p>
              <p className="text-base mt-1 font-light leading-6">
                말차 하이볼 / 레몬 하이볼 /<br /> 소주 / 맥주 무제한
              </p>
            </div>
            <div>
              <p className="font-bold text-base">참가비</p>
              <p className="text-base mt-1 font-light leading-6">45,000원</p>
            </div>
          </>
        )}

        <div>
          <p className="font-bold text-base">일정</p>
          <p className="text-base mt-1 font-light leading-6">
            목.금요일 8시 <br /> 토.일요일 6시 30분
          </p>
        </div>
        <div>
          <p className="font-bold text-base">러닝타임</p>
          <p className="text-base mt-1 font-light">150분 / 2부(선택)</p>
        </div>
        <div>
          <p className="font-bold text-base">인원</p>
          <p className="text-base mt-1 font-light leading-6">
            최소 20명에서
            <br />
            최대 36명까지 모일 거에요
            <br />
            (호스트 & 스텝 제외)
          </p>
        </div>
        <div>
          <p className="font-bold text-base">나이</p>
          <p className="text-base mt-1 font-light">37세까지만 받을게요.</p>
        </div>
      </div>
      <Link
        href="/apply"
        className="apply-btn mt-10 flex items-center justify-between w-full py-4 px-6 rounded-[80px] font-bold text-secondary text-base"
        style={{ backgroundColor: '#c6beb8' }}
      >
        <span />
        <span>소셜링 신청하기</span>
        <span className="apply-btn-arrow">&gt;</span>
      </Link>
    </div>
  )
}
