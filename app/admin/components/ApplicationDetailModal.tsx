import Image from 'next/image'
import type { Application } from '@/lib/supabase'
import { STATUS_LABEL, STATUS_COLOR } from '../constants'

interface Props {
  app: Application
  onClose: () => void
  onUpdateStatus: (id: number, status: Application['status']) => void
  onDelete: (id: number) => void
}

export function ApplicationDetailModal({ app, onClose, onUpdateStatus, onDelete }: Props) {
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

        <div className="bg-[#2a2220] rounded-2xl p-4 flex flex-col gap-3 text-sm mb-5">
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
