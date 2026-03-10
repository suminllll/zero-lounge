'use client'

import { useState } from 'react'
import Image from 'next/image'
import { message } from 'antd'
import type { Application } from '@/lib/supabase'
import { STATUS_LABEL, STATUS_COLOR, buildConfirmMessage } from '../constants'

interface Props {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: number, status: Application['status']) => void
  onDelete: (id: number) => void
  onChangeDate: (id: number, newDate: string) => Promise<void>
}

export function ApplicationDetailModal({
  app,
  onClose,
  onUpdateStatus,
  onDelete,
  onChangeDate,
}: Props) {
  const [smsPrice, setSmsPrice] = useState(45000)
  const [smsSending, setSmsSending] = useState(false)
  const [showSms, setShowSms] = useState(false)
  const [newDate, setNewDate] = useState(app.date)
  const [dateChanging, setDateChanging] = useState(false)
  const [showDateChange, setShowDateChange] = useState(false)

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
      } else {
        message.error(`발송 실패: ${data.error?.message ?? JSON.stringify(data.error)}`)
      }
    } catch {
      message.error('발송 중 오류가 발생했습니다')
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

        {/* 날짜 변경 */}
        <div className="bg-[#2a2220] rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowDateChange(p => !p)}
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          >
            <span className="text-[#c6beb8] text-sm font-medium">일정 변경</span>
            <span className={`text-[#8F8781] text-xs transition-transform duration-200 ${showDateChange ? 'rotate-180' : ''}`}>▾</span>
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

        {/* 문자 발송 */}
        <div className="bg-[#2a2220] rounded-2xl mb-4 overflow-hidden">
          <button
            onClick={() => setShowSms(p => !p)}
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          >
            <span className="text-[#c6beb8] text-sm font-medium">확정 문자 발송</span>
            <span className={`text-[#8F8781] text-xs transition-transform duration-200 ${showSms ? 'rotate-180' : ''}`}>▾</span>
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
                    className="flex-1 bg-transparent text-[#f5e2d4] text-sm outline-none min-w-0"
                  />
                  <span className="text-[#8F8781] text-xs shrink-0">원</span>
                </div>
                <button
                  onClick={handleSendSms}
                  disabled={smsSending}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-secondary disabled:opacity-40"
                  style={{ backgroundColor: '#c6beb8' }}
                >
                  {smsSending ? '...' : '발송'}
                </button>
              </div>
              <p className="text-[#4a3e3a] text-xs leading-relaxed whitespace-pre-wrap">
                {buildConfirmMessage({ name: app.name, date: app.date, price: smsPrice })}
              </p>
            </div>
          )}
        </div>

        {/* 상태 버튼 */}
        <div className="grid grid-cols-3 gap-2">
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
      </div>
    </div>
  )
}
