// 스토리 이미지 바로 아래 붙는 블록 두 가지.
//  - 5.2 [정책자료 원문 보기] → 공식 출처 링크 (정책기관 자료는 미래AI랩의 성과와 섞이지 않게 별도 표기)
//  - 8.3 [심사위원 인터뷰 영상 보기] → YouTube 공개 영상 임베드 (출처·채널·제목을 그대로 밝힌다)

const POLICY_SOURCES = [
  {
    org: '기후에너지환경부 보도자료 · 2026.6.19',
    title: '"AI 응용제품, 1~2년 내 시장으로 달린다" — AX-Sprint 229개 제품·서비스 선정, 총 7,540억 원 지원',
    url: 'https://mcee.go.kr/home/web/board/read.do?boardId=1872100&boardMasterId=939&menuId=10598',
  },
  {
    org: '대한민국 정책브리핑 · 산업통상부 보도자료 · 2026.3',
    title: '246개 AI 응용제품 개발에 7,540억원 지원 … AX-Sprint(전력질주) 본격 추진',
    url: 'https://www.korea.kr/briefing/pressReleaseView.do?newsId=156749538',
  },
  {
    org: '중소벤처기업진흥공단 누리집',
    title: '정책자금 신성장기반자금 — AX 스프린트 우대트랙 안내',
    url: 'https://www.kosmes.or.kr/nsh/SH/SBI/SHSBI007M0.do',
  },
  {
    org: '중소벤처기업부 사업공고',
    title: '중소기업·소상공인 AI 전환 우수사례 공모전 — 사업공고 목록에서 해당 연도 공고 확인',
    url: 'https://www.mss.go.kr/site/smba/ex/bbs/List.do?cbIdx=310',
  },
] as const

/** 5.2 아래 — 정책자료 원문 링크. 이미지의 [정책자료 원문 보기] 버튼이 여기로 스크롤된다. */
export function AxPolicySources() {
  return (
    <div id="policy-sources" className="mx-auto mt-3 max-w-[1086px] scroll-mt-20 px-4 sm:mt-4 sm:px-0">
      <div className="rounded-2xl border border-[#E7EAEE] bg-white/92 p-5 shadow-[0_10px_30px_rgba(23,27,32,0.08)] backdrop-blur sm:p-7">
        <p className="text-[0.95rem] font-black tracking-[0.12em] text-[#A36A4B] sm:text-[1.0rem]">정책자료 원문 보기</p>
        <p className="mt-1.5 break-keep text-[1.08rem] font-black leading-snug text-[#171B20] sm:text-[1.22rem]">
          위 내용은 아래 기관의 공식 자료를 요약한 것입니다.
        </p>
        <ul className="mt-4 divide-y divide-[#E7EAEE]">
          {POLICY_SOURCES.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 py-3 transition-colors hover:text-[#A36A4B]"
              >
                <span className="min-w-0">
                  <span className="block text-[0.9rem] font-bold text-[#6B7680] sm:text-[0.95rem]">{s.org}</span>
                  <span className="mt-0.5 block break-keep text-[1.0rem] font-semibold leading-snug text-[#171B20] group-hover:text-[#A36A4B] sm:text-[1.08rem]">{s.title}</span>
                </span>
                <span aria-hidden className="mt-1 shrink-0 text-[#D47A4A]">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 break-keep text-[0.92rem] leading-relaxed text-[#6B7680] sm:text-[0.98rem]">
          정책 내용은 각 기관의 공식 발표를 요약한 것으로, 미래AI랩의 실적이나 고객사 성과와는 관계가 없습니다. 지원·선정 여부는 각 기관의 심사 기준과 절차에 따라 결정됩니다.
        </p>
      </div>
    </div>
  )
}

export const JUDGE_VIDEO = {
  id: '1D3TkU9GgUg',
  url: 'https://youtu.be/1D3TkU9GgUg',
  title: '모두의창업 2기, 지원자 99%가 모르는 합격의 진실 (feat. 모두의 창업 책임 멘토)',
  channel: '사업계획서의 정석, 비즈니스 성공방정식',
  channelUrl: 'https://www.youtube.com/@%EC%A0%95%EC%84%9DBiz',
} as const

/** 8.3 아래 — 심사위원 인터뷰 영상. 이미지의 영상 자리와 버튼이 여기로 스크롤된다. */
export function AxJudgeVideo() {
  return (
    <div id="judge-video" className="mx-auto mt-3 max-w-[1086px] scroll-mt-20 px-4 sm:mt-4 sm:px-0">
      <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#0F1318] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-3 px-5 pt-4 sm:px-6">
          <p className="text-[0.95rem] font-black tracking-[0.12em] text-[#E8B89A] sm:text-[1.0rem]">심사위원 인터뷰 영상</p>
          <a href={JUDGE_VIDEO.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[0.92rem] font-bold text-slate-400 underline underline-offset-4 transition-colors hover:text-white sm:text-[0.98rem]">
            YouTube에서 보기 ↗
          </a>
        </div>
        <div className="mt-3 aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${JUDGE_VIDEO.id}?rel=0`}
            title={JUDGE_VIDEO.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <figcaption className="px-5 py-4 sm:px-6">
          <p className="break-keep text-[1.0rem] font-bold leading-snug text-white sm:text-[1.08rem]">{JUDGE_VIDEO.title}</p>
          <p className="mt-1.5 break-keep text-[0.92rem] leading-relaxed text-slate-400 sm:text-[0.98rem]">
            출처: YouTube 채널{' '}
            <a href={JUDGE_VIDEO.channelUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#E8B89A] underline underline-offset-4 hover:text-white">
              「{JUDGE_VIDEO.channel}」
            </a>
            . 미래AI랩과 관계없는 제3자의 공개 영상이며, 심사 현장의 관점을 참고하기 위해 인용합니다. 영상의 내용과 저작권은 해당 채널에 있습니다.
          </p>
        </figcaption>
      </div>
    </div>
  )
}
