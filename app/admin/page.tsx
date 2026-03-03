'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase, getDisplaySeats, type Application, type Event, type PartySetting } from '@/lib/supabase'

type AdminTab = 'applications' | 'events' | 'parties'

const STATUS_LABEL: Record<Application['status'], string> = {
  pending: '대기',
  confirmed: '확정',
  rejected: '거절',
}

const STATUS_COLOR: Record<Application['status'], string> = {
  pending: '#c6beb8',
  confirmed: '#4ade80',
  rejected: '#f87171',
}

const TAB_ITEMS: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'applications', label: '신청자', icon: '👤' },
  { key: 'events', label: '이벤트', icon: '📅' },
  { key: 'parties', label: '파티', icon: '🎉' },
]

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [tab, setTab] = useState<AdminTab>('applications')

  const [applications, setApplications] = useState<Application[]>([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [newEvent, setNewEvent] = useState({ date: '', time: '20:00', female_seats: 6, male_seats: 6 })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editSeats, setEditSeats] = useState({ female_seats: 0, male_seats: 0, time: '' })

  const [partySettings, setPartySettings] = useState<PartySetting[]>([])
  const [partyLoading, setPartyLoading] = useState(false)

  const fetchApplications = useCallback(async () => {
    setAppsLoading(true)
    let query = supabase.from('applications').select('*').order('created_at', { ascending: false })
    if (filterDate) query = query.eq('date', filterDate)
    if (filterGender) query = query.eq('gender', filterGender)
    if (filterStatus) query = query.eq('status', filterStatus)
    const { data } = await query
    if (data) setApplications(data as Application[])
    setAppsLoading(false)
  }, [filterDate, filterGender, filterStatus])

  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
    if (data) setEvents(data as Event[])
    setEventsLoading(false)
  }, [])

  const fetchPartySettings = useCallback(async () => {
    setPartyLoading(true)
    const { data } = await supabase.from('party_settings').select('*')
    if (data) setPartySettings(data as PartySetting[])
    setPartyLoading(false)
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    if (tab === 'applications') fetchApplications()
    if (tab === 'events') fetchEvents()
    if (tab === 'parties') fetchPartySettings()
  }, [isAuthed, tab, fetchApplications, fetchEvents, fetchPartySettings])

  const handleLogin = () => {
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin1234'
    if (password === adminPw) { setIsAuthed(true); setPasswordError(false) }
    else setPasswordError(true)
  }

  const updateStatus = async (id: number, status: Application['status']) => {
    await supabase.from('applications').update({ status }).eq('id', id)
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status } : null)
  }

  const addEvent = async () => {
    if (!newEvent.date || !newEvent.time) return
    const { error } = await supabase.from('events').insert(newEvent)
    if (!error) { setNewEvent({ date: '', time: '20:00', female_seats: 6, male_seats: 6 }); fetchEvents() }
  }

  const saveEditEvent = async (id: number) => {
    await supabase.from('events').update(editSeats).eq('id', id)
    setEditingId(null); fetchEvents()
  }

  const deleteEvent = async (id: number) => {
    if (!confirm('이벤트를 삭제할까요?')) return
    await supabase.from('events').delete().eq('id', id); fetchEvents()
  }

  const toggleParty = async (partyType: string, current: boolean) => {
    await supabase.from('party_settings').update({ is_visible: !current }).eq('party_type', partyType)
    setPartySettings(prev => prev.map(p => p.party_type === partyType ? { ...p, is_visible: !current } : p))
  }

  // ── 로그인 ────────────────────────────────
  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-[#1a1210] flex flex-col items-center justify-center px-6">
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
          {passwordError && <p className="text-red-400 text-sm mb-3 text-center">비밀번호가 틀렸습니다.</p>}
          <button
            onClick={handleLogin}
            className="w-full py-4 rounded-2xl font-bold text-[#1a1210] text-base"
            style={{ backgroundColor: '#c6beb8' }}
          >
            로그인
          </button>
        </div>
      </main>
    )
  }

  // ── 상세 모달 ─────────────────────────────
  const DetailModal = ({ app }: { app: Application }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setSelectedApp(null)}>
      <div
        className="bg-[#1a1210] w-full rounded-t-3xl p-5 pb-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-[#3a3230] rounded-full mx-auto mb-5" />

        <div className="flex justify-between items-start mb-5">
          <div>
            <p className="text-[#f5e2d4] font-bold text-lg">{app.name}</p>
            <p className="text-[#8F8781] text-sm">@{app.nickname}</p>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ backgroundColor: STATUS_COLOR[app.status] + '33', color: STATUS_COLOR[app.status] }}
          >
            {STATUS_LABEL[app.status]}
          </span>
        </div>

        {app.photo_url ? (
          <a href={app.photo_url} target="_blank" rel="noopener noreferrer" className="block mb-5">
            <img src={app.photo_url} alt="신청자 사진" className="w-full h-60 object-cover rounded-2xl" />
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
            ['출생년도', app.birth_year],
            ['직업', app.job],
            ['MBTI', app.mbti],
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
              onClick={() => updateStatus(app.id, s)}
              className={`py-4 rounded-2xl text-sm font-bold ${s === 'rejected' ? 'text-white' : 'text-[#1a1210]'} ${app.status === s ? 'ring-2 ring-white/30' : ''}`}
              style={{ backgroundColor: STATUS_COLOR[s] }}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // ── 스피너 ────────────────────────────────
  const Spinner = () => (
    <div className="flex justify-center pt-20">
      <div className="w-8 h-8 border-2 border-[#c6beb8]/20 border-t-[#c6beb8] rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex justify-center">
    <main className="w-full max-w-[390px] min-h-screen bg-[#1a1210] text-[#f5e2d4] relative" style={{ paddingBottom: '80px' }}>
      {selectedApp && <DetailModal app={selectedApp} />}

      {/* 헤더 */}
      <div className="sticky top-0 bg-[#1a1210] z-10 px-5 pt-12 pb-4 border-b border-[#2a2220]">
        <div className="flex items-center justify-between">
          <p className="text-[#c6beb8] font-bold text-xl tracking-widest">ADMIN</p>
          <p className="text-[#8F8781] text-xs">{TAB_ITEMS.find(t => t.key === tab)?.label}</p>
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
              <option value="confirmed">확정</option>
              <option value="rejected">거절</option>
            </select>
            <button
              onClick={fetchApplications}
              className="bg-[#c6beb8] text-[#1a1210] rounded-xl py-3 text-sm font-bold"
            >
              조회
            </button>
          </div>

          {/* 집계 */}
          <div className="px-4 py-3 grid grid-cols-3 gap-2">
            {(['pending', 'confirmed', 'rejected'] as const).map(s => (
              <div key={s} className="bg-[#2a2220] rounded-2xl py-4 text-center">
                <p className="text-xs mb-1" style={{ color: STATUS_COLOR[s] }}>{STATUS_LABEL[s]}</p>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === s).length}</p>
              </div>
            ))}
          </div>

          {/* 목록 */}
          {appsLoading ? <Spinner /> : applications.length === 0 ? (
            <p className="text-center text-[#8F8781] text-sm pt-20">신청 내역이 없습니다.</p>
          ) : (
            <div className="px-4 flex flex-col gap-2 pb-4">
              {applications.map(app => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className="w-full bg-[#2a2220] rounded-2xl p-4 text-left flex items-center gap-3 active:opacity-70"
                >
                  {app.photo_url ? (
                    <img src={app.photo_url} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#3a3230] flex items-center justify-center shrink-0">
                      <span className="text-[#8F8781] text-xl">{app.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-bold text-[#f5e2d4] truncate text-base">
                        {app.name} <span className="text-[#8F8781] font-normal text-sm">({app.nickname})</span>
                      </p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ backgroundColor: STATUS_COLOR[app.status] + '33', color: STATUS_COLOR[app.status] }}
                      >
                        {STATUS_LABEL[app.status]}
                      </span>
                    </div>
                    <p className="text-[#8F8781] text-xs">{app.date} · {app.gender} · {app.mbti}</p>
                    <p className="text-[#8F8781] text-xs truncate mt-0.5">{app.contact}</p>
                  </div>
                </button>
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
            <p className="text-[#c6beb8] font-bold text-sm mb-3">새 이벤트 추가</p>
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                  className="bg-[#1a1210] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                  className="bg-[#1a1210] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1a1210] rounded-xl px-3 py-3 flex items-center gap-2">
                  <span className="text-[#8F8781] text-xs">여성</span>
                  <input
                    type="number"
                    value={newEvent.female_seats}
                    onChange={e => setNewEvent(p => ({ ...p, female_seats: Number(e.target.value) }))}
                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                  />
                </div>
                <div className="bg-[#1a1210] rounded-xl px-3 py-3 flex items-center gap-2">
                  <span className="text-[#8F8781] text-xs">남성</span>
                  <input
                    type="number"
                    value={newEvent.male_seats}
                    onChange={e => setNewEvent(p => ({ ...p, male_seats: Number(e.target.value) }))}
                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                  />
                </div>
              </div>
              <button
                onClick={addEvent}
                disabled={!newEvent.date}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-[#1a1210] disabled:opacity-40"
                style={{ backgroundColor: '#c6beb8' }}
              >
                추가
              </button>
            </div>
          </div>

          {/* 이벤트 목록 */}
          {eventsLoading ? <Spinner /> : events.length === 0 ? (
            <p className="text-center text-[#8F8781] text-sm pt-10">등록된 이벤트가 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3 pb-4">
              {events.map(ev => {
                const display = getDisplaySeats(ev)
                const isEditing = editingId === ev.id
                return (
                  <div key={ev.id} className="bg-[#2a2220] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[#f5e2d4] font-bold text-base">{ev.date}</p>
                        <p className="text-[#8F8781] text-xs mt-0.5">{ev.time} 시작</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(isEditing ? null : ev.id)
                            setEditSeats({ female_seats: ev.female_seats, male_seats: ev.male_seats, time: ev.time })
                          }}
                          className="text-xs px-4 py-2 rounded-xl bg-[#3a3230] text-[#c6beb8]"
                        >
                          {isEditing ? '취소' : '수정'}
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="text-xs px-4 py-2 rounded-xl bg-[#3a3230] text-[#f87171]"
                        >
                          삭제
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col gap-2.5">
                        <input
                          type="time"
                          value={editSeats.time}
                          onChange={e => setEditSeats(p => ({ ...p, time: e.target.value }))}
                          className="bg-[#1a1210] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#1a1210] rounded-xl px-3 py-3 flex items-center gap-2">
                            <span className="text-[#8F8781] text-xs">여성</span>
                            <input
                              type="number"
                              value={editSeats.female_seats}
                              onChange={e => setEditSeats(p => ({ ...p, female_seats: Number(e.target.value) }))}
                              className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                            />
                          </div>
                          <div className="bg-[#1a1210] rounded-xl px-3 py-3 flex items-center gap-2">
                            <span className="text-[#8F8781] text-xs">남성</span>
                            <input
                              type="number"
                              value={editSeats.male_seats}
                              onChange={e => setEditSeats(p => ({ ...p, male_seats: Number(e.target.value) }))}
                              className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => saveEditEvent(ev.id)}
                          className="w-full py-3.5 rounded-xl text-sm font-bold text-[#1a1210]"
                          style={{ backgroundColor: '#c6beb8' }}
                        >
                          저장
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[#1a1210] rounded-xl p-3 text-center">
                          <p className="text-[#8F8781] text-xs mb-1">여성 잔여</p>
                          <p className="text-[#f5e2d4] text-2xl font-bold">{display.female}</p>
                          <p className="text-[#8F8781] text-xs mt-0.5">DB {ev.female_seats}</p>
                        </div>
                        <div className="bg-[#1a1210] rounded-xl p-3 text-center">
                          <p className="text-[#8F8781] text-xs mb-1">남성 잔여</p>
                          <p className="text-[#f5e2d4] text-2xl font-bold">{display.male}</p>
                          <p className="text-[#8F8781] text-xs mt-0.5">DB {ev.male_seats}</p>
                        </div>
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
          <p className="text-[#8F8781] text-xs mb-4">토글을 끄면 메인 페이지에서 해당 파티 카드가 숨겨집니다.</p>
          {partyLoading ? <Spinner /> : (
            <div className="flex flex-col gap-3">
              {[
                { type: 'introvert', label: '내향인 파티', sub: '얼그레이 · 말차 하이볼' },
                { type: 'wine', label: '와인 파티', sub: '레드 · 화이트 와인' },
              ].map(({ type, label, sub }) => {
                const setting = partySettings.find(p => p.party_type === type)
                const isVisible = setting?.is_visible ?? true
                return (
                  <div key={type} className="bg-[#2a2220] rounded-2xl p-5 flex items-center justify-between">
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

      {/* 하단 탭 바 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1210] border-t border-[#2a2220] flex z-20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TAB_ITEMS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${tab === key ? 'text-[#c6beb8]' : 'text-[#4a3e3a]'}`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </main>
    </div>
  )
}
