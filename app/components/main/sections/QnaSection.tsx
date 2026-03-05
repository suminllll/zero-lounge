const QNA_LIST = [
  {
    q: '혼자 가도 되나요?',
    a: '90% 이상의 게스트 분들이 혼자 방문해요.\n(호스트도 혼자가요🙃)',
  },
  {
    q: '연령대가 어떻게 되나요?',
    a: '2030 소셜링으로 비슷한 나이대로 테이블을 구성하고 있으니, 부담없이 신청해주세요!',
  },
  {
    q: '제가 술을 잘 못 마시는데 괜찮나요?',
    a: '그럼요! 논알콜도 준비되어 있답니다.',
  },
  {
    q: '제가 진짜 대문자 I인데 괜찮을까요?',
    a: '저희 소셜링 특성상 I분들이 더 많아요. 내향인 환영!',
  },
]

export default function QnaSection() {
  return (
    <div className="my-30 px-5">
      <p className="text-3xl font-bold leading-snug mb-2">QnA</p>
      {QNA_LIST.map((item, i) => (
        <div key={i} className="font-medium mb-2">
          <br />
          <p className="mb-1"> Q. {item.q}</p>
          <p className="text-sm"> A. {item.a}</p>
        </div>
      ))}
    </div>
  )
}
