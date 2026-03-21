import { BiMehBlank } from 'react-icons/bi'
const WHO_LIST = [
  '내향적이지만 새로운 사람을 만나고 싶은 분.',
  '편하게 대화하며 즐거운 시간 보내고 싶은 분.',
  '대화를 중심으로 서로를 알아 가고 싶은 분.',
  '타지에서 와서 동네친구 만들고 싶은 분.',
  '나와 같은 결의 친구를 사귀고 싶은 분.',
]

export default function WhoSection() {
  return (
    <div className="flex flex-col items-center justify-center mb-15 text-lg font-light text-primary">
      <p className="text-xl font-bold mb-2 ">이런 분이 오시면 좋아요!</p>
      <div className="text-base leading-7 font-medium flex flex-col items-center gap-1 mt-3">
        {WHO_LIST.map((item, i) => (
          <p key={i} className="flex items-center gap-1">
            <BiMehBlank />
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  )
}
