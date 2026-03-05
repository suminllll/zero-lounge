'use client'

interface PrivacyPolicyModalProps {
  onClose: () => void
}

export default function PrivacyPolicyModal({ onClose }: PrivacyPolicyModalProps) {
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
          <h2 className="text-lg font-bold">개인정보처리방침</h2>
          <button onClick={onClose} className="text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 pb-10 text-sm leading-7 font-light flex flex-col gap-5">
          <p>ZERO LOUNGE(이하 &quot;서비스&quot;)는 이용자의 개인정보 보호를 중요하게 생각하며, 아래와 같이 개인정보처리방침을 수립·운영합니다.</p>

          <div>
            <p className="font-semibold mb-1">1. 수집하는 개인정보 항목</p>
            <p>소셜링 신청 시 다음 정보를 수집합니다.</p>
            <ul className="list-disc pl-5 mt-1 flex flex-col gap-1">
              <li>이름</li>
              <li>성별</li>
              <li>연령대</li>
              <li>연락처(전화번호)</li>
              <li>입금자명</li>
              <li>자기소개 및 기타 선택 입력 항목</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">2. 개인정보 수집 및 이용 목적</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>소셜링 참가 신청 접수 및 확인</li>
              <li>행사 운영 및 참가자 안내</li>
              <li>입금 확인 및 참가비 처리</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-1">3. 개인정보 보유 및 이용 기간</p>
            <p>수집한 개인정보는 행사 종료 후 90일 이내에 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">4. 개인정보 제3자 제공</p>
            <p>ZERO LOUNGE는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">5. 개인정보 파기</p>
            <p>개인정보 보유 기간이 경과하거나 처리 목적이 달성된 경우, 해당 정보를 지체 없이 파기합니다.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">6. 이용자 권리</p>
            <p>이용자는 언제든지 자신의 개인정보 열람, 수정, 삭제를 요청할 수 있습니다. 문의는 아래 연락처로 해주세요.</p>
            <p className="mt-1">이메일: zero.lounge.official@gmail.com</p>
          </div>

          <p className="text-xs text-[#8F8781]">본 방침은 2025년 1월 1일부터 적용됩니다.</p>
        </div>
      </div>
    </div>
  )
}
