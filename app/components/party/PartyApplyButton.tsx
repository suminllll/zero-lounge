'use client'

import { useEffect, useRef, useState } from 'react'

interface PartyApplyButtonProps {
  href: string
}

const btnClass =
  'block w-full py-4 rounded-2xl text-center font-bold text-secondary text-base tracking-wide'
const btnStyle = { backgroundColor: '#c6beb8' }

export default function PartyApplyButton({ href }: PartyApplyButtonProps) {
  const anchorRef = useRef<HTMLDivElement>(null)
  const [staticVisible, setStaticVisible] = useState(false)

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setStaticVisible(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Floating button */}
      <div
        className={`fixed bottom-6 w-[90%] max-w-[350px] left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          staticVisible ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <a href={href} className={btnClass} style={btnStyle}>
          소셜링 신청하기
        </a>
      </div>

      {/* Static anchor button */}
      <div ref={anchorRef} className="px-5 pb-10">
        <a href={href} className={btnClass} style={btnStyle}>
          소셜링 신청하기
        </a>
      </div>
    </>
  )
}
