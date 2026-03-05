'use client'

interface TermsModalProps {
  onClose: () => void
}

export default function TermsModal({ onClose }: TermsModalProps) {
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
          <h2 className="text-lg font-bold">이용약관</h2>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 pb-10 text-sm leading-7 font-light flex flex-col gap-5">
          <p>본 약관은 ZERO LOUNGE(이하 &quot;서비스&quot;)에서 제공하는 소셜링 서비스 이용에 관한 조건을 규정합니다.</p>

          <div>
            <p className="font-semibold mb-1">제1조 (목적)</p>
            <p>본 약관은 ZERO LOUNGE가 운영하는 소셜링 서비스의 이용 조건 및 절차, 서비스 이용자와 운영자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">제2조 (서비스 이용)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>소셜링 신청 시 제공한 정보는 정확해야 합니다.</li>
              <li>참가비 입금이 완료된 후 참가 확정이 이루어집니다.</li>
              <li>행사 당일 참석이 어려운 경우, 사전에 반드시 연락 주시기 바랍니다.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">제3조 (환불 정책)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>행사 3일 전까지: 전액 환불</li>
              <li>행사 1~2일 전: 50% 환불</li>
              <li>행사 당일 취소 또는 노쇼: 환불 불가</li>
            </ul>
            <p className="mt-1">환불 문의는 인스타그램 DM 또는 이메일로 접수해 주세요.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">제4조 (이용자 의무)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>다른 참가자에 대한 존중과 배려를 유지해야 합니다.</li>
              <li>행사 중 촬영된 사진은 상대방의 동의 없이 공개적으로 게시할 수 없습니다.</li>
              <li>불법적이거나 타인에게 불쾌감을 주는 행위는 금지됩니다.</li>
              <li>위 사항 위반 시 행사에서 퇴장 조치될 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">제5조 (운영자 의무)</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>안전하고 편안한 소셜링 환경을 제공하기 위해 최선을 다합니다.</li>
              <li>이용자의 개인정보를 안전하게 관리합니다.</li>
              <li>불가피한 사정으로 행사가 취소될 경우 전액 환불 처리합니다.</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">제6조 (면책조항)</p>
            <p>ZERO LOUNGE는 천재지변, 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</p>
          </div>

          <p className="text-xs text-[#8F8781]">본 약관은 2025년 1월 1일부터 적용됩니다.</p>
        </div>
      </div>
    </div>
  )
}
