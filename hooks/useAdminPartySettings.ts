import { useQuery } from '@tanstack/react-query'
import { supabase, type PartySetting } from '@/lib/supabase'

async function fetchAdminPartySettings(): Promise<PartySetting[]> {
  const { data } = await supabase.from('party_settings').select('*')
  return (data as PartySetting[]) ?? []
}

export function useAdminPartySettings(enabled = true) {
  return useQuery({
    queryKey: ['admin_party_settings'],
    queryFn: fetchAdminPartySettings,
    enabled,
  })
}
