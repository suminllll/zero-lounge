import Image from 'next/image'
import GallerySlider from './GallerySlider'
import SocialButtons from './SocialButtons'
import PartyCards from './PartyCards'

const AboutSection = () => {
  return (
    <section className=" bg-secondary py-10 gap-20">
      <h1 className="font-medium text-[#c6beb8] text-[18px] leading-7 break-all whitespace-pre-wrap px-[15px] mb-20">
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

        <p className=" mt-20 pl-[4vw] text-[#c6beb8] text-[18px] leading-7 font-light">
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
          <div className="text-[15px] flex flex-col gap-1 mt-3">
            <p>\ 내향적이지만 새로운 사람을 만나고 싶은 분.</p>
            <p>\ 편하게 대화하며 즐거운 시간 보내고 싶은 분.</p>
            <p>\ 대화를 중심으로 서로를 알아 가고 싶은 분.</p>
            <p>\ 타지에서 와서 동네친구 만들고 싶은 분.</p>
            <p>\ 나와 같은 결의 친구를 사귀고 싶은 분.</p>
          </div>
        </div>

        <div className="bg-secondary w-[90%] mx-auto rounded-3xl px-6">
          <p className="text-center text-3xl font-bold italic text-primary mb-8 tracking-widest">
            NOTICE
          </p>
          <div className="border border-primary/30 rounded-[80px] px-8 py-10 flex flex-col gap-8 text-center text-primary">
            <div>
              <p className="font-bold text-base">장소</p>
              <p className="text-sm mt-1 font-light leading-6">
                공덕역-애오개역 사이
                <br />
                (자세한 위치는 예약 확정시 보내드려요)
              </p>
            </div>
            <div>
              <p className="font-bold text-base">일정</p>
              <p className="text-sm mt-1 font-light leading-6">
                금요일 8시 <br /> 토.일요일 6시 30분
              </p>
            </div>
            {/* <div>
              <p className="font-bold text-base">제공 메뉴</p>
              <p className="text-sm mt-1 font-light leading-6">
                오리고기 / 떡볶이 <br />/ 소불고기 볶음밥 / 유자샐러드
              </p>
            </div>
             <div>
              <p className="font-bold text-base">제공 주류</p>
              <p className="text-sm mt-1 font-light leading-6">
                오리고기 / 떡볶이 <br />/ 소불고기 볶음밥 / 유자샐러드
              </p>
            </div> */}
            <div>
              <p className="font-bold text-base">러닝타임</p>
              <p className="text-sm mt-1 font-light">150분 / 2부(선택)</p>
            </div>
            <div>
              <p className="font-bold text-base">인원</p>
              <p className="text-sm mt-1 font-light leading-6">
                최소 20명에서
                <br />
                최대 36명까지 모일 거에요
                <br />
                (호스트 & 스텝 제외)
              </p>
            </div>
            <div>
              <p className="font-bold text-base">나이</p>
              <p className="text-sm mt-1 font-light">37세까지만 받을게요.</p>
            </div>
          </div>
        </div>

        {/* 후기 섹션 */}
        <div className="py-16 px-5">
          <h2 className="text-center text-[#f5e2d4] text-[22px] font-bold leading-snug mb-12">
            1,000명 이상 다녀가신 소셜링. <br />
            게스트 분들이
            <br />
            이런 점을 좋아해주셨어요
          </h2>

          <div className="flex flex-col gap-4">
            <div className="self-start max-w-[82%]">
              <div className="bg-[#c2b5aa] rounded-[18px] px-5 py-4 text-[#362617] text-sm leading-6">
                호스트님이 친절하시고, 부담스럽지 않은 컨텐츠라 사람들과 금방 친해질 수 있었어요🦊
              </div>
            </div>
            <div className="self-end max-w-[82%]">
              <div className="bg-[#c2b5aa] rounded-[18px] px-5 py-4 text-[#362617] text-sm leading-6">
                딱 제 취향이에요. 저 벌써 5번째 재방문이에요!
              </div>
            </div>
            <div className="self-start max-w-[82%]">
              <div className="bg-[#c2b5aa] rounded-[18px] px-5 py-4 text-[#362617] text-sm leading-6">
                적당한 텐션과 강요 없는 2부 덕분에 짧고 굵게 잘 놀다왔어요😎
              </div>
            </div>
            <div className="self-end max-w-[82%]">
              <div className="bg-[#c2b5aa] rounded-[18px] px-5 py-4 text-[#362617] text-sm leading-6">
                시끄러운 파티 갔다가 중간에 도망쳤는데, 2차까지 참석한 건 여기가 처음이에요😊
              </div>
            </div>
          </div>

          <p className="text-center text-[#f5e2d4] text-[15px] mt-12 leading-7">
            매일 보는 익숙한 사람들 말고,
            <br />
            가끔은 새로운 사람들과 이야기해요.
          </p>
        </div>

        <GallerySlider />

        <div className="my-30 px-5">
          <p className=" text-[#f5e2d4] text-[30px] font-bold leading-snug mb-2">QnA</p>
          <p>
            <br />
            Q. 혼자 가도 되나요?
            <br />
            A. 90% 이상의 게스트 분들이 혼자 방문해요.
            <br />
            (호스트도 혼자가요🙃)
            <br />
          </p>
          <p>
            <br />
            Q. 연령대가 어떻게 되나요?
            <br />
            A. 2030 소셜링으로 비슷한 나이대로 테이블을 구성하고 있으니, 부담없이 신청해주세요!
            <br />
          </p>
          <p>
            <br />
            Q. 제가 술을 잘 못 마시는데 괜찮나요?
            <br />
            A. 그럼요! 논알콜도 준비되어 있답니다.
            <br />
          </p>
          <p>
            <br />
            Q. 제가 진짜 대문자 I인데 괜찮을까요?
            <br />
            A. 저희 소셜링 특성상 I분들이 더 많아요. 내향인 환영!
            <br />
          </p>
        </div>

        <p className="text-center text-[#f5e2d4] text-[20px] font-bold leading-snug">
          우리, 곧 만나요.
        </p>
      </div>

      <div className=" flex justify-center items-center flex-col ">
        {/* <div className="relative z-10 text-[#c6beb8] text-center text-2xl mb-10 ">
          <p className="font-bold">&lt; 대화가 남는 곳 &gt;</p>
        </div> */}

        {/* 카드섹션 */}
        <PartyCards />
        <SocialButtons />
      </div>
    </section>
  )
}

export default AboutSection
