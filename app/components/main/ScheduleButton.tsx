'use client'

import { useRouter } from 'next/navigation'

interface ScheduleButtonProps {
  showWine: boolean
}

export default function ScheduleButton({ showWine }: ScheduleButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (showWine) {
      document.getElementById('party-cards')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/apply')
    }
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 w-[90%] left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full font-bold text-secondary text-[17px] text-center shadow-lg whitespace-nowrap"
      style={{ backgroundColor: '#c6beb8' }}
    >
      일정 확인하기
    </button>
  )
}
