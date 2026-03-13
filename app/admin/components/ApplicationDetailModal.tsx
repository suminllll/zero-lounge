'use client'

import { useState } from 'react'
import Image from 'next/image'
import { message } from 'antd'
import type { Application } from '@/lib/supabase'
import { STATUS_LABEL, STATUS_COLOR, buildConfirmMessage } from '../constants'
import { logError } from '@/lib/logError'
import { supabase } from '@/lib/supabase'

interface Props {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: number, status: Application['status']) => void
  onDelete: (id: number) => void
  onChangeDate: (id: number, newDate: string) => Promise<void>
  onSmsSent: (id: number) => void
}

export function ApplicationDetailModal({
  app,
  onClose,
  onUpdateStatus,
  onDelete,
  onChangeDate,
  onSmsSent,
}: Props) {
  const [smsPrice, setSmsPrice] = useState(45000)
  const [smsSending, setSmsSending] = useState(false)
  const [showSms, setShowSms] = useState(false)
  const [newDate, setNewDate] = useState(app.date)
  const [dateChanging, setDateChanging] = useState(false)
  const [showDateChange, setShowDateChange] = useState(false)
  const [memo, setMemo] = useState(app.memo ?? '')
  const [memoEditing, setMemoEditing] = useState(false)
  const [memoSaving, setMemoSaving] = useState(false)
  const [showMemo, setShowMemo] = useState(false)

  const handleSaveMemo = async () => {
    setMemoSaving(true)
    await supabase.from('applications').update({ memo }).eq('id', app.id)
    setMemoSaving(false)
    setMemoEditing(false)
  }

  const handleDeleteMemo = async () => {
    setMemoSaving(true)
    await supabase.from('applications').update({ memo: null }).eq('id', app.id)
    setMemo('')
    setMemoSaving(false)
    setMemoEditing(false)
  }

  const handleSendSms = async () => {
    if (!app.contact) {
      message.error('연락처가 없습니다')
      return
    }
    setSmsSending(true)
    try {
      const res = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: app.contact,
          content: buildConfirmMessage({ name: app.name, date: app.date, price: smsPrice }),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        message.success(`발송 완료 (${data.data?.statusCode} ${data.data?.statusName ?? ''})`)
        await supabase.from('applications').update({ sms_sent: true }).eq('id', app.id)
        onSmsSent(app.id)
      } else {
        const errMsg = data.error?.message ?? JSON.stringify(data.error)
        message.error(`발송 실패: ${errMsg}`)
        logError('/admin', `SMS 발송 실패: ${errMsg}`)
      }
    } catch (e) {
      message.error('발송 중 오류가 발생했습니다')
      logError('/admin', 'SMS 발송 중 예외', e instanceof Error ? e.stack : String(e))
    } finally {
      setSmsSending(false)
    }
  }

  const handleChangeDate = async () => {
    if (newDate === app.date) return
    setDateChanging(true)
    await onChangeDate(app.id, newDate)
    setDateChanging(false)
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-secondary w-full max-w-[390px] rounded-t-3xl p-5 pb-10 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#3a3230] rounded-full mx-auto mb-5" />

        <div className="flex justify-between items-start mb-5">
          <p className="text-[#f5e2d4] font-bold text-lg">{app.name}</p>
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
          <a href={app.photo_url} target="_blank" rel="noopener noreferrer" className="block mb-3">
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
          <div className="w-full h-24 bg-[#2a2220] rounded-2xl flex items-center justify-center mb-3">
            <p className="text-[#4a3e3a] text-sm">사진 없음</p>
          </div>
        )}

        {/* 상태 버튼 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => onUpdateStatus(app.id, 'confirmed')}
            className={`py-4 rounded-2xl text-sm font-bold text-secondary ${app.status === 'confirmed' ? 'ring-2 ring-white/30' : ''}`}
            style={{ backgroundColor: STATUS_COLOR['confirmed'] }}
          >
            확정
          </button>
          <button
            onClick={() => onDelete(app.id)}
            className="py-4 rounded-2xl text-sm font-bold text-[#f87171] bg-[#f87171]/20"
          >
            삭제
          </button>
          <button
            onClick={() => onUpdateStatus(app.id, 'pending')}
            className={`py-4 rounded-2xl text-sm font-bold text-secondary ${app.status === 'pending' ? 'ring-2 ring-white/30' : ''}`}
            style={{ backgroundColor: STATUS_COLOR['pending'] }}
          >
            대기
          </button>
        </div>

        <div className="bg-[#2a2220] rounded-2xl p-4 flex flex-col gap-3 text-sm mb-4">
          {[
            ['신청 날짜', app.date],
            ['성별', app.gender],
            ['닉네임', app.nickname],
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

        {/* 문자 발송 */}
        <div className="bg-[#2a2220] rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowSms(p => !p)}
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          >
            <span className="text-[#c6beb8] text-sm font-medium">문자 발송</span>
            <span
              className={`text-[#8F8781] text-xs transition-transform duration-200 ${showSms ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          {showSms && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="flex-1 bg-secondary rounded-xl px-3 py-2.5 flex items-center gap-1.5">
                  <span className="text-[#8F8781] text-xs shrink-0">참가비</span>
                  <input
                    type="number"
                    value={smsPrice}
                    onChange={e => setSmsPrice(Number(e.target.value))}
                    className="w-full bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                  />
                  <span className="text-[#8F8781] text-xs shrink-0">원</span>
                </div>
                <button
                  onClick={handleSendSms}
                  disabled={smsSending}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                  style={{ backgroundColor: '#c6beb8' }}
                >
                  {smsSending ? '...' : '발송'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 날짜 변경 */}
        <div className="bg-[#2a2220] rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowDateChange(p => !p)}
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          >
            <span className="text-[#c6beb8] text-sm font-medium">일정 변경</span>
            <span
              className={`text-[#8F8781] text-xs transition-transform duration-200 ${showDateChange ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          {showDateChange && (
            <div className="px-4 pb-4 flex gap-2">
              <input
                type="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="flex-1 bg-secondary rounded-xl px-3 py-2.5 text-[#f5e2d4] text-sm outline-none"
              />
              <button
                onClick={handleChangeDate}
                disabled={newDate === app.date || dateChanging}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                style={{ backgroundColor: '#c6beb8' }}
              >
                {dateChanging ? '...' : '변경'}
              </button>
            </div>
          )}
        </div>

        {/* 메모 */}
        <div className="bg-[#2a2220] rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowMemo(p => !p)}
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          >
            <span className="text-[#c6beb8] text-sm font-medium">메모</span>
            <span
              className={`text-[#8F8781] text-xs transition-transform duration-200 ${showMemo ? 'rotate-180' : ''}`}
            >
              ▾
            </span>
          </button>
          {showMemo && (
            <div className="px-4 pb-4 flex flex-col gap-2">
              {memoEditing ? (
                <>
                  <textarea
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                    placeholder="메모를 입력하세요"
                    rows={3}
                    autoFocus
                    className="bg-secondary rounded-xl px-3 py-2.5 text-[#f5e2d4] text-sm outline-none resize-none placeholder:text-[#4a3e3a]"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveMemo}
                      disabled={memoSaving}
                      className="flex-1 py-2 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                      style={{ backgroundColor: '#c6beb8' }}
                    >
                      {memoSaving ? '...' : '저장'}
                    </button>
                    <button
                      onClick={handleDeleteMemo}
                      disabled={memoSaving}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-[#f87171] bg-[#f87171]/20 disabled:opacity-40"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => {
                        setMemo(app.memo ?? '')
                        setMemoEditing(false)
                      }}
                      className="px-4 py-2 rounded-xl text-sm text-[#8F8781] bg-secondary"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[#f5e2d4] text-sm whitespace-pre-wrap min-h-8">
                    {memo || <span className="text-[#4a3e3a]">메모 없음</span>}
                  </p>
                  <button
                    onClick={() => setMemoEditing(true)}
                    className="self-start text-[#8F8781] text-xs px-2 py-1 rounded-lg bg-secondary active:opacity-70"
                  >
                    수정
                  </button>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
