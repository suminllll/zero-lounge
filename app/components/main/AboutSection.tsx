import React from 'react'
import Image from 'next/image'

const AboutSection = () => {
  return (
    <section className="relative overflow-hidden flex justify-center items-center flex-col bg-[#d8c7b7] py-20 gap-20">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-24 left-[18%] h-48 w-48 rounded-full bg-[#f1d3a9]/56 blur-3xl" />
        <div className="absolute bottom-10 right-[20%] h-56 w-56 rounded-full bg-[#f4efe8]/38 blur-3xl" />
      </div>

      <div className="relative z-10 text-[#362617] text-center text-2xl">
        <p className="font-bold">&lt; 대화가 남는 파티 &gt;</p>
        <p className="mt-3">제로라운지</p>
      </div>

      {/* Legacy card block start
      <div className="relative z-10 w-[90%] max-w-4xl flex flex-col gap-4 pb-12">
        <div className="glass-card">
          <div className="flex h-full min-h-[120px] items-center justify-between gap-4 px-6 py-5 text-[#362617]">
            <div>
              <p className="text-lg font-bold">처음 와도 자연스럽게</p>
              <p className="mt-1 text-sm/6 opacity-80">
                대화가 어색하지 않도록 진행과 분위기를 설계해요.
              </p>
            </div>
            <span className="text-2xl font-semibold text-[#8f5a33]">01</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex h-full min-h-[120px] items-center justify-between gap-4 px-6 py-5 text-[#362617]">
            <div>
              <p className="text-lg font-bold">혼자 와도 편안한 구성</p>
              <p className="mt-1 text-sm/6 opacity-80">
                소규모 그룹과 자연스러운 회전으로 부담을 줄여요.
              </p>
            </div>
            <span className="text-2xl font-semibold text-[#8f5a33]">02</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="flex h-full min-h-[120px] items-center justify-between gap-4 px-6 py-5 text-[#362617]">
            <div>
              <p className="text-lg font-bold">대화가 남는 경험</p>
              <p className="mt-1 text-sm/6 opacity-80">
                끝나고도 다시 생각나는 질문과 분위기를 만듭니다.
              </p>
            </div>
            <span className="text-2xl font-semibold text-[#8f5a33]">03</span>
          </div>
        </div>
      </div>
      Legacy card block end */}

      <div className="relative z-10 w-[90%] max-w-4xl flex flex-col gap-5 pb-12">
        <div className="glass-card-v2 p-5">
          <Image
            src={'/images/cocktail1.jpeg'}
            alt={'heroMain'}
            width={30}
            height={10}
            className="w-full h-auto"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="flex flex-col justify-between gap-4 px-6 py-6 text-[#362617] font-bold md:px-7">
            <p className="text-lg font-bold">제로주점</p>
            <p className="mt-1.5 text-sm/6 text-[#362617]/82">내향인 파티</p>
          </div>
        </div>

        <div className="glass-card-v2">
          <div className="flex h-full min-h-[128px] items-center justify-between gap-4 px-6 py-6 text-[#f4f1ed] md:px-7">
            <div>
              <p className="text-lg font-bold">제로러브</p>
              <p className="mt-1.5 text-sm/6 text-[#f7f3ee]/82">
                소규모 그룹과 자연스러운 회전으로 부담을 줄여요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
