import { useQuery } from '@tanstack/react-query'
import { supabase, type Application } from '@/lib/supabase'

interface Filters {
  date: string
  gender: string
  status: string
}

async function fetchApplications(filters: Filters): Promise<Application[]> {
  let query = supabase.from('applications').select('*').order('created_at', { ascending: false })
  if (filters.date) query = query.eq('date', filters.date)
  if (filters.gender) query = query.eq('gender', filters.gender)
  if (filters.status) query = query.eq('status', filters.status)
  const { data } = await query
  return (data as Application[]) ?? []
}

export function useApplications(enabled: boolean, filters: Filters) {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => fetchApplications(filters),
    enabled,
  })
}
