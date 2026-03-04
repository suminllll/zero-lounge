import { useQuery } from '@tanstack/react-query'
import { supabase, type PartySetting } from '@/lib/supabase'

async function fetchPartySettings(): Promise<Record<string, boolean>> {
  const { data } = await supabase.from('party_settings').select('*')
  const map: Record<string, boolean> = {}
  ;((data as PartySetting[]) ?? []).forEach(s => {
    map[s.party_type] = s.is_visible
  })
  return map
}

export function usePartySettings() {
  return useQuery({
    queryKey: ['party_settings'],
    queryFn: fetchPartySettings,
  })
}
