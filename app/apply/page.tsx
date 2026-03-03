'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { IoChevronBack } from 'react-icons/io5'
import { supabase, getDisplaySeats, type Event } from '@/lib/supabase'

type FormData = {
  date: string
  gender: string
  name: string
  nickname: string
  birthYear: string
  job: string
  mbti: string
  photo: File | null
  contact: string
  referral: string
}

const TOTAL_STEPS = 13
const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    date: '',
    gender: '',
    name: '',
    nickname: '',
    birthYear: '',
    job: '',
    mbti: '',
    photo: null,
    contact: '',
    referral: '',
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supabase에서 이벤트 불러오기
  const [events, setEvents] = useState<Event[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (data) setEvents(data as Event[])
      setEventsLoading(false)
    }
    loadEvents()
  }, [])

  // 날짜 → 이벤트 맵
  const eventsMap = Object.fromEntries(events.map(e => [e.date, e]))

  // 선택된 날짜의 이벤트 + 표시용 잔여좌석
  const selectedEvent = formData.date ? eventsMap[formData.date] : null
  const displaySeats = selectedEvent ? getDisplaySeats(selectedEvent) : null

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => Math.max(1, s - 1))

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      let photoUrl: string | null = null

      if (formData.photo) {
        const ext = formData.photo.name.split('.').pop()
        const fileName = `${Date.now()}-${formData.contact.replace(/[^0-9]/g, '')}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, formData.photo)

        if (uploadError) {
          console.error('Photo upload error:', uploadError)
        } else {
          const { data: urlData } = supabase.storage.from('photos').getPublicUrl(uploadData.path)
          photoUrl = urlData.publicUrl
        }
      }

      const { error } = await supabase.from('applications').insert({
        date: formData.date,
        gender: formData.gender,
        name: formData.name,
        nickname: formData.nickname,
        birth_year: formData.birthYear,
        job: formData.job,
        mbti: formData.mbti,
        photo_url: photoUrl,
        contact: formData.contact,
        referral: formData.referral,
        status: 'pending',
      })

      if (error) {
        console.error('Submit error:', error)
        alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
        setIsLoading(false)
        return
      }

      setIsLoading(false)
      setIsComplete(true)
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsLoading(false)
    }
  }

  // 캘린더 계산
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthLabel = `${year}년 ${month + 1}월`

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const isDateSelectable = (dateStr: string) => {
    const event = eventsMap[dateStr]
    if (!event) return false
    const today = new Date().toISOString().split('T')[0]
    if (dateStr < today) return false
    const display = getDisplaySeats(event)
    return display.female > 0 || display.male > 0
  }

  const isAdult =
    formData.birthYear.length === 4 &&
    new Date().getFullYear() - parseInt(formData.birthYear) >= 19

  // 로딩 화면
  if (isLoading) {
    return (
      <main className="bg-secondary min-h-screen flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-5">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-[#c6beb8] rounded-full animate-spin" />
          <p className="text-[#c6beb8] text-sm">제출 중...</p>
        </div>
      </main>
    )
  }

  // 완료 화면
  if (isComplete) {
    return (
      <main className="bg-secondary min-h-screen flex flex-col items-center justify-center px-6 text-center gap-8">
        <div className="text-5xl">☺️</div>
        <div>
          <p className="text-[#f5e2d4] text-2xl font-bold mb-8">제로라운지 신청 완료</p>
          <p className="text-[#c6beb8] text-[15px] leading-8 font-light">
            장소는 공덕역에서 도보 10분 이내 거리예요!
            <br />
            <br />
            안전을 위해 상세 위치는
            <br />
            DM 보내주시는 분께 안내해 드릴 예정입니다 :)
            <br />
            <br />
            그럼, 우리 곧 봐요 ☺️
          </p>
        </div>
        <Link
          href="/"
          className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px]"
          style={{ backgroundColor: '#c6beb8' }}
        >
          홈으로
        </Link>
      </main>
    )
  }

  return (
    <main className="bg-secondary min-h-screen text-primary">
      {/* 상단 진행바 */}
      <div className="sticky top-0 z-10 bg-secondary pt-4 pb-3 px-5">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button onClick={back} className="text-[#c6beb8] shrink-0">
              <IoChevronBack size={24} />
            </button>
          ) : (
            <Link href="/" className="text-[#c6beb8] shrink-0">
              <IoChevronBack size={24} />
            </Link>
          )}
          <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c6beb8] rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className="text-[#8F8781] text-xs shrink-0">
            {step}/{TOTAL_STEPS}
          </span>
        </div>
      </div>

      <div className="px-5 py-8">
        {/* Step 1: 달력 */}
        {step === 1 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-8">날짜를 선택해주세요</h2>
            {eventsLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[#c6beb8]/20 border-t-[#c6beb8] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-[#c6beb8] text-center text-sm font-bold mb-4">{monthLabel}</p>
                <div className="grid grid-cols-7 mb-2">
                  {DAY_LABELS.map(d => (
                    <div key={d} className="text-center text-[#8F8781] text-xs py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {Array(firstDay).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                  {Array(daysInMonth).fill(null).map((_, i) => {
                    const day = i + 1
                    const dateStr = formatDate(day)
                    const selectable = isDateSelectable(dateStr)
                    const isSelected = formData.date === dateStr
                    return (
                      <button
                        key={day}
                        onClick={() => selectable && setFormData(f => ({ ...f, date: dateStr }))}
                        disabled={!selectable}
                        className={`aspect-square rounded-full text-sm flex items-center justify-center mx-auto w-9
                          ${isSelected ? 'text-secondary font-bold' : ''}
                          ${selectable && !isSelected ? 'text-[#f5e2d4] font-medium' : ''}
                          ${!selectable ? 'text-primary/25' : ''}
                        `}
                        style={isSelected ? { backgroundColor: '#c6beb8' } : {}}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
            <button
              onClick={next}
              disabled={!formData.date}
              className="mt-10 block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 2: 잔여 자리 + 시작 시간 */}
        {step === 2 && selectedEvent && displaySeats && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-1">선택한 날짜</h2>
            <p className="text-[#8F8781] text-sm mb-8">{formData.date.replace(/-/g, '.')}</p>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 bg-primary/10 rounded-2xl p-5 text-center">
                <p className="text-[#8F8781] text-xs mb-2">여성 잔여</p>
                <p className="text-[#f5e2d4] text-4xl font-bold">{displaySeats.female}</p>
                <p className="text-[#8F8781] text-xs mt-1">자리</p>
              </div>
              <div className="flex-1 bg-primary/10 rounded-2xl p-5 text-center">
                <p className="text-[#8F8781] text-xs mb-2">남성 잔여</p>
                <p className="text-[#f5e2d4] text-4xl font-bold">{displaySeats.male}</p>
                <p className="text-[#8F8781] text-xs mt-1">자리</p>
              </div>
            </div>
            <div className="bg-primary/10 rounded-2xl p-5 text-center mb-10">
              <p className="text-[#8F8781] text-xs mb-1">시작 시간</p>
              <p className="text-[#f5e2d4] text-3xl font-bold">{selectedEvent.time}</p>
            </div>
            <button
              onClick={next}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px]"
              style={{ backgroundColor: '#c6beb8' }}
            >
              신청하기
            </button>
          </div>
        )}

        {/* Step 3: 성별 */}
        {step === 3 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-10">성별을 선택해주세요</h2>
            <div className="flex gap-4 mb-10">
              {['여성', '남성'].map(g => (
                <button
                  key={g}
                  onClick={() => setFormData(f => ({ ...f, gender: g }))}
                  className={`flex-1 py-8 rounded-2xl text-lg font-bold transition-all
                    ${formData.gender === g ? 'text-secondary' : 'text-[#c6beb8] bg-primary/10'}`}
                  style={formData.gender === g ? { backgroundColor: '#c6beb8' } : {}}
                >
                  {g}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!formData.gender}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 4: 실명 */}
        {step === 4 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-2">실명을 알려주세요</h2>
            <p className="text-[#8F8781] text-sm mb-8">본인 확인에 사용됩니다.</p>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              placeholder="홍길동"
              className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none mb-10"
            />
            <button
              onClick={next}
              disabled={!formData.name.trim()}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 5: 닉네임 */}
        {step === 5 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-2">모임에서 사용할 닉네임을<br />알려주세요</h2>
            <p className="text-[#8F8781] text-sm mb-8">이름 대신 불릴 닉네임이에요.</p>
            <input
              type="text"
              value={formData.nickname}
              onChange={e => setFormData(f => ({ ...f, nickname: e.target.value }))}
              placeholder="닉네임"
              className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none mb-10"
            />
            <button
              onClick={next}
              disabled={!formData.nickname.trim()}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 6: 출생년도 */}
        {step === 6 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-2">출생년도 4자리를<br />기입해주세요</h2>
            <p className="text-[#8F8781] text-sm mb-1">ex. 1997</p>
            <p className="text-[#8F8781] text-xs mb-8">* 미성년자는 참가할 수 없습니다.</p>
            <input
              type="number"
              value={formData.birthYear}
              onChange={e => {
                const val = e.target.value.slice(0, 4)
                setFormData(f => ({ ...f, birthYear: val }))
              }}
              placeholder="1997"
              className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none mb-2"
            />
            {formData.birthYear.length === 4 && !isAdult && (
              <p className="text-red-400 text-sm mb-4">미성년자는 참가할 수 없습니다.</p>
            )}
            <div className="mb-8" />
            <button
              onClick={next}
              disabled={!isAdult}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 7: 직업 + MBTI */}
        {step === 7 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-8">직업과 MBTI를<br />알려주세요</h2>
            <div className="flex flex-col gap-4 mb-10">
              <input
                type="text"
                value={formData.job}
                onChange={e => setFormData(f => ({ ...f, job: e.target.value }))}
                placeholder="직업 (ex. 개발자, 디자이너)"
                className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none"
              />
              <input
                type="text"
                value={formData.mbti}
                onChange={e => setFormData(f => ({ ...f, mbti: e.target.value.toUpperCase().slice(0, 4) }))}
                placeholder="MBTI (ex. INFJ)"
                className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none"
              />
            </div>
            <button
              onClick={next}
              disabled={!formData.job.trim() || formData.mbti.length !== 4}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 8: 사진 */}
        {step === 8 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-2">본인 확인을 위해<br />최근 사진 한 장을 첨부해주세요</h2>
            <p className="text-[#8F8781] text-xs mb-8">* 앞/옆모습 가능, 뒷모습은 불가능합니다.</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-52 bg-primary/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer mb-10 overflow-hidden"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="미리보기" className="w-full h-full object-cover" />
              ) : (
                <>
                  <p className="text-[#c6beb8] text-4xl mb-2">+</p>
                  <p className="text-[#c6beb8] text-sm">사진 선택</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  setFormData(f => ({ ...f, photo: file }))
                  setPhotoPreview(URL.createObjectURL(file))
                }
              }}
            />
            <button
              onClick={next}
              disabled={!formData.photo}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 9: 연락처 */}
        {step === 9 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-2">모임 참여에 대한 안내를 받아보실<br />연락처를 알려주세요</h2>
            <p className="text-[#8F8781] text-sm mb-8">카카오톡 또는 문자로 안내드려요.</p>
            <input
              type="tel"
              value={formData.contact}
              onChange={e => setFormData(f => ({ ...f, contact: e.target.value }))}
              placeholder="010-0000-0000"
              className="w-full bg-primary/10 rounded-2xl px-5 py-4 text-[#f5e2d4] text-base placeholder:text-primary/30 outline-none mb-10"
            />
            <button
              onClick={next}
              disabled={formData.contact.replace(/-/g, '').replace(/ /g, '').length < 10}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 10: 유입 경로 */}
        {step === 10 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-8">제로라운지를<br />어디서 보고 오셨나요?</h2>
            <div className="flex flex-col gap-3 mb-10">
              {['인스타그램 릴스', '인스타그램 광고', '스레드', '기타'].map(option => (
                <button
                  key={option}
                  onClick={() => setFormData(f => ({ ...f, referral: option }))}
                  className={`w-full py-4 rounded-2xl text-base font-medium transition-all
                    ${formData.referral === option ? 'text-secondary font-bold' : 'text-[#c6beb8] bg-primary/10'}`}
                  style={formData.referral === option ? { backgroundColor: '#c6beb8' } : {}}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!formData.referral}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px] disabled:opacity-40"
              style={{ backgroundColor: '#c6beb8' }}
            >
              다음
            </button>
          </div>
        )}

        {/* Step 11: 환불 안내 */}
        {step === 11 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-6">환불 안내</h2>
            <div className="bg-primary/10 rounded-2xl p-6 text-[#c6beb8] text-[14px] leading-7 mb-8">
              <p className="font-bold text-[#f5e2d4] mb-3">제로라운지에서는</p>
              <p className="mb-4">
                신청서를 신중히 검토한 후,<br />
                모임에 어울리는 분들만 초대합니다.
              </p>
              <p className="mb-6">
                신청 조건에 부합하지 않거나,<br />
                신청 인원이 초과될 경우<br />
                선정에서 제외될 수 있습니다.<br />
                <span className="text-xs text-[#8F8781]">(해당 경우에는 전액 환불 됩니다.)</span>
              </p>
              <div className="border-t border-primary/20 pt-4 flex flex-col gap-1">
                <p>4일 전 전액환불</p>
                <p>3일 전 70% 환불</p>
                <p>2일 전 50% 환불</p>
                <p className="font-semibold text-[#f5e2d4]">당일 및 전날 환불 불가</p>
              </div>
            </div>
            <button
              onClick={next}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px]"
              style={{ backgroundColor: '#c6beb8' }}
            >
              환불 정책에 동의합니다
            </button>
          </div>
        )}

        {/* Step 12: 참가비 */}
        {step === 12 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-6">참가비 안내</h2>
            <div className="bg-primary/10 rounded-2xl p-6 text-[#c6beb8] text-[14px] leading-7 mb-8">
              <div className="text-center mb-6">
                <p className="text-[#8F8781] text-xs mb-2">참가비</p>
                <p className="text-[#f5e2d4] text-4xl font-bold">45,000원</p>
              </div>
              <div className="border-t border-primary/20 pt-5">
                <p className="text-[#8F8781] text-xs mb-1">입금 계좌</p>
                <p className="text-[#f5e2d4] font-semibold text-base">우리은행</p>
                <p className="text-[#f5e2d4] font-semibold text-base">1002-164-275949</p>
              </div>
              <div className="border-t border-primary/20 mt-5 pt-4 text-xs leading-6">
                <p>입금 완료 시 신청이 확정됩니다.</p>
                <p className="text-[#8F8781]">* 입금이 지연될 경우, 신청서를 다시 작성하셔야 합니다.</p>
              </div>
            </div>
            <button
              onClick={next}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px]"
              style={{ backgroundColor: '#c6beb8' }}
            >
              네, 확인했습니다!
            </button>
          </div>
        )}

        {/* Step 13: 필독 + 제출 */}
        {step === 13 && (
          <div>
            <h2 className="text-[#f5e2d4] text-xl font-bold mb-6">▪️ 필독사항 ▪️</h2>
            <div className="bg-primary/10 rounded-2xl p-6 text-[#c6beb8] text-[14px] leading-7 mb-8">
              <p className="mb-4">
                인스타 계정(<span className="text-[#f5e2d4] font-semibold">@zero__lounge</span>)를<br />
                팔로우한 뒤,<br />
                아래 내용을 DM으로 보내주셔야<br />
                신청이 완료됩니다.
              </p>
              <div className="bg-secondary/60 rounded-xl p-4 mb-4">
                <p className="text-[#f5e2d4] font-semibold">입금자명,</p>
                <p className="text-[#f5e2d4] font-semibold">참여 날짜</p>
                <p className="text-[#8F8781] text-xs mt-1">(ex. 홍길동 10/3 금요일)</p>
              </div>
              <p className="text-xs text-[#8F8781] leading-5">
                * DM이 확인되지 않을 경우,<br />
                모임 입장이 제한될 수 있습니다.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="block w-full py-4 rounded-2xl text-center font-bold text-secondary text-[17px]"
              style={{ backgroundColor: '#c6beb8' }}
            >
              신청서 작성, 입금 후 인스타 DM
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
