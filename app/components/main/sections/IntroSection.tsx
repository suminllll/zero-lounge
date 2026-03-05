import Image from 'next/image'

export default function IntroSection() {
  return (
    <>
      <h1 className="font-medium text-lg leading-7 break-all whitespace-pre-wrap px-[15px] pb-10">
        낯선 사람이 편한 사람이 되는 자리.
        <br />
        <br />
        처음 만난 사람과 웃고, 취향을 나누다 보면
        <br />
        어느새 친구가 되는 그런 순간.
        <br />
        <br />
        'ZERO LOUNGE'는 <br />
        혼자 오는 사람들을 위해 준비했어요.
      </h1>

      <div>
        <div className="relative w-full h-[370px] mx-auto bg-[#2a2220]">
          <Image
            src={'/images/heroMain1.jpg'}
            alt={'heroMain1'}
            fill
            className="object-cover"
            quality={95}
            sizes="100vw"
          />
          <p className="absolute top-3 right-6 text-xs text-white">ZERO LOUNGE</p>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-light text-white">
            사람과 시간의 밀도를 중요하게 생각하는 소셜링 입니다.
          </p>
        </div>

        <p className="mt-20 pl-[4vw] text-base leading-7  font-medium">
          요즘은 사람을
          <br /> 어디에서 만나야 할지 잘 모르겠어요.
          <br />
          <br />
          소개팅은 부담스럽고, <br />
          시끄러운 술자리는 피곤하고,
          <br />
          그렇다고 가만히 있자니
          <br />
          괜히 마음이 허전해지는 날이 있죠.
          <br />
          <br />
          그래서 우리는
          <br />
          조금 다른 자리를 준비했습니다.
          <br />
          <br />
          속도를 강요하지 않고,
          <br />
          억지로 친해지지 않아도 되는 분위기.
          <br />
          <br />
          결국 남는 건<br />
          사람과 사람 사이의 대화입니다.
          <br />
          <br />
          어쩌면,
          <br />
          요즘 우리가 찾고 있던 건<br />
          거창한 만남이 아니라
          <br />
          편하게 이야기할 수 있는 밤이었을지도 모르니까요.
        </p>

        <div className="relative w-full h-[481px] mx-auto mt-20 bg-[#2a2220]">
          <Image
            src={'/images/IMG_5056 1.png'}
            alt={'heroMain2'}
            fill
            className="object-cover"
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute top-3 right-6 text-xs text-white">ZERO LOUNGE</p>
          <div className="absolute bottom-3 right-6 whitespace-nowrap font-light text-[#d0c4bc]">
            <p className="font-bold text-xl"> 이런 시간을 준비했어요.</p>
            <div className="text-right text-sm font-light mt-3">
              아이스 브레이킹 대화 주제
              <br /> 서로의 첫인상 이야기 <br />
              취향 맞추기
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
