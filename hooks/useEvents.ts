import { useQuery } from '@tanstack/react-query'
import { supabase, type Event } from '@/lib/supabase'

async function fetchEvents(): Promise<Event[]> {
  const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
  return (data as Event[]) ?? []
}

export function useEvents(enabled = true) {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    enabled,
  })
}
