'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { SECOND_SECTION_DATA } from '../../data/secondSectionData'
import { TypeAnimation } from 'react-type-animation'

const SecondSection = () => {
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const [visibleTexts, setVisibleTexts] = useState<number[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>(Array(SECOND_SECTION_DATA.length).fill(null))

  // ===== 텍스트 완료 핸들러 =====
  // 현재 텍스트 타이핑이 끝나면 다음 텍스트를 활성화
  // index: 방금 완료된 텍스트의 인덱스
  const handleTextComplete = (index: number) => {
    // 마지막 텍스트가 아니면 다음 텍스트 활성화
    if (index < SECOND_SECTION_DATA.length - 1) {
      setVisibleTexts(prev => [...new Set([...prev, index + 1])])
    }
  }

  // ===== IntersectionObserver 설정 =====
  // 이미지가 화면에 들어오거나 나갈 때 감지
  useEffect(() => {
    // 각 이미지 요소에 대해 Observer 생성
    const observers = imageRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // 화면에 들어오면 visibleImages에 추가
              setVisibleImages(prev => [...new Set([...prev, index])])
            } else {
              // 화면에서 벗어나면 visibleImages에서 제거
              setVisibleImages(prev => prev.filter(i => i !== index))
            }
          })
        },
        { threshold: 0.2 } // 요소의 20%가 보이면 트리거
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  return (
    <section className="w-full bg-primary min-h-screen py-20">
      {/* 컨테이너: relative로 설정하여 자식 요소들이 absolute 포지션 가능 */}
      <div className="relative mx-auto px-6 py-20 max-w-[1280px] min-h-[1800px]">
        {SECOND_SECTION_DATA.map((data, index) => (
          <React.Fragment key={index}>
            {/* ===== 이미지 영역 ===== */}
            {/* position: data.position에 따라 left-10 또는 right-10 */}
            {/* 애니메이션: 화면에 보이면 opacity-100, 안 보이면 opacity-0 + translate-y-10 */}
            <div
              ref={el => {
                imageRefs.current[index] = el
              }}
              className={`absolute ${data.position === 'left' ? 'left-10' : 'right-10'}
                h-[400px] rounded-md overflow-hidden transition-all duration-1000
                ${
                  visibleImages.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
              style={{ top: `${data.top}px`, width: data.width }}
            >
              <Image
                src={data.src}
                alt={data.alt}
                fill
                style={{ objectFit: 'cover' }}
                priority
                quality={95}
              />
            </div>

            {/* ===== 0번째 텍스트: 첫 번째 이미지 오른쪽 위 ===== */}
            {/* 조건: index가 0이고, 0번째 이미지가 화면에 보이고, 텍스트가 있을 때 */}
            {index === 0 && visibleImages.includes(0) && data.text && (
              <div
                className="absolute right-10 transition-all duration-1000 opacity-100 translate-y-0"
                style={{ top: `${data.top}px`, width: '40%' }}
              >
                <TypeAnimation
                  // sequence: [대기시간, 텍스트, 완료콜백]
                  // 500ms 대기 → 텍스트 타이핑 → handleTextComplete(0) 호출
                  sequence={[500, data.text, () => handleTextComplete(0)]}
                  wrapper="p"
                  speed={70} // 타이핑 속도 (1-99, 클수록 빠름)
                  className="text-secondary text-xl"
                  cursor={false}
                />
              </div>
            )}

            {/* ===== 나머지 텍스트: 각 이미지 아래에 배치 ===== */}
            {/* 조건: 다음 인덱스 텍스트가 있고, visibleTexts에 포함되어 있을 때 */}
            {SECOND_SECTION_DATA[index + 1]?.text && visibleTexts.includes(index + 1) && (
              <div
                // 현재 이미지와 같은 방향에 배치 (이미지가 left면 텍스트도 left)
                className={`absolute ${data.position === 'left' ? 'left-10' : 'right-10'} transition-all duration-1000 opacity-100 translate-y-0`}
                // top: 현재 이미지 top + 480px (이미지 높이 400px + 여백 80px)
                style={{ top: `${data.top + 480}px`, width: data.width }}
              >
                <TypeAnimation
                  sequence={[
                    500, // 500ms 대기
                    SECOND_SECTION_DATA[index + 1].text || '', // 텍스트 타이핑
                    () => handleTextComplete(index + 1), // 완료 시 다음 텍스트 활성화
                  ]}
                  wrapper="p"
                  speed={70}
                  className="text-secondary text-xl"
                  cursor={false}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default SecondSection
