'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IoChevronBack } from 'react-icons/io5'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

  const isPartyPage = pathname?.startsWith('/party/')
  const isApplyPage = pathname?.startsWith('/apply')

  useEffect(() => {
    setScrolled(false)
    if (!isPartyPage) return

    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, isPartyPage])

  return (
    <header
      className={`${isPartyPage ? 'fixed' : 'absolute'} top-0 left-0 w-full h-14 text-[#d2cdc3] z-20 transition-colors duration-300 ${
        isPartyPage && scrolled ? 'bg-secondary' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-full px-3">
        {isPartyPage ? (
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center"
          >
            <IoChevronBack size={26} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <Link href="/">
          <h2
            className={`text-sm font-bold tracking-widest ${isApplyPage ? 'text-[#311d0a]' : ''}`}
          >
            ZERO LOUNGE
          </h2>
        </Link>
        <div className="w-9" />
      </div>
    </header>
  )
}
