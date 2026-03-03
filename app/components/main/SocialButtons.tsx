'use client'

import { FaInstagram } from 'react-icons/fa'
import { IoShareOutline } from 'react-icons/io5'

export default function SocialButtons() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ZERO LOUNGE',
          url: window.location.href,
        })
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          await navigator.clipboard.writeText(window.location.href)
          alert('링크가 복사되었습니다.')
        }
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다.')
    }
  }

  return (
    <div className="w-full px-5">
      <div className="flex gap-8 justify-center mt-2 pb-4">
        <a
          href="https://www.instagram.com/zero__lounge"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#c2b5aa] hover:text-[#f5e2d4] transition-colors"
        >
          <FaInstagram size={28} />
        </a>
        <button
          onClick={handleShare}
          className="text-[#c2b5aa] hover:text-[#f5e2d4] transition-colors cursor-pointer"
        >
          <IoShareOutline size={28} />
        </button>
      </div>
      <p className="text-[#8F8781] text-[11px] leading-5 text-center">
        * 참가비는 공간료, 호스트 수고비, 콘텐츠 제작비용입니다. 제공되는 주류와 음식은
        게스트분들의 편의를 위해 호스트가 대리구매 합니다. 어떠한 주류, 음식도 유료로 판매하지
        않습니다.
      </p>
    </div>
  )
}
