'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase, type Application } from '@/lib/supabase'
import { useApplications } from '@/hooks/useApplications'
import { message } from 'antd'
import Image from 'next/image'
import { Spinner } from './Spinner'
import { ApplicationDetailModal } from './ApplicationDetailModal'
import { STATUS_LABEL, STATUS_COLOR, getDayLabel } from '../constants'

export function ApplicationsTab() {
  const queryClient = useQueryClient()
  const [filterDate, setFilterDate] = useState('')
  const [filterGender, setFilterGender] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [showPastDates, setShowPastDates] = useState(false)

  const kstToday = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]

  const toggleDate = (date: string) => setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }))

  const { data: applications = [], isLoading } = useApplications(true, {
    date: filterDate,
    gender: filterGender,
    status: filterStatus,
  })

  const handleCopy = async (app: Application, e: React.MouseEvent) => {
    e.stopPropagation()
    const gender = app.gender === '여성' ? '여' : '남'
    await navigator.clipboard.writeText(
      `${gender}/${app.nickname}/${app.birth_year} ${app.name}(인스타)`
    )
    setCopiedId(app.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const updateStatus = async (id: number, status: Application['status']) => {
    await supabase.from('applications').update({ status }).eq('id', id)
    if (selectedApp?.id === id) setSelectedApp(prev => (prev ? { ...prev, status } : null))
    queryClient.invalidateQueries({ queryKey: ['applications'] })
    message.success(`${STATUS_LABEL[status]} 되었습니다`)
  }

  const deleteApplication = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await supabase.from('applications').delete().eq('id', id)
    if (error) {
      message.error(`삭제 실패: ${error.message}`)
      return
    }
    setSelectedApp(null)
    queryClient.invalidateQueries({ queryKey: ['applications'] })
  }

  return (
    <>
      {selectedApp && (
        <ApplicationDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={updateStatus}
          onDelete={deleteApplication}
        />
      )}

      {/* 필터 */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
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
          </select>
          <button
            onClick={() => {
              setFilterDate('')
              setFilterGender('')
              setFilterStatus('')
            }}
            className="bg-[#2a2220] text-[#8F8781] rounded-xl py-3 text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 집계 */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        <div className="bg-[#2a2220] rounded-2xl py-4 text-center">
          <p className="text-xs mb-1 text-[#8F8781]">전체</p>
          <p className="text-2xl font-bold">{applications.length}</p>
        </div>
        {(['confirmed', 'pending'] as const).map(s => (
          <div key={s} className="bg-[#2a2220] rounded-2xl py-4 text-center">
            <p className="text-xs mb-1" style={{ color: STATUS_COLOR[s] }}>
              {STATUS_LABEL[s]}
            </p>
            <p className="text-2xl font-bold">{applications.filter(a => a.status === s).length}</p>
          </div>
        ))}
      </div>

      {/* 목록 */}
      {isLoading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <p className="text-center text-[#8F8781] text-sm pt-20">신청 내역이 없습니다.</p>
      ) : (
        <div className="px-4 flex flex-col gap-2 pb-4">
          {(() => {
            const grouped = Object.entries(
              applications.reduce<Record<string, Application[]>>((acc, app) => {
                ;(acc[app.date] ??= []).push(app)
                return acc
              }, {})
            ).sort(([a], [b]) => a.localeCompare(b))

            const upcomingGroups = grouped.filter(([date]) => date >= kstToday)
            const pastGroups = grouped.filter(([date]) => date < kstToday)

            const renderDateGroup = ([date, rawApps]: [string, Application[]]) => {
              const dateApps = [...rawApps].sort((a, b) => b.created_at.localeCompare(a.created_at))
              const isOpen = !!expandedDates[date]
              const confirmed = dateApps.filter(a => a.status === 'confirmed').length
              const pending = dateApps.filter(a => a.status === 'pending').length
              return (
                <div key={date} className="flex flex-col gap-1.5">
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full bg-[#2a2220] rounded-2xl px-4 py-3.5 flex items-center justify-between active:opacity-70"
                  >
                    <div className="flex items-center gap-2.5">
                      <p className="text-[#f5e2d4] font-bold text-sm">{date}</p>
                      <span className="text-[#8F8781] text-xs">({getDayLabel(date)})</span>
                      <span className="text-[#8F8781] text-xs">{dateApps.length}명</span>
                      <span className="text-xs text-[#c6beb8]">확정 {confirmed}</span>
                      <span className="text-xs text-[#4ade80]">대기 {pending}</span>
                    </div>
                    <span
                      className={`text-[#8F8781] text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-1.5 pl-2">
                      {dateApps.map(app => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApp(app)}
                          className="w-full bg-[#2a2220] rounded-2xl p-4 text-left flex items-center gap-3 active:opacity-70 cursor-pointer"
                        >
                          {app.photo_url ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                              <Image
                                src={app.photo_url}
                                alt={app.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#3a3230] flex items-center justify-center shrink-0">
                              <span className="text-[#8F8781] text-base">{app.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-[#f5e2d4] truncate text-base mb-1">
                              {app.name}
                            </p>
                            <p className="text-[#8F8781] text-xs">
                              {app.gender} · {app.nickname || app.birth_year}
                            </p>
                          </div>
                          <span
                            className="text-xs font-bold px-2 py-1 rounded-full shrink-0"
                            style={{
                              backgroundColor: STATUS_COLOR[app.status] + '33',
                              color: STATUS_COLOR[app.status],
                            }}
                          >
                            {STATUS_LABEL[app.status]}
                          </span>
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
                </div>
              )
            }

            return (
              <>
                {upcomingGroups.map(renderDateGroup)}

                {pastGroups.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <button
                      onClick={() => setShowPastDates(prev => !prev)}
                      className="w-full bg-[#1e1a18] rounded-2xl px-4 py-3.5 flex items-center justify-between active:opacity-70"
                    >
                      <div className="flex items-center gap-2.5">
                        <p className="text-[#8F8781] font-bold text-sm">지난 일정</p>
                        <span className="text-[#4a3e3a] text-xs">
                          {pastGroups.length}개 일정 ·{' '}
                          {pastGroups.reduce((sum, [, apps]) => sum + apps.length, 0)}명
                        </span>
                      </div>
                      <span
                        className={`text-[#4a3e3a] text-xs transition-transform duration-200 ${showPastDates ? 'rotate-180' : ''}`}
                      >
                        ▾
                      </span>
                    </button>

                    {showPastDates && (
                      <div className="flex flex-col gap-1.5">
                        {pastGroups.map(renderDateGroup)}
                      </div>
                    )}
                  </div>
                )}
              </>
            )
          })()}
        </div>
      )}
    </>
  )
}
