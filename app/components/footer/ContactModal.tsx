'use client'

interface ContactModalProps {
  onClose: () => void
}

export default function ContactModal({ onClose }: ContactModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#f5ede7] text-[#1f1001] rounded-t-3xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#f5ede7] px-6 pt-6 pb-3 flex justify-between items-center">
          <h2 className="text-lg font-bold">Contact</h2>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 pb-10 text-sm leading-7 font-light flex flex-col gap-6">
          <p>문의 사항이 있으시면 아래 채널로 연락해 주세요.<br />최대한 빠르게 답변 드리겠습니다.</p>

          <div className="flex flex-col gap-4">
            <div className="bg-[#e8ddd7] rounded-2xl px-5 py-4 flex flex-col gap-1">
              <p className="font-semibold text-base">인스타그램 DM</p>
              <p className="text-[#8F8781]">가장 빠른 응답 채널이에요.</p>
              <a
                href="https://instagram.com/zero.lounge_"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-medium underline underline-offset-2"
              >
                @zero.lounge_
              </a>
            </div>

            <div className="bg-[#e8ddd7] rounded-2xl px-5 py-4 flex flex-col gap-1">
              <p className="font-semibold text-base">이메일</p>
              <p className="text-[#8F8781]">자세한 문의는 이메일로 보내주세요.</p>
              <a
                href="mailto:zero.lounge.official@gmail.com"
                className="mt-1 font-medium underline underline-offset-2"
              >
                zero.lounge.official@gmail.com
              </a>
            </div>
          </div>

          <div className="text-xs text-[#8F8781] flex flex-col gap-1">
            <p>운영 시간: 월~금 10:00 ~ 18:00</p>
            <p>주말 및 공휴일에는 답변이 늦어질 수 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
