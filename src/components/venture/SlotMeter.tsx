// 선착순 자리 칸 — 다섯 칸 중 찬 자리는 먹색, 남은 자리는 흰색으로 천천히 숨 쉬듯 깜빡인다(과하지 않게 · 움직임 줄이기 설정이면 멈춘다).
// 구리색(#D47A4A) 배지 안에 넣는 크기. 글자로 같은 내용을 함께 쓰니 읽기 프로그램에는 숨긴다.
import { VENTURE_SLOTS_TAKEN, VENTURE_SLOTS_TOTAL } from '../../data/ventureSlots'

export default function SlotMeter({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden data-slot-meter className={`inline-flex items-center gap-[3px] ${className}`}>
      {Array.from({ length: VENTURE_SLOTS_TOTAL }, (_, i) =>
        i < VENTURE_SLOTS_TAKEN ? (
          <span key={i} data-slot="taken" className="h-[0.7em] w-[0.36em] rounded-[2px] bg-[#171B20]/80" />
        ) : (
          <span key={i} data-slot="open" className="slot-open h-[0.7em] w-[0.36em] rounded-[2px] bg-white" />
        ),
      )}
    </span>
  )
}
