'use client'

import { useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const images = [
  '/images/heroSlide4.jpg',
  '/images/heroSlide2.jpg',
  '/images/heroSlide6.jpg',
  '/images/slide1.jpeg',
  '/images/slide4.jpeg',
  '/images/slide2.jpeg',
]

const slides = images.map(src => ({ src }))

export default function GallerySlider() {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className="mt-12">
      <p className="pl-[4vw] text-[#f5e2d4] text-[18px] font-bold mb-4">소셜링 갤러리</p>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 px-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-[90%] h-[280px] relative rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={src}
                alt={`gallery-${i}`}
                fill
                className="object-cover"
                quality={90}
                sizes="80vw"
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
