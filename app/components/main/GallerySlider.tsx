'use client'

import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const images = [
  '/images/heroSlide8.png',
  '/images/heroSlide7.png',
  '/images/heroSlide6.png',
  '/images/slide1.jpeg',
  '/images/slide4.jpeg',
  '/images/slide2.jpeg',
  '/images/heroSlide4.jpg',
]

const slides = images.map(src => ({ src }))

export default function GallerySlider() {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set())

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="mt-12">
      <p className="pl-[4vw] text-lg font-bold mb-4 text-primary">소셜링 갤러리</p>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 px-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[90%] h-[280px] relative rounded-2xl overflow-hidden cursor-pointer bg-[#2a2220]"
              onClick={() => openLightbox(i)}
            >
              {!loadedSet.has(i) && (
                <div className="absolute inset-0 bg-[#2a2220] animate-pulse z-10" />
              )}
              <Image
                src={src}
                alt={`gallery-${i}`}
                fill
                className="object-cover"
                quality={90}
                sizes="80vw"
                onLoad={() => setLoadedSet(prev => new Set(prev).add(i))}
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </div>
  )
}
