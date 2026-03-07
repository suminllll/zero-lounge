'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ApplicationsTab } from './components/ApplicationsTab'
import { EventsTab } from './components/EventsTab'
import { PartiesTab } from './components/PartiesTab'
import { ErrorLogsTab } from './components/ErrorLogsTab'

type AdminTab = 'applications' | 'events' | 'parties' | 'errors'

const TAB_ITEMS: { key: AdminTab; label: string }[] = [
  { key: 'applications', label: 'Applicant' },
  { key: 'events', label: 'Parties' },
  { key: 'parties', label: 'Status' },
  { key: 'errors', label: 'Logs' },
]

export default function AdminPage() {
  // useState(false) then sync in effect is intentional to avoid SSR hydration mismatch
  const [isAuthed, setIsAuthed] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthed(document.cookie.split(';').some(c => c.trim() === 'admin_auth=1'))
  }, [])

  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [tab, setTab] = useState<AdminTab>('applications')

  const queryClient = useQueryClient()
  const mainRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)
  const [pullY, setPullY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  // 에러 로그 미읽음 배지 - lazy initializer reads localStorage only on client
  const [lastReadLogCount, setLastReadLogCount] = useState(() =>
    typeof window !== 'undefined' ? Number(localStorage.getItem('errorLogsLastRead') ?? 0) : 0
  )

  const { data: errorLogCount = 0 } = useQuery({
    queryKey: ['error_logs_count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('error_logs')
        .select('*', { count: 'exact', head: true })
      return count ?? 0
    },
    refetchInterval: 60000,
    enabled: isAuthed,
  })

  const unreadLogCount = errorLogCount > lastReadLogCount ? errorLogCount - lastReadLogCount : 0

  const handleTabClick = (key: AdminTab) => {
    setTab(key)
    if (key === 'errors' && errorLogCount > lastReadLogCount) {
      setLastReadLogCount(errorLogCount)
      localStorage.setItem('errorLogsLastRead', String(errorLogCount))
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!mainRef.current || mainRef.current.scrollTop > 0) return
    const delta = e.touches[0].clientY - touchStartY.current
    if (delta > 0) {
      setIsPulling(true)
      setPullY(Math.min(delta * 0.5, 60))
    }
  }
  const onTouchEnd = async () => {
    if (pullY >= 50) await queryClient.invalidateQueries()
    setPullY(0)
    setIsPulling(false)
  }

  const handleLogin = () => {
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'
    if (password === adminPw) {
      setIsAuthed(true)
      setPasswordError(false)
      if (rememberMe) {
        document.cookie = `admin_auth=1; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Strict`
      }
    } else setPasswordError(true)
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-secondary flex flex-col items-center justify-center px-6">
        <p className="text-[#c6beb8] text-2xl font-bold tracking-widest mb-2">ZERO LOUNGE</p>
        <p className="text-[#8F8781] text-sm mb-10">관리자</p>
        <div className="w-full max-w-xs">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="비밀번호"
            className="w-full bg-[#2a2220] rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-[#4a3e3a] outline-none mb-3"
          />
          {passwordError && (
            <p className="text-red-400 text-sm mb-3 text-center">비밀번호가 틀렸습니다.</p>
          )}
          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#c6beb8]"
            />
            <span className="text-[#8F8781] text-sm">로그인 상태 유지</span>
          </label>
          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-2xl font-bold text-secondary text-base"
            style={{ backgroundColor: '#c6beb8' }}
          >
            로그인
          </button>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-black flex justify-center">
      <main
        ref={mainRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="w-full max-w-[390px] min-h-screen bg-secondary text-[#f5e2d4] relative pb-10"
      >
        {isPulling && (
          <div className="flex justify-center items-center" style={{ height: pullY }}>
            <div
              className={`w-5 h-5 border-2 border-[#c6beb8]/20 border-t-[#c6beb8] rounded-full ${pullY >= 50 ? 'animate-spin' : ''}`}
            />
          </div>
        )}

        {/* 헤더 */}
        <div className="sticky top-0 bg-secondary z-10">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[#c6beb8] font-bold text-xl tracking-widest">ADMIN</p>
          </div>
          <div className="flex border-b border-[#2a2220]">
            {TAB_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabClick(key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 relative ${tab === key ? 'text-[#c6beb8] border-[#c6beb8]' : 'text-[#4a3e3a] border-transparent'}`}
              >
                {label}
                {key === 'errors' && unreadLogCount > 0 && (
                  <span className="absolute top-1.5 right-2 min-w-[16px] h-4 bg-white text-secondary text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
                    {unreadLogCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'applications' && <ApplicationsTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'parties' && <PartiesTab />}
        {tab === 'errors' && <ErrorLogsTab />}
      </main>
    </div>
  )
}
