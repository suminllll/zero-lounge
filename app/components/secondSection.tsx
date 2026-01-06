'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { SECOND_SECTION_DATA } from '../data/secondSectionData'
import { TypeAnimation } from 'react-type-animation'

const SecondSection = () => {
  const [visibleImages, setVisibleImages] = useState<number[]>([])
  const imageRefs = useRef<(HTMLDivElement | null)[]>(Array(SECOND_SECTION_DATA.length).fill(null))

  useEffect(() => {
    // imageRefs.current 배열의 각 요소(이미지 div)를 순회하면서 Observer 생성
    const observers = imageRefs.current.map((ref, index) => {
      if (!ref) return null

      // IntersectionObserver 생성 - 요소가 화면에 보이는지 감지
      const observer = new IntersectionObserver(
        entries => {
          // 감지된 각 요소에 대해 실행
          entries.forEach(entry => {
            // 요소가 화면에 보이면 (교차하면) 현재 화면 기준에 관찰 대상이 존재하는지에 대한 여부를 Boolean 형태로 제공
            if (entry.isIntersecting) {
              // visibleImages 배열에 현재 이미지의 index 추가
              // Set을 사용해서 중복 제거 (같은 이미지가 여러번 추가되는 것 방지)
              setVisibleImages(prev => [...new Set([...prev, index])])
            }
          })
        },
        // 요소의 20%가 보이면 트리거 (0.2 = 20%)
        { threshold: 0.2 }
      )

      // 생성한 Observer로 해당 요소 감시 시작
      observer.observe(ref)
      // 생성한 Observer 반환
      return observer
    })

    // 컴포넌트가 언마운트되거나 useEffect가 재실행될 때 cleanup
    return () => {
      // 모든 Observer의 감시 중단 (메모리 누수 방지)
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  return (
    <section className="w-full bg-primary min-h-screen py-20">
      <div className="relative mx-auto px-6 py-20 max-w-[1280px] min-h-[1800px]">
        {SECOND_SECTION_DATA.map((data, index) => (
          <React.Fragment key={index}>
            <div
              ref={el => {
                imageRefs.current[index] = el
              }}
              className={`absolute ${data.position === 'left' ? 'left-10' : 'right-10'} h-[400px] rounded-md overflow-hidden transition-all duration-1000 ${
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

            {visibleImages.includes(index) && (
              <div
                className={`absolute ${data.position === 'left' ? 'right-10' : 'left-10'} transition-all duration-1000 ${
                  visibleImages.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  top: `${data.top}px`, // 이미지 중앙에 위치하도록 조정
                  width: '350px', // 텍스트 영역 너비
                }}
              >
                <TypeAnimation
                  sequence={[`설명 텍스트 ${index + 1}`]}
                  wrapper="p"
                  speed={1}
                  className="text-secondary text-lg"
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
