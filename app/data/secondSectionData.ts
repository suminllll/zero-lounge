export interface SecondSectionData {
  src: string
  alt: string
  position: 'left' | 'right'
  top: number
  width: string
  text?: string
}

export const SECOND_SECTION_DATA: SecondSectionData[] = [
  {
    top: 0,
    width: '50%',
    src: '/images/heroSlide2.jpg',
    alt: 'second img1',
    position: 'left',
    text: '혼자 오는 사람들이 모여서 친구가 된다면 얼마나 좋을까?',
  },
  {
    top: 140,
    width: '40%',
    src: '/images/heroSlide3.jpg',
    alt: 'second img2',
    position: 'right',
    text: '그래서 처음 만난 사람들끼리 할 수 있는 대화거리를 준비했어요.',
  },
  {
    top: 600,
    width: '50%',
    src: '/images/heroSlide4.jpg',
    alt: 'second img3',
    position: 'left',
    text: '부담스럽지 않고 천천히 서로를 알아갈 수 있게',
  },
  {
    top: 750,
    width: '40%',
    src: '/images/heroSlide6.jpg',
    alt: 'second img4',
    position: 'right',
    text: '낯선 사람들과 대화가 잘 통하면 신기하지 않아요?',
  },
  {
    top: 1200,
    width: '50%',
    src: '/images/heroSlide5.jpg',
    alt: 'second img5',
    position: 'left',
    text: '제로라운지에서는 가능해요!',
  },
]
