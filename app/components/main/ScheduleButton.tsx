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
      const nearBottom = scrolled >= total - 80

      const isVisible = (id: string) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      }

      setHidden(nearBottom || isVisible('main_apply_btn') || isVisible('hero_apply_btn') || isVisible('gallery_apply_btn'))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
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
      id="main_float_apply_btn"
    >
      이번주 잔여셕 확인하기
    </button>
  )
}
