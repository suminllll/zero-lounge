'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ScheduleButtonProps {
  showWine: boolean
}

export default function ScheduleButton({ showWine }: ScheduleButtonProps) {
  const router = useRouter()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      setHidden(scrolled >= total - 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      className={`fixed bottom-6 w-[90%] max-w-[350px] left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-full font-bold text-secondary text-base text-center shadow-lg whitespace-nowrap transition-all duration-300 ${hidden ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'}`}
      style={{ backgroundColor: '#c6beb8' }}
    >
      일정 확인하기
    </button>
  )
}
