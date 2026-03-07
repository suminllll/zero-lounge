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
