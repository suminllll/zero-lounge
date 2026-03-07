'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, getDisplaySeats, type Event, type PartyType, PARTY_LABELS } from '@/lib/supabase'
import { useEvents } from '@/hooks/useEvents'
import { message } from 'antd'
import { Spinner } from './Spinner'
import { DAY_LABELS } from '../constants'

export function EventsTab() {
  const queryClient = useQueryClient()
  const nowDate = new Date()
  const [adminCalYear, setAdminCalYear] = useState(nowDate.getFullYear())
  const [adminCalMonth, setAdminCalMonth] = useState(nowDate.getMonth())

  const [newEvent, setNewEvent] = useState({
    date: '',
    time: '20:00',
    female_seats: 6,
    male_seats: 6,
    party_type: 'introvert' as PartyType,
    price: 45000,
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editSeats, setEditSeats] = useState({
    female_seats: 0,
    male_seats: 0,
    time: '',
    party_type: 'introvert' as PartyType,
    price: 45000,
  })

  const { data: events = [], isLoading } = useEvents(true)

  const eventDateSet = new Set(events.map(e => e.date))
  const adminDaysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate()
  const adminFirstDay = new Date(adminCalYear, adminCalMonth, 1).getDay()
  const adminMonthLabel = `${adminCalYear}년 ${adminCalMonth + 1}월`

  const addEvent = async (): Promise<boolean> => {
    if (!newEvent.date || !newEvent.time || isAdding) return false
    setIsAdding(true)
    const { error } = await supabase.from('events').insert(newEvent)
    setIsAdding(false)
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
      message.success('추가 되었습니다')
      return true
    } else {
      message.error('추가 실패: ' + error.message)
      return false
    }
  }

  const saveEditEvent = async (id: number) => {
    await supabase.from('events').update(editSeats).eq('id', id)
    setIsEditing(false)
    setSelectedEvent(prev => (prev ? { ...prev, ...editSeats } : null))
    queryClient.invalidateQueries({ queryKey: ['events'] })
    message.success('수정 되었습니다')
  }

  const deleteEvent = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await supabase.from('events').delete().eq('id', id)
    setSelectedEvent(null)
    queryClient.invalidateQueries({ queryKey: ['events'] })
  }

  const copyFromLast = () => {
    const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date))
    const last = sorted[0]
    if (!last) return
    setNewEvent(p => ({
      ...p,
      time: last.time,
      female_seats: last.female_seats,
      male_seats: last.male_seats,
      party_type: last.party_type,
      price: last.price,
    }))
    message.info('이전 파티에서 복사했습니다')
  }

  return (
    <div className="px-4 pt-4">
      {/* 달력 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (adminCalMonth === 0) {
                setAdminCalYear(y => y - 1)
                setAdminCalMonth(11)
              } else setAdminCalMonth(m => m - 1)
            }}
            className="text-[#c6beb8] px-2 text-xl leading-none"
          >
            ‹
          </button>
          <p className="text-[#f5e2d4] font-bold text-sm w-24 text-center">{adminMonthLabel}</p>
          <button
            onClick={() => {
              if (adminCalMonth === 11) {
                setAdminCalYear(y => y + 1)
                setAdminCalMonth(0)
              } else setAdminCalMonth(m => m + 1)
            }}
            className="text-[#c6beb8] px-2 text-xl leading-none"
          >
            ›
          </button>
        </div>
        <button
          onClick={() => {
            setNewEvent(p => ({ ...p, date: '' }))
            setShowAddModal(true)
          }}
          className="text-xs px-3 py-1.5 rounded-lg font-bold text-secondary"
          style={{ backgroundColor: '#c6beb8' }}
        >
          + Add
        </button>
      </div>

      {/* 달력 */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-[#2a2220] rounded-2xl p-3 mb-4">
          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map(d => (
              <p key={d} className="text-center text-[#8F8781] text-xs py-1">
                {d}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array(adminFirstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`e${i}`} />
              ))}
            {Array(adminDaysInMonth)
              .fill(null)
              .map((_, i) => {
                const day = i + 1
                const dateStr = `${adminCalYear}-${String(adminCalMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const hasEvent = eventDateSet.has(dateStr)
                return (
                  <button
                    key={day}
                    onClick={() => {
                      if (hasEvent) {
                        const ev = events.find(e => e.date === dateStr)!
                        setSelectedEvent(ev)
                        setEditSeats({
                          female_seats: ev.female_seats,
                          male_seats: ev.male_seats,
                          time: ev.time,
                          party_type: ev.party_type,
                          price: ev.price,
                        })
                        setIsEditing(false)
                      } else {
                        setNewEvent(p => ({ ...p, date: dateStr }))
                        setShowAddModal(true)
                      }
                    }}
                    className="aspect-square flex flex-col items-center justify-center rounded-full mx-auto w-9 relative active:opacity-70"
                  >
                    <span
                      className={`text-sm ${hasEvent ? 'text-[#c6beb8] font-bold' : 'text-[#8F8781]'}`}
                    >
                      {day}
                    </span>
                    {hasEvent && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#c6beb8]" />
                    )}
                  </button>
                )
              })}
          </div>
        </div>
      )}

      {/* 이벤트 상세/수정/삭제 (인라인) */}
      {selectedEvent && (
        <div className="bg-[#2a2220] rounded-2xl p-4 mb-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#c6beb8] font-bold text-sm">{selectedEvent.date}</p>
              <p className="text-[#8F8781] text-xs">
                {DAY_LABELS[new Date(selectedEvent.date + 'T00:00:00').getDay()]}요일 ·{' '}
                {PARTY_LABELS[selectedEvent.party_type]}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null)
                setIsEditing(false)
              }}
              className="text-[#8F8781] text-lg leading-none"
            >
              ✕
            </button>
          </div>

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
                    if (e.target.value === '45000') setEditSeats(p => ({ ...p, price: 45000 }))
                    else if (e.target.value === '49000') setEditSeats(p => ({ ...p, price: 49000 }))
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
                    onChange={e => setEditSeats(p => ({ ...p, price: Number(e.target.value) }))}
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
                      setEditSeats(p => ({ ...p, female_seats: Number(e.target.value) }))
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
                      setEditSeats(p => ({ ...p, male_seats: Number(e.target.value) }))
                    }
                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="py-3 rounded-xl text-sm font-bold bg-secondary text-[#c6beb8]"
                >
                  취소
                </button>
                <button
                  onClick={() => saveEditEvent(selectedEvent.id)}
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
                  <p className="text-[#f5e2d4] text-sm font-bold">{selectedEvent.time}</p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <p className="text-[#8F8781] text-xs mb-1">여성</p>
                  <p className="text-[#f5e2d4] text-xl font-bold">
                    {getDisplaySeats(selectedEvent).female}
                  </p>
                </div>
                <div className="bg-secondary rounded-xl p-3 text-center">
                  <p className="text-[#8F8781] text-xs mb-1">남성</p>
                  <p className="text-[#f5e2d4] text-xl font-bold">
                    {getDisplaySeats(selectedEvent).male}
                  </p>
                </div>
              </div>
              <div className="bg-secondary rounded-xl px-3 py-2.5 flex items-center justify-between">
                <span className="text-[#8F8781] text-xs">참가비</span>
                <span className="text-[#f5e2d4] text-sm font-medium">
                  {selectedEvent.price.toLocaleString()}원
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setEditSeats({
                      female_seats: selectedEvent.female_seats,
                      male_seats: selectedEvent.male_seats,
                      time: selectedEvent.time,
                      party_type: selectedEvent.party_type,
                      price: selectedEvent.price,
                    })
                    setIsEditing(true)
                  }}
                  className="py-3 rounded-xl text-sm font-bold bg-secondary text-[#c6beb8]"
                >
                  수정
                </button>
                <button
                  onClick={() => deleteEvent(selectedEvent.id)}
                  className="py-3 rounded-xl text-sm font-bold bg-secondary text-[#f87171]"
                >
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 새 파티 추가 모달 */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-[390px] bg-secondary rounded-t-3xl p-5 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[#c6beb8] font-bold">새 파티 추가</p>
              <div className="flex items-center gap-2">
                {events.length > 0 && (
                  <button
                    onClick={copyFromLast}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#3a3230] text-[#c6beb8] font-medium"
                  >
                    이전 복사
                  </button>
                )}
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#8F8781] text-xl leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))}
                  className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))}
                  className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
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
                  className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
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
                    else if (e.target.value === '49000') setNewEvent(p => ({ ...p, price: 49000 }))
                    else setNewEvent(p => ({ ...p, price: 0 }))
                  }}
                  className="bg-[#2a2220] rounded-xl px-3 py-3 text-[#f5e2d4] text-sm outline-none"
                >
                  <option value="45000">45,000원</option>
                  <option value="49000">49,000원</option>
                  <option value="custom">직접입력</option>
                </select>
              </div>
              {newEvent.price !== 45000 && newEvent.price !== 49000 && (
                <div className="bg-[#2a2220] rounded-xl px-3 py-3 flex items-center gap-2">
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
                <div className="bg-[#2a2220] rounded-xl px-3 py-3 flex items-center gap-2">
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
                <div className="bg-[#2a2220] rounded-xl px-3 py-3 flex items-center gap-2">
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
                onClick={async () => {
                  const ok = await addEvent()
                  if (ok) setShowAddModal(false)
                }}
                disabled={!newEvent.date || isAdding}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                style={{ backgroundColor: '#c6beb8' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
