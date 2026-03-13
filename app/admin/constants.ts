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
  return `제로라운지 입금 안내\n우리 1002164275949\n김*민 ${params.price.toLocaleString()}원`
  // return `[ZERO LOUNGE] ${params.name}님, ${params.date} 파티 참가가 확정되었습니다!\n\n참가비 ${params.price.toLocaleString()}원을 아래 계좌로 입금해 주세요.\n\n계좌번호: \n예금주: \n\n입금 확인 후 상세 안내 드리겠습니다 :)`
}
