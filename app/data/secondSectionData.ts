export interface SecondSectionData {
  src: string
  alt: string
  position: 'left' | 'right'
  top: number
  width: string
}

export const SECOND_SECTION_DATA: SecondSectionData[] = [
  { top: 0, width: '50%', src: '/images/heroSlide2.jpg', alt: 'second img1', position: 'left' },
  {
    top: 140,
    width: '40%',
    src: '/images/heroSlide3.jpg',
    alt: 'second img2',
    position: 'right',
  },
  {
    top: 600,
    width: '50%',
    src: '/images/heroSlide4.jpg',
    alt: 'second img3',
    position: 'left',
  },
  {
    top: 750,
    width: '40%',
    src: '/images/heroSlide6.jpg',
    alt: 'second img4',
    position: 'right',
  },
  {
    top: 1200,
    width: '50%',
    src: '/images/heroSlide5.jpg',
    alt: 'second img5',
    position: 'left',
  },
]
