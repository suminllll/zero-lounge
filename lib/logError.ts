import { supabase } from './supabase'

export async function logError(page: string, message: string, stack?: string) {
  try {
    await supabase.from('error_logs').insert({
      page,
      message,
      stack: stack ?? null,
    })
  } catch {
    // 에러 로깅 자체가 실패해도 무시
  }
}
