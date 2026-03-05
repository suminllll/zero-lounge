import { useQuery } from '@tanstack/react-query'
import { supabase, type ErrorLog } from '@/lib/supabase'

async function fetchErrorLogs(): Promise<ErrorLog[]> {
  const { data } = await supabase
    .from('error_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return (data as ErrorLog[]) ?? []
}

export function useErrorLogs(enabled: boolean) {
  return useQuery({
    queryKey: ['error_logs'],
    queryFn: fetchErrorLogs,
    enabled,
  })
}
