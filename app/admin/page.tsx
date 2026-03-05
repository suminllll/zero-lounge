'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  supabase,
  getDisplaySeats,
  type Application,
  type PartyType,
  PARTY_LABELS,
} from '@/lib/supabase'
import { revalidateMainPage } from '@/app/actions/revalidate'
import { useApplications } from '@/hooks/useApplications'
import { useEvents } from '@/hooks/useEvents'
import { useAdminPartySettings } from '@/hooks/useAdminPartySettings'
import { useErrorLogs } from '@/hooks/useErrorLogs'
import Image from 'next/image'

type AdminTab = 'applications' | 'events' | 'parties' | 'errors'

const STATUS_LABEL: Record<Application['status'], string> = {
  pending: '대기',
  confirmed: '입금완료',
  rejected: '미입금',
}

const STATUS_COLOR: Record<Application['status'], string> = {
  pending: '#c6beb8',
  confirmed: '#4ade80',
  rejected: '#f87171',
}

const TAB_ITEMS: { key: AdminTab; label: string }[] = [
  { key: 'applications', label: '신청자' },
  { key: 'events', label: '추가' },
  { key: 'parties', label: '파티' },
  { key: 'errors', label: '로그' },
]

const Spinner = () => (
  <div className="flex justify-center pt-20">
    <div className="w-8 h-8 border-2 border-[#c6beb8]/20 border-t-[#c6beb8] rounded-full animate-spin" />
  </div>
)

interface DetailModalProps {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: number, status: Application['status']) => void
}

const DetailModal = ({ app, onClose, onUpdateStatus }: DetailModalProps) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={onClose}>
    <div
      className="bg-secondary w-full rounded-t-3xl p-5 pb-10 max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}
    >
      <div className="w-10 h-1 bg-[#3a3230] rounded-full mx-auto mb-5" />

      <div className="flex justify-between items-start mb-5">
        <div>
          <p className="text-[#f5e2d4] font-bold text-lg">{app.name}</p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{
            backgroundColor: STATUS_COLOR[app.status] + '33',
            color: STATUS_COLOR[app.status],
          }}
        >
          {STATUS_LABEL[app.status]}
        </span>
      </div>

      {app.photo_url ? (
        <a href={app.photo_url} target="_blank" rel="noopener noreferrer" className="block mb-5">
          <Image
            src={app.photo_url}
            alt="신청자 사진"
            width={400}
            height={240}
            className="w-full h-60 object-cover rounded-2xl"
          />
          <p className="text-[#8F8781] text-xs text-center mt-1.5">탭하면 원본 보기</p>
        </a>
      ) : (
        <div className="w-full h-24 bg-[#2a2220] rounded-2xl flex items-center justify-center mb-5">
          <p className="text-[#4a3e3a] text-sm">사진 없음</p>
        </div>
      )}

      <div className="bg-[#2a2220] rounded-2xl p-4 flex flex-col gap-3 text-sm mb-5">
        {[
          ['신청 날짜', app.date],
          ['성별', app.gender],
          ['출생년도/직업', app.birth_year],
          ['연락처', app.contact],
          ['유입 경로', app.referral],
          ['접수 시각', new Date(app.created_at).toLocaleString('ko-KR')],
        ].map(([label, value]) => (
          <div key={label} className="flex gap-3">
            <span className="text-[#8F8781] w-20 shrink-0 text-xs pt-0.5">{label}</span>
            <span className="text-[#f5e2d4] flex-1">{value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(['confirmed', 'rejected', 'pending'] as const).map(s => (
          <button
            key={s}
            onClick={() => onUpdateStatus(app.id, s)}
            className={`py-4 rounded-2xl text-sm font-bold ${s === 'rejected' ? 'text-white' : 'text-secondary'} ${app.status === s ? 'ring-2 ring-white/30' : ''}`}
            style={{ backgroundColor: STATUS_COLOR[s] }}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
      </div>
    </div>
  </div>
)

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.cookie.split(';').some(c => c.trim() === 'admin_auth=1')
  })
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [tab, setTab] = useState<AdminTab>('applications')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const queryClient = useQueryClient()

  const [filterDate, setFilterDate] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const {
    data: applications = [],
    isLoading: appsLoading,
    refetch: refetchApplications,
  } = useApplications(tab === 'applications', {
    date: filterDate,
    gender: filterGender,
    status: filterStatus,
  })

  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '20:00',
    female_seats: 6,
    male_seats: 6,
    party_type: 'introvert' as PartyType,
    price: 45000,
  })
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editSeats, setEditSeats] = useState({
    female_seats: 0,
    male_seats: 0,
    time: '',
    party_type: 'introvert' as PartyType,
    price: 45000,
  })

  const { data: events = [], isLoading: eventsLoading } = useEvents(tab === 'events')
  const { data: partySettings = [], isLoading: partyLoading } = useAdminPartySettings(
    tab === 'parties'
  )
  const { data: errorLogs = [], isLoading: logsLoading } = useErrorLogs(tab === 'errors')

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

  const handleCopy = async (app: Application, e: React.MouseEvent) => {
    e.stopPropagation()
    const gender = app.gender === '여성' ? '여' : '남'
    const nickname = app.name.includes('/')
      ? app.name.split('/').slice(1).join('/').trim()
      : app.name.trim()
    await navigator.clipboard.writeText(`${gender}/${nickname}/${app.birth_year} (인스타)`)
    setCopiedId(app.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updateStatus = async (id: number, status: Application['status']) => {
    await supabase.from('applications').update({ status }).eq('id', id)
    if (selectedApp?.id === id) setSelectedApp(prev => (prev ? { ...prev, status } : null))
    queryClient.invalidateQueries({ queryKey: ['applications'] })
  }

  const addEvent = async () => {
    if (!newEvent.date || !newEvent.time) return
    const { error } = await supabase.from('events').insert(newEvent)
    if (!error) {
      setNewEvent({
        date: '',
        time: '20:00',
        female_seats: 6,
        male_seats: 6,
        party_type: 'introvert',
        price: 45000,
      })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  }

  const saveEditEvent = async (id: number) => {
    await supabase.from('events').update(editSeats).eq('id', id)
    setEditingId(null)
    queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  const deleteEvent = async (id: number) => {
    if (!confirm('이벤트를 삭제할까요?')) return
    await supabase.from('events').delete().eq('id', id)
    queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  const toggleParty = async (partyType: string, current: boolean) => {
    await supabase
      .from('party_settings')
      .update({ is_visible: !current })
      .eq('party_type', partyType)
    queryClient.invalidateQueries({ queryKey: ['admin_party_settings'] })
    await revalidateMainPage()
  }

  const clearErrorLogs = async () => {
    if (!confirm('모든 로그를 삭제할까요?')) return
    await supabase.from('error_logs').delete().neq('id', 0)
    queryClient.invalidateQueries({ queryKey: ['error_logs'] })
  }

  // ── 로그인 ────────────────────────────────
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
      <main className="w-full max-w-[390px] min-h-screen bg-secondary text-[#f5e2d4] relative pb-10">
        {selectedApp && (
          <DetailModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdateStatus={updateStatus}
          />
        )}

        {/* 헤더 */}
        <div className="sticky top-0 bg-secondary z-10">
          <div className="px-5 pt-5 pb-3">
            <p className="text-[#c6beb8] font-bold text-xl tracking-widest">ADMIN</p>
          </div>
          {/* 탭 바 */}
          <div className="flex border-b border-[#2a2220]">
            {TAB_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-3 text-xs font-medium transition-colors border-b-2 ${tab === key ? 'text-[#c6beb8] border-[#c6beb8]' : 'text-[#4a3e3a] border-transparent'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 신청자 탭 ───────────────────────── */}
        {tab === 'applications' && (
          <>
            {/* 필터 */}
            <div className="px-4 pt-4 pb-2 grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#c6beb8] text-sm outline-none"
              />
              <select
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
                className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#c6beb8] text-sm outline-none"
              >
                <option value="">성별 전체</option>
                <option value="여성">여성</option>
                <option value="남성">남성</option>
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#c6beb8] text-sm outline-none"
              >
                <option value="">상태 전체</option>
                <option value="pending">대기</option>
                <option value="confirmed">입금완료</option>
                <option value="rejected">미입금</option>
              </select>
              <button
                onClick={() => refetchApplications()}
                className="bg-[#c6beb8] text-secondary rounded-xl py-3 text-sm font-bold"
              >
                조회
              </button>
            </div>

            {/* 집계 */}
            <div className="px-4 py-3 grid grid-cols-3 gap-2">
              {(['pending', 'confirmed', 'rejected'] as const).map(s => (
                <div key={s} className="bg-[#2a2220] rounded-2xl py-4 text-center">
                  <p className="text-xs mb-1" style={{ color: STATUS_COLOR[s] }}>
                    {STATUS_LABEL[s]}
                  </p>
                  <p className="text-2xl font-bold">
                    {applications.filter(a => a.status === s).length}
                  </p>
                </div>
              ))}
            </div>

            {/* 목록 */}
            {appsLoading ? (
              <Spinner />
            ) : applications.length === 0 ? (
              <p className="text-center text-[#8F8781] text-sm pt-20">신청 내역이 없습니다.</p>
            ) : (
              <div className="px-4 flex flex-col gap-2 pb-4">
                {applications.map(app => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className="w-full bg-[#2a2220] rounded-2xl p-4 text-left flex items-center gap-3 active:opacity-70 cursor-pointer"
                  >
                    {app.photo_url ? (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image src={app.photo_url} alt={app.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#3a3230] flex items-center justify-center shrink-0">
                        <span className="text-[#8F8781] text-base">{app.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-[#f5e2d4] truncate text-base">{app.name}</p>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: STATUS_COLOR[app.status] + '33',
                            color: STATUS_COLOR[app.status],
                          }}
                        >
                          {STATUS_LABEL[app.status]}
                        </span>
                      </div>
                      <p className="text-[#8F8781] text-xs">
                        {app.date} · {app.gender}
                      </p>
                      <p className="text-[#8F8781] text-xs truncate mt-0.5">{app.birth_year}</p>
                    </div>
                    {/* 복사 버튼 */}
                    <button
                      onClick={e => handleCopy(app, e)}
                      className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor: copiedId === app.id ? '#4ade80' : '#3a3230',
                        color: copiedId === app.id ? '#1a1210' : '#c6beb8',
                      }}
                    >
                      {copiedId === app.id ? '복사됨' : '복사'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── 이벤트 탭 ───────────────────────── */}
        {tab === 'events' && (
          <div className="px-4 pt-4">
            {/* 추가 폼 */}
            <div className="bg-[#2a2220] rounded-2xl p-4 mb-4">
              <p className="text-[#c6beb8] font-bold text-sm mb-3">새 파티 추가</p>
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                    className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                    className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newEvent.party_type}
                    onChange={e =>
                      setNewEvent(p => ({
                        ...p,
                        party_type: e.target.value as PartyType,
                        price: e.target.value === 'introvert' ? 45000 : 49000,
                      }))
                    }
                    className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                  >
                    <option value="introvert">내향인 파티</option>
                    <option value="wine">와인 파티</option>
                  </select>
                  <select
                    value={
                      newEvent.price === 45000
                        ? '45000'
                        : newEvent.price === 49000
                          ? '49000'
                          : 'custom'
                    }
                    onChange={e => {
                      if (e.target.value === '45000') setNewEvent(p => ({ ...p, price: 45000 }))
                      else if (e.target.value === '49000')
                        setNewEvent(p => ({ ...p, price: 49000 }))
                      else setNewEvent(p => ({ ...p, price: 0 }))
                    }}
                    className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                  >
                    <option value="45000">45,000원</option>
                    <option value="49000">49,000원</option>
                    <option value="custom">직접입력</option>
                  </select>
                </div>
                {newEvent.price !== 45000 && newEvent.price !== 49000 && (
                  <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                    <span className="text-[#8F8781] text-xs shrink-0">직접입력</span>
                    <input
                      type="number"
                      value={newEvent.price || ''}
                      onChange={e => setNewEvent(p => ({ ...p, price: Number(e.target.value) }))}
                      placeholder="금액"
                      className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0 placeholder:text-[#4a3e3a]"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                    <span className="text-[#8F8781] text-xs">여성</span>
                    <input
                      type="number"
                      value={newEvent.female_seats}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, female_seats: Number(e.target.value) }))
                      }
                      className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                    />
                  </div>
                  <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                    <span className="text-[#8F8781] text-xs">남성</span>
                    <input
                      type="number"
                      value={newEvent.male_seats}
                      onChange={e =>
                        setNewEvent(p => ({ ...p, male_seats: Number(e.target.value) }))
                      }
                      className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                    />
                  </div>
                </div>
                <button
                  onClick={addEvent}
                  disabled={!newEvent.date}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                  style={{ backgroundColor: '#c6beb8' }}
                >
                  추가
                </button>
              </div>
            </div>

            {/* 이벤트 목록 */}
            {eventsLoading ? (
              <Spinner />
            ) : events.length === 0 ? (
              <p className="text-center text-[#8F8781] text-sm pt-10">등록된 이벤트가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-2 pb-4">
                {events.map(ev => {
                  const display = getDisplaySeats(ev)
                  const isExpanded = expandedId === ev.id
                  const isEditing = editingId === ev.id
                  const dayLabel = ['일', '월', '화', '수', '목', '금', '토'][
                    new Date(ev.date + 'T12:00:00').getDay()
                  ]
                  return (
                    <div key={ev.id} className="bg-[#2a2220] rounded-2xl overflow-hidden">
                      {/* 항상 보이는 헤더 */}
                      <button
                        onClick={() => {
                          const next = isExpanded ? null : ev.id
                          setExpandedId(next)
                          if (!next) setEditingId(null)
                        }}
                        className="w-full flex items-center justify-between px-4 py-3.5 active:opacity-70"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-[#f5e2d4] font-bold text-sm">{ev.date}</p>
                          <p className="text-[#8F8781] text-xs">
                            ({dayLabel}) {ev.time}
                          </p>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#3a3230] text-[#c6beb8]">
                            {PARTY_LABELS[ev.party_type]}
                          </span>
                        </div>
                        <span
                          className={`text-[#8F8781] text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          ▾
                        </span>
                      </button>

                      {/* 펼쳐지는 상세 내용 */}
                      {isExpanded && (
                        <div className="px-4 pb-4 flex flex-col gap-2.5 border-t border-[#3a3230] pt-3">
                          {isEditing ? (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={editSeats.party_type}
                                  onChange={e =>
                                    setEditSeats(p => ({
                                      ...p,
                                      party_type: e.target.value as PartyType,
                                      price: e.target.value === 'introvert' ? 45000 : 49000,
                                    }))
                                  }
                                  className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                                >
                                  <option value="introvert">내향인 파티</option>
                                  <option value="wine">와인 파티</option>
                                </select>
                                <select
                                  value={
                                    editSeats.price === 45000
                                      ? '45000'
                                      : editSeats.price === 49000
                                        ? '49000'
                                        : 'custom'
                                  }
                                  onChange={e => {
                                    if (e.target.value === '45000')
                                      setEditSeats(p => ({ ...p, price: 45000 }))
                                    else if (e.target.value === '49000')
                                      setEditSeats(p => ({ ...p, price: 49000 }))
                                    else setEditSeats(p => ({ ...p, price: 0 }))
                                  }}
                                  className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                                >
                                  <option value="45000">45,000원</option>
                                  <option value="49000">49,000원</option>
                                  <option value="custom">직접입력</option>
                                </select>
                              </div>
                              {editSeats.price !== 45000 && editSeats.price !== 49000 && (
                                <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                                  <span className="text-[#8F8781] text-xs shrink-0">직접입력</span>
                                  <input
                                    type="number"
                                    value={editSeats.price || ''}
                                    onChange={e =>
                                      setEditSeats(p => ({ ...p, price: Number(e.target.value) }))
                                    }
                                    placeholder="금액"
                                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0 placeholder:text-[#4a3e3a]"
                                  />
                                </div>
                              )}
                              <input
                                type="time"
                                value={editSeats.time}
                                onChange={e => setEditSeats(p => ({ ...p, time: e.target.value }))}
                                className="bg-secondary rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                                  <span className="text-[#8F8781] text-xs">여성</span>
                                  <input
                                    type="number"
                                    value={editSeats.female_seats}
                                    onChange={e =>
                                      setEditSeats(p => ({
                                        ...p,
                                        female_seats: Number(e.target.value),
                                      }))
                                    }
                                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                                  />
                                </div>
                                <div className="bg-secondary rounded-xl px-3 py-3 flex items-center gap-2">
                                  <span className="text-[#8F8781] text-xs">남성</span>
                                  <input
                                    type="number"
                                    value={editSeats.male_seats}
                                    onChange={e =>
                                      setEditSeats(p => ({
                                        ...p,
                                        male_seats: Number(e.target.value),
                                      }))
                                    }
                                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="py-3 rounded-xl text-sm font-bold bg-[#3a3230] text-[#c6beb8]"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => saveEditEvent(ev.id)}
                                  className="py-3 rounded-xl text-sm font-bold text-secondary"
                                  style={{ backgroundColor: '#c6beb8' }}
                                >
                                  저장
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-secondary rounded-xl p-3 text-center">
                                  <p className="text-[#8F8781] text-xs mb-1">시작</p>
                                  <p className="text-[#f5e2d4] text-sm font-bold">{ev.time}</p>
                                </div>
                                <div className="bg-secondary rounded-xl p-3 text-center">
                                  <p className="text-[#8F8781] text-xs mb-1">여성</p>
                                  <p className="text-[#f5e2d4] text-xl font-bold">
                                    {display.female}
                                  </p>
                                </div>
                                <div className="bg-secondary rounded-xl p-3 text-center">
                                  <p className="text-[#8F8781] text-xs mb-1">남성</p>
                                  <p className="text-[#f5e2d4] text-xl font-bold">{display.male}</p>
                                </div>
                              </div>
                              <div className="bg-secondary rounded-xl px-3 py-2.5 flex items-center justify-between">
                                <span className="text-[#8F8781] text-xs">참가비</span>
                                <span className="text-[#f5e2d4] text-sm font-medium">
                                  {ev.price.toLocaleString()}원
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(ev.id)
                                    setEditSeats({
                                      female_seats: ev.female_seats,
                                      male_seats: ev.male_seats,
                                      time: ev.time,
                                      party_type: ev.party_type,
                                      price: ev.price,
                                    })
                                  }}
                                  className="py-3 rounded-xl text-sm font-bold bg-[#3a3230] text-[#c6beb8]"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => deleteEvent(ev.id)}
                                  className="py-3 rounded-xl text-sm font-bold bg-[#3a3230] text-[#f87171]"
                                >
                                  삭제
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── 파티 탭 ─────────────────────────── */}
        {tab === 'parties' && (
          <div className="px-4 pt-4">
            <p className="text-[#8F8781] text-xs mb-4">
              토글을 끄면 메인 페이지에서 해당 파티 카드가 숨겨집니다.
            </p>
            {partyLoading ? (
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
                          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform duration-200 ${isVisible ? 'translate-x-7' : 'translate-x-0.5'}`}
                        />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── 에러 로그 탭 ─────────────────────── */}
        {tab === 'errors' && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#8F8781] text-xs">최근 에러 로그 (최대 100개)</p>
              {errorLogs.length > 0 && (
                <button
                  onClick={clearErrorLogs}
                  className="text-xs text-[#f87171] bg-[#2a2220] px-3 py-1.5 rounded-lg"
                >
                  전체 삭제
                </button>
              )}
            </div>
            {logsLoading ? (
              <Spinner />
            ) : errorLogs.length === 0 ? (
              <p className="text-center text-[#8F8781] text-sm pt-20">에러 로그가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-2 pb-4">
                {errorLogs.map(log => (
                  <div key={log.id} className="bg-[#2a2220] rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#f87171]/20 text-[#f87171] font-medium shrink-0">
                        {log.page}
                      </span>
                      <span className="text-[#8F8781] text-xs shrink-0">
                        {new Date(log.created_at).toLocaleString('ko-KR')}
                      </span>
                    </div>
                    <p className="text-[#f5e2d4] text-sm mb-1">{log.message}</p>
                    {log.stack && (
                      <p className="text-[#8F8781] text-xs leading-5 break-all whitespace-pre-wrap mt-2 border-t border-[#3a3230] pt-2">
                        {log.stack}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
