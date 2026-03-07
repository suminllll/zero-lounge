'use client'

import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAdminPartySettings } from '@/hooks/useAdminPartySettings'
import { revalidateMainPage } from '@/app/actions/revalidate'
import { Spinner } from './Spinner'

export function PartiesTab() {
  const queryClient = useQueryClient()
  const { data: partySettings = [], isLoading } = useAdminPartySettings(true)

  const toggleParty = async (partyType: string, current: boolean) => {
    await supabase
      .from('party_settings')
      .update({ is_visible: !current })
      .eq('party_type', partyType)
    queryClient.invalidateQueries({ queryKey: ['admin_party_settings'] })
    await revalidateMainPage()
  }

  return (
    <div className="px-4 pt-4">
      <p className="text-[#8F8781] text-xs mb-4">
        토글을 끄면 메인 페이지에서 해당 파티 카드가 숨겨집니다.
      </p>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-3">
          {[
            { type: 'introvert', label: '내향인 파티', sub: '얼그레이 · 말차 하이볼' },
            { type: 'wine', label: '와인 파티', sub: '레드 · 화이트 와인' },
          ].map(({ type, label, sub }) => {
            const setting = partySettings.find(p => p.party_type === type)
            const isVisible = setting?.is_visible ?? true
            return (
              <div
                key={type}
                className="bg-[#2a2220] rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-[#f5e2d4] font-bold text-base">{label}</p>
                  <p className="text-[#8F8781] text-xs mt-0.5">{sub}</p>
                </div>
                <button
                  onClick={() => toggleParty(type, isVisible)}
                  className={`w-14 h-7 rounded-full transition-colors duration-200 relative shrink-0 ${isVisible ? 'bg-[#c6beb8]' : 'bg-[#3a3230]'}`}
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${isVisible ? '' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
