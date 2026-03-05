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
  birth_year: string
  photo_url: string | null
  contact: string
  referral: string
  status: 'pending' | 'confirmed' | 'rejected'
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
 * 당일 자동 잔여좌석 조정 로직
 * - 소셜링 당일: 여성 -2, 남성 -1
 * - 소셜링 시간 이후: 0
 * - 과거 날짜: 0
 */
export function getDisplaySeats(event: Event): { female: number; male: number } {
  const today = new Date().toISOString().split('T')[0]

  if (event.date < today) return { female: 0, male: 0 }

  if (event.date === today) {
    const [h, m] = event.time.split(':').map(Number)
    const now = new Date()
    // 이벤트 시간은 KST(UTC+9) 기준 → UTC로 변환해 서버/클라이언트 일치
    const eventUTC = new Date()
    const utcHour = h - 9
    eventUTC.setUTCHours(utcHour < 0 ? utcHour + 24 : utcHour, m, 0, 0)

    if (now >= eventUTC) return { female: 0, male: 0 }

    return {
      female: Math.max(0, event.female_seats - 2),
      male: Math.max(0, event.male_seats - 1),
    }
  }

  return { female: event.female_seats, male: event.male_seats }
}
