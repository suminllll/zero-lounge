import Image from 'next/image'

const AboutSection = () => {
  return (
    <section className=" bg-secondary py-10 gap-20">
      <h1 className="font-medium text-[#8F8781] text-[18px] leading-7 break-all whitespace-pre-wrap px-[15px] mb-20">
        낯선 사람이 편한 사람이 되는 순간.
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
      <div className=" flex justify-center items-center flex-col ">
        <div className="relative z-10 text-[#8F8781] text-center text-2xl mb-10 ">
          <p className="font-bold">&lt; 대화가 남는 곳 &gt;</p>
        </div>

        {/* 카드섹션 */}
        <div className="relative z-10 w-[90%] max-w-4xl flex flex-col gap-5 pb-12">
          <div className="glass-card-v2 p-5 cursor-pointer group">
            <div className="transition-transform duration-300 group-hover:scale-105 ">
              <Image
                src={'/images/cocktail1.jpeg'}
                alt={'heroMain'}
                width={30}
                height={10}
                className="w-full h-auto rounded-2xl"
                priority
                quality={95}
                sizes="100vw"
              />
              <div className="flex flex-col justify-between gap-4 py-6 text-secondary font-bold px-3">
                <p className="text-lg font-bold">내향인 파티</p>
                <p className="mt-1.5 text-sm/6 text-secondary/82">
                  말차 하이볼 그리고 얼그레이 하이볼 <br /> 소주 / 맥주 / 논알콜
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card-v2 p-5 cursor-pointer group">
            <div className=" transition-transform duration-300 group-hover:scale-105">
              <Image
                src={'/images/wine.jpeg'}
                alt={'제로러브'}
                width={30}
                height={10}
                className="w-full h-auto rounded-2xl"
                priority
                quality={95}
                sizes="100vw"
              />
              <div className="flex flex-col justify-between gap-4  py-6 text-[#362617] font-bold px-3">
                <p className="text-lg font-bold">와인 파티</p>
                <p className="mt-1.5 text-sm/6 text-[#362617]/82">
                  레드와인 / 화이트 와인 / 논알콜
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="relative w-full h-[370px]  mx-auto">
          <Image
            src={'/images/heroMain1.jpg'}
            alt={'heroMain1'}
            fill
            className="object-cover"
            quality={95}
            sizes="100vw"
          />
          <p className="absolute top-3 right-6  text-xs">ZERO LOUNGE</p>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-light">
            사람과 시간의 밀도를 중요하게 생각하는 소셜링 입니다.
          </p>
        </div>

        <p className=" mt-20 pl-[4vw] text-[#8F8781] text-[18px] leading-7 font-light">
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

        <div className="relative w-full h-[481px]  mx-auto mt-20">
          <Image
            src={'/images/IMG_5056 1.png'}
            alt={'heroMain1'}
            fill
            className="object-cover"
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute top-3 right-6  text-xs">ZERO LOUNGE</p>
          <div className="absolute bottom-3 right-6 whitespace-nowrap font-light text-[#d0c4bc]  ">
            <p className="font-bold text-xl"> 이런 시간을 준비했어요.</p>
            <div className="text-right text-[15px] font-light mt-3">
              아이스 브레이킹 대화 주제
              <br /> 서로의 첫인상 이야기 <br />
              취향 맞추기
            </div>
          </div>
        </div>

        <div className="text-[#f5e2d4] my-20 pl-[4vw]  text-[18px] font-light">
          <p className="text-l font-bold mb-2">이런 분이 오시면 좋아요!</p>
          <div className="text-[15px]">
            <p>\ 내향적이지만 새로운 사람을 만나고 싶은 분.</p>
            <p>\ 편하게 대화하며 즐거운 시간 보내고 싶은 분.</p>
            <p>\ 대화를 중심으로 서로를 알아 가고 싶은 분.</p>
            <p>\ 타지에서 와서 동네친구 만들고 싶은 분.</p>
            <p>\ 나와 같은 결의 친구를 사귀고 싶은 분.</p>
          </div>
        </div>

        <div className="relative rounded-2xl bg-[#1f1001] w-[90%] mx-auto">
          <p className="absolute top-3 right-6  text-xs">ZERO LOUNGE</p>
          <div>
            <p>어디로 가나요?</p>
            <p>
              장소
              <br />
              공덕역-애오개역 사이
              <br />
              (자세한 위치는 예약 확정시 보내드려요)
              <br />
              <br />
              러닝타임
              <br />
              150분 / 2부(선택)
              <br />
              <br />
              인원
              <br />
              최소 20명에서
              <br />
              최대 36명까지 모일 거에요
              <br />
              (호스트 & 스텝 제외)
              <br />
              <br />
              나이
              <br />
              37세까지만 받을게요
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
