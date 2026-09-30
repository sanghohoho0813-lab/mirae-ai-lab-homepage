// 13 FAQ — 인포그래픽 이미지가 끝난 뒤 HTML/CSS 로 쓰는 자주 묻는 질문 (PDF "AX 상세페이지 카피 14섹션 최종 압축본" 13번 그대로).
// 이미지가 아니라 실제 텍스트라 검색·복사·읽기 도구가 읽을 수 있고, 내용이 바뀌면 여기만 고치면 된다.
// 같은 모양의 FAQ 를 2주 기술사업 빌드 페이지도 쓴다(items 로 질문 목록만 바꿔 끼운다).
// 답이 길어 보이지 않게 핵심 키워드·문장만 '**굵게**' 로 표시한다(검은 굵은 글씨, 답 하나에 한두 곳만).
import type { ReactNode } from 'react'
import { VENTURE_BENEFITS } from '../../data/ventureBenefits'

/** '**…**' 부분만 굵은 글씨로 (기본은 검은색, 어두운 상자 안에서는 색을 바꿔 쓴다) */
function rich(text: string, boldCls = 'font-bold text-[#171B20]'): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <b key={i} className={boldCls}>
        {part}
      </b>
    ) : (
      part
    ),
  )
}

/** 답 안의 작은 숫자 표 (예: 이익별 5년 절세액). 칸 글자도 '**…**' 로 굵게 쓸 수 있다. */
export type FaqTable = {
  n?: string
  title: string
  head: readonly string[]
  rows: readonly (readonly string[])[]
  note?: string
}

export type FaqItem = {
  q: string
  a: string
  /** 답 바로 아래 숫자 표 */
  tables?: readonly FaqTable[]
  /** 답 아래 짧은 강조 목록 (예: 신속 · 능동 · 퀄리티) */
  points?: readonly { t: string; d: string }[]
  /** 강조 목록 앞에 붙는 한 문장 */
  lead?: string
  /** 강조 목록 뒤 어두운 상자 한 줄 (예: 비용과 혜택 비교) */
  callout?: string
  /** 강조 목록 뒤에 붙는 문단 (빈 줄로 문단을 나눈다) */
  tail?: string
}

// 두 상품 FAQ 공통 — 위쪽(두 번째)에 둔다. 개발사를 깎아내리기보다 '보통 이렇다'로 차이를 설명한다.
export const DIFF_FAQ: FaqItem = {
  q: '개발사나 컨설팅 회사와는 무엇이 다른가요?',
  a: '개발사는 보통 **요청받은 것을 만드는 데 집중**해요. 기획·디자인·개발로 사람과 역할이 나뉘어 있어, 말씀하신 내용이 반영되기까지 소통이 길어지고 그만큼 시간과 비용도 늘어요.\n\n컨설팅 회사는 사업계획과 서류에는 강하지만 **직접 만들지는 않는 경우가 많아요.** 기본적인 개발은 하더라도, 프로그램을 기획하고 구조를 짜서 고객이 보기 편하고 쓰기 편한 화면까지 완성하기는 쉽지 않아요.',
  // 노무·세무·법무를 '곁들인' 게 아니라 각 분야를 직접 거친 사람이라는 점이 드러나게
  lead: '미래AI랩은 노무·법무 분야 합산 3년, 세무와 중소기업 컨설팅 현장에서 6년 이상을 보낸 경영컨설턴트가 경영 전반을 아는 눈으로 기획부터 개발까지 직접 챙겨요.',
  points: [
    { t: '신속', d: '기획하는 사람과 만드는 사람이 같아서, 말씀하신 내용이 바로 반영돼요. 수정·보완·재실행을 빠르게 반복해요.' },
    { t: '능동', d: '요청을 기다리지 않아요. 심사위원과 투자자 눈에 매력적으로 보일 사업을 먼저 기획해 제안하고, 현실적으로 실현할 수 있는 아이디어도 함께 드려요.' },
    { t: '퀄리티', d: '보기 좋은 화면에서 멈추지 않고, 실제로 쓰이고 심사에서 설명되는 수준까지 완성도 있게 끌고 가요.' },
  ],
}

export const AX_FAQ: readonly FaqItem[] = [
  {
    q: 'AX가 정확히 뭔가요?',
    a: '**AI와 데이터로 회사가 일하는 방식을 바꾸는 일**이에요. 고객 요청이 들어오면 담당자 할 일로 바로 잡히고, 급하거나 위험한 건 AI가 먼저 알려 줘요. 직원이 처리한 결과는 다시 데이터로 쌓여요.',
  },
  DIFF_FAQ,
  // 벤처기업확인은 어떤 상품이든 기본 포함(AX 영상 2와 같은 원칙) — 혜택 숫자는 2주 기술사업 빌드 FAQ 와 같은 것을 쓴다
  {
    q: 'AX 풀 패키지에도 벤처기업확인이 포함되나요?',
    a: '**네, 포함입니다.** AX 풀 패키지를 진행하시면 **벤처기업확인 신청까지 추가 비용 없이** 함께 준비해요. 법으로 제한된 업종이 아니라면 확인을 받으실 때까지 끝까지 함께해요.\n\n벤처기업확인 하나만 받아도, 요건을 갖춘 회사는 이 정도 혜택을 받을 수 있어요.',
    ...VENTURE_BENEFITS,
    callout: '벤처기업확인 하나로도 이만큼 차이가 생길 수 있어서, **AX 풀 패키지에는 기본으로 넣었어요.**',
  },
  {
    q: 'AX나 MVP, 플랫폼을 만들면 정책자금이나 투자에 선정이 보장되나요?',
    a: 'AX, MVP, 플랫폼, 특허 어느 것도 정책자금·정부지원사업·투자 **선정을 보장하지 않습니다.** 심사에서는 재무, 신용, 시장성, 기술성, 사업성을 함께 봅니다. 그래도 새 분야로 커 나갈 회사라는 걸 눈으로 보여 줄 수 있어, **심사에서 받는 인상은 완전히 달라집니다.** 큰 가점 요소라고 보셔도 됩니다.',
  },
  {
    q: '기존 ERP를 없애야 하나요?',
    a: '**아니요, 그대로 쓰시면 돼요.** ERP·POS·CRM은 일어난 일을 기록하고 관리하는 도구고, AX는 그 위에 얹는 한 층이에요. 데이터를 이어 AI가 우선순위를 추천하고 직원이 실행하니, 대표님이 그때그때 가장 좋은 결정을 내리기 쉬워지죠. 단, API 연결이 어려우면 매번 손으로 입력하거나 엑셀을 뽑아 넣어야 할 수 있어요. **이건 꼭 상담에서 확인해 주세요.**',
  },
  {
    q: '그룹웨어나 인사·급여 같은 내부 시스템도 만들어주시나요?',
    a: '그 부분은 잘하는 AX·개발회사가 따로 있어서 **협업으로 진행해요.** 저희는 일손을 덜고, 고객 응대와 매출을 챙기고, 만든 걸 회사 재산으로 남기는 데 집중해요.',
  },
  {
    q: '직원 50명이 넘는 회사도 가능한가요?',
    a: '50인 이상이라면 그룹웨어 전문 개발사와 협업해서 진행해요. 그 규모가 되면 그룹웨어도 필요하고 권한 구조도 훨씬 복잡해지기 때문이에요. 미래AI랩은 주로 **50인 미만 중소기업의 AX·플랫폼**을 만들어요.',
  },
  {
    q: '고객 포탈이나 플랫폼은 구체적으로 어떤 기능이 들어가나요?',
    a: '**고객이 전화나 카톡 대신 직접 주문하고 다시 사는 화면**이에요. B2B는 거래처가 견적·발주·재주문·납기 확인을 하는 포털, B2C는 고객이 예약·주문·재구매를 하는 플랫폼이에요. 거창한 플랫폼도, 단순한 홈페이지도 아니고요. 고객이 쉽게 고르고, 다시 사고, 하나 더 사게(업셀) 돕는 게 목표예요.',
  },
  {
    q: '직원들이 새 시스템을 싫어하면 어떡하나요?',
    a: '**처음부터 전 직원에게 쓰라고 하지 않아요.** 핵심 직원 한두 명, 대표님과 함께 제일 귀찮은 반복 업무부터 바꾸고, 효과가 확인되면 조금씩 넓혀요. 직원도 대표님도 좋아해야 하니까, 반발이 최대한 없게 설계해요.',
  },
  {
    q: 'AX 도입 후 직원 보상, 복지도 함께 설계해 주시나요?',
    a: '네. AX 개발에 참여한 직원에게 사내근로복지기금으로 성과금을 줄 수 있어요. **4대보험료나 퇴직금 부담 없이** 줄 수 있어서, AX 도입에 큰 도움이 될 거라고 봐요.',
  },
  {
    q: '우리처럼 작은 회사도 필요한가요?',
    a: '무조건 필요하다고는 말씀 안 드려요. 그래도 **회사 밖에 보여 줄 일이 있다면 규모와 상관없이 꼭 필요하다**고 봐요. 다음 단계로 가려는 회사라면 특히 추천드려요.',
  },
  {
    q: '처음부터 큰돈을 들여 전부 만들어야 하나요?',
    a: '아니요. **효과가 가장 큰 핵심 업무부터 시작해요.** 범위는 AX만인지, 플랫폼·포털까지인지, MVP인지와 회사 상황에 따라 달라요. 개발 단계별로 선정산하는 방식도 있고, 현금이 빠듯하면 착수금 일부만 컨설팅 비용으로 받고 **개발비는 자금 조달 뒤 정산하는 방식**도 있어요. 자세한 건 상담에서 안내해 드려요.',
  },
  {
    q: '정부지원이나 정책자금 때문에 상담받아도 되나요?',
    a: '물론이에요. 그렇다고 자금이 필요하다는 이유만으로 AX·플랫폼부터 권하지는 않아요. 플랫폼 형태의 웹앱이나 MVP만으로 될 때도 있어서, 상황을 보고 같이 정해요. 다만 요즘 정책자금·정부지원사업은 선정이 까다롭고 정책 우선순위까지 보니, **최소한 MVP만큼은 꼭 준비해서 도전하시길** 적극 권해요. 일반 정책자금 컨설팅 회사와 다른 점이 여기예요.',
  },
  {
    q: '이미 다른 컨설턴트나 개발사와 진행 중인 부분이 있어도 상담받을 수 있나요?',
    a: '그럼요. 진행 중인 건 그대로 두고, **빠진 부분이나 다음 단계만** 저희가 맡을 수도 있어요.',
  },
  {
    q: '법인전환이나 기업인증도 같이 준비할 수 있나요?',
    a: '네, 같이 준비할 수 있어요. 9년 차 기업성장 컨설턴트가 현장에서 시작한 회사라, **세무사·변리사·법무사·노무사 등과 협업**해 법인전환, 법인정비, 고용지원금, 사내근로복지기금, 특허, 절세까지 함께 봐요.',
  },
  {
    q: '저희 아이디어 방향을 그대로 만들어주시나요, 다른 제안도 해주시나요?',
    a: '**둘 다 해요.** 정부지원사업에 낼 아이디어가 시장조사까지 끝나 있고 완성도가 높다면 그대로 만들고, 손보면 좋아질 부분만 말씀드려요. 아이디어가 없으면 저희가 먼저 방향을 잡아 드리고, 대표님은 의견만 주시면 돼요. 9년 차 컨설턴트가 직접 참여하고 최신 정책과 시장 정보를 계속 챙기고 있어, 어느 쪽이든 맞춰 갈 수 있어요.',
  },
]

export default function AxFaqSection({ items = AX_FAQ }: { items?: readonly FaqItem[] }) {
  return (
    <section id="faq" className="scroll-mt-16 border-t border-[#E7EAEE] bg-[#FAFAF8]">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="text-center text-[1.1rem] font-black tracking-tight text-[#D47A4A] sm:text-[1.2rem]">FAQ</p>
        <h2 className="mt-3 break-keep text-center text-[1.87rem] font-black leading-[1.3] tracking-[-0.015em] text-[#171B20] sm:text-[2.4rem]">
          자주 묻는 질문
        </h2>
        <p className="mx-auto mt-4 max-w-2xl break-keep text-center text-[1.08rem] leading-[1.7] text-[#6B7680] sm:text-[1.18rem]">
          상담 전에 많이 받는 질문을 모았어요. 여기 없는 건 상담에서 바로 답해 드려요.
        </p>

        <div className="mt-9 space-y-3 sm:mt-11">
          {items.map((f, i) => (
            <details key={f.q} className="group rounded-2xl border border-[#E7EAEE] bg-white shadow-[0_6px_20px_rgba(23,27,32,0.04)] open:border-[#D47A4A]/45">
              <summary className="flex min-h-[60px] cursor-pointer list-none items-start gap-3 px-5 py-4 text-[1.12rem] font-black leading-snug text-[#171B20] transition-colors hover:bg-[#FAFAF8] sm:items-center sm:text-[1.22rem] [&::-webkit-details-marker]:hidden">
                <span aria-hidden className="mt-0.5 shrink-0 text-[0.95rem] font-black tracking-tight text-[#D47A4A] sm:mt-0">Q{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 break-keep">{f.q}</span>
                <span aria-hidden className="shrink-0 text-[#A36A4B] transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="border-t border-[#E7EAEE] px-5 py-4 sm:px-6 sm:py-5">
                {/* 빈 줄(\n\n)로 문단을 나눈다 */}
                {f.a.split('\n\n').map((para, pi) => (
                  <p key={pi} className={`break-keep text-[1.06rem] leading-[1.8] text-[#343B44] sm:text-[1.14rem] ${pi > 0 ? 'mt-2.5' : ''}`}>
                    {rich(para)}
                  </p>
                ))}
                {f.tables?.map((tb) => (
                  <div key={tb.title} className="mt-4 overflow-hidden rounded-xl ring-1 ring-inset ring-[#EBCBAA]/80">
                    <p className="flex items-start gap-2.5 bg-[#171B20] px-3.5 py-2.5 sm:px-4">
                      {tb.n && <span className="mt-0.5 shrink-0 rounded-md bg-[#E8B89A] px-2 py-0.5 text-[0.86rem] font-black text-[#171B20]">{tb.n}</span>}
                      <span className="break-keep text-[1rem] font-black leading-[1.55] text-white sm:text-[1.06rem]">{tb.title}</span>
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[0.92rem] tabular-nums sm:text-[1.02rem]">
                        <thead>
                          <tr className="bg-[#FAF3EC]">
                            {tb.head.map((h, hi) => (
                              <th key={h} scope="col" className={`whitespace-nowrap px-2.5 py-2 text-[0.82rem] font-bold text-[#6B7680] sm:px-4 sm:text-[0.9rem] ${hi === 0 ? 'text-left' : 'text-right'}`}>
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tb.rows.map((row) => (
                            <tr key={row[0]} className="border-t border-[#F0E4D8]">
                              {row.map((cell, ci) =>
                                ci === 0 ? (
                                  <th key={ci} scope="row" className="whitespace-nowrap px-2.5 py-2.5 text-left font-bold text-[#343B44] sm:px-4">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={ci} className="whitespace-nowrap px-2.5 py-2.5 text-right text-[#343B44] sm:px-4">
                                    {rich(cell, 'font-black text-[#B4532A]')}
                                  </td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {tb.note && <p className="break-keep border-t border-[#F0E4D8] bg-[#FFFCF9] px-3.5 py-2 text-[0.82rem] leading-[1.6] text-[#8A939C] sm:px-4 sm:text-[0.88rem]">{tb.note}</p>}
                  </div>
                ))}
                {f.lead && <p className="mt-3 break-keep text-[1.06rem] font-bold leading-[1.75] text-[#171B20] sm:text-[1.14rem]">{f.lead}</p>}
                {f.points && (
                  <ul className="mt-3 grid gap-2">
                    {f.points.map((pt) => (
                      <li key={pt.t} className="flex items-start gap-3 rounded-xl bg-[#FAF3EC] px-4 py-3 ring-1 ring-inset ring-[#EBCBAA]/70">
                        <span className="mt-0.5 shrink-0 rounded-md bg-[#171B20] px-2 py-0.5 text-[0.86rem] font-black text-[#E8B89A]">{pt.t}</span>
                        <span className="break-keep text-[1rem] leading-[1.7] text-[#343B44] sm:text-[1.06rem]">{rich(pt.d)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {f.callout && (
                  <p className="mt-4 break-keep rounded-xl bg-[#171B20] px-4 py-3.5 text-[1.02rem] leading-[1.75] text-white/90 sm:px-5 sm:text-[1.1rem]">
                    {rich(f.callout, 'font-black text-[#E8B89A]')}
                  </p>
                )}
                {f.tail &&
                  f.tail.split('\n\n').map((para, pi) => (
                    <p key={`t${pi}`} className="mt-3 break-keep text-[1.06rem] leading-[1.8] text-[#343B44] sm:text-[1.14rem]">
                      {rich(para)}
                    </p>
                  ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
