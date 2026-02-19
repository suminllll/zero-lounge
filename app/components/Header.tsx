'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 580)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full h-12 md:h-40 text-primary z-100  bg-transparent ${isScrolled ? 'md:bg-secondary' : ''}`}
    >
      <div className="flex items-center justify-between h-full border-b border-primary/20 px-4">
        {/* 햄버거 메뉴 */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <span
            className={`block transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
          >
            {/* {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />} */}
          </span>
        </button>
        {/* 로고 */}
        <Link href="/">
          <h2 className="text-lg md:text-3xl font-bold cursor-pointer">ZERO LOUNGE</h2>
        </Link>
        {/* 오른쪽 여백용 */}
        <div className="w-9"></div>
        {/* <ul className="flex gap-10">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </li>
          </ul> */}
        {/* <div></div> */}
        {/* </nav> */}
      </div>
    </header>
  )
}
