const REVIEWS = [
  {
    align: 'start',
    text: '호스트님이 친절하시고, 부담스럽지 않은 컨텐츠라 사람들과 금방 친해질 수 있었어요🦊',
  },
  { align: 'end', text: '딱 제 취향이에요. 저 벌써 5번째 재방문이에요!' },
  { align: 'start', text: '적당한 텐션과 강요 없는 2부 덕분에 짧고 굵게 잘 놀다왔어요😎' },
  {
    align: 'end',
    text: '시끄러운 파티 갔다가 중간에 도망쳤는데, 2차까지 참석한 건 여기가 처음이에요😊',
  },
]

export default function ReviewSection() {
  return (
    <div className="py-16 px-5">
      <h2 className="text-center text-2xl font-bold leading-snug mb-12">
        1,000명 이상 다녀가신 소셜링. <br />
        게스트 분들이
        <br />
        이런 점을 좋아해주셨어요
      </h2>

      <div className="flex flex-col gap-4">
        {REVIEWS.map((review, i) => (
          <div
            key={i}
            className={`${review.align === 'end' ? 'self-end' : 'self-start'} max-w-[82%]`}
          >
            <div className="bg-[#c2b5aa] rounded-[18px] px-5 py-4 text-[#362617] text-sm leading-6">
              {review.text}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-base mt-12 leading-7">
        매일 보는 익숙한 사람들 말고,
        <br />
        가끔은 새로운 사람들과 이야기해요.
      </p>
    </div>
  )
}
