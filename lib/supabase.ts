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
  job: string
  mbti: string
  photo_url: string | null
  contact: string
  referral: string
  status: 'pending' | 'confirmed' | 'rejected'
}

export type Event = {
  id: number
  created_at: string
  date: string
  time: string
  female_seats: number
  male_seats: number
}

export type PartySetting = {
  id: number
  party_type: 'introvert' | 'wine'
  is_visible: boolean
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
    const eventTime = new Date()
    eventTime.setHours(h, m, 0, 0)

    if (now >= eventTime) return { female: 0, male: 0 }

    return {
      female: Math.max(0, event.female_seats - 2),
      male: Math.max(0, event.male_seats - 1),
    }
  }

  return { female: event.female_seats, male: event.male_seats }
}
