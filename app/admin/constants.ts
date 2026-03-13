import type { Application } from '@/lib/supabase'

export const STATUS_LABEL: Record<Application['status'], string> = {
  pending: '대기',
  confirmed: '확정',
}

export const STATUS_COLOR: Record<Application['status'], string> = {
  pending: '#4ade80',
  confirmed: '#c6beb8',
}

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export function getDayLabel(dateStr: string) {
  return DAY_LABELS[new Date(dateStr + 'T00:00:00').getDay()]
}

// 문자 발송 템플릿 — 내용은 여기서 수정, 가격은 어드민에서 입력
export function buildConfirmMessage(params: { name: string; date: string; price: number }): string {
  return `안녕하세요 제로라운지 입니다!\n
신청서는 들어왔는데 아직 입금이 되지않아서 메세지 드려요!\n
현재 잔여석이 얼마 남지 않아서\n 입금순으로 신청완료 되니 참고 부탁드립니다:)\n우리 1002164275949\n김*민 ${params.price.toLocaleString()}원`
  // return `[ZERO LOUNGE] ${params.name}님, ${params.date} 파티 참가가 확정되었습니다!\n\n참가비 ${params.price.toLocaleString()}원을 아래 계좌로 입금해 주세요.\n\n계좌번호: \n예금주: \n\n입금 확인 후 상세 안내 드리겠습니다 :)`
}
