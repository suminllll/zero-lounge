import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Application = {
  id: number
  created_at: string
  date: string
  gender: string
  name: string
  nickname: string
  birth_year: string
  photo_url: string | null
  contact: string
  referral: string
  status: 'pending' | 'confirmed'
  memo: string | null
  sms_sent: boolean
}

export type PartyType = 'introvert' | 'wine'

export type Event = {
  id: number
  created_at: string
  date: string
  time: string
  female_seats: number
  male_seats: number
  party_type: PartyType
  price: number
}

export const PARTY_LABELS: Record<PartyType, string> = {
  introvert: '내향인 파티',
  wine: '와인 파티',
}

export type PartySetting = {
  id: number
  party_type: 'introvert' | 'wine'
  is_visible: boolean
}

export type ErrorLog = {
  id: number
  created_at: string
  page: string
  message: string
  stack: string | null
}

/**
 * 잔여좌석 표시 로직
 * - 과거 날짜: 0
 * - 당일 이벤트 시간 이후: 0
 * - 그 외: DB 값 그대로
 */
export function getDisplaySeats(event: Event): { female: number; male: number } {
  // KST(UTC+9) 기준 오늘 날짜
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]

  if (event.date < today) return { female: 0, male: 0 }

  return { female: event.female_seats, male: event.male_seats }
}
