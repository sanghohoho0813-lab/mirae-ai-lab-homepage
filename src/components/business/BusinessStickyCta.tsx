// AX 페이지 폰 하단 고정 바 — 2주 기술사업 빌드 페이지와 같은 모양(DetailMobileBar)을 쓴다.
//   [우리 회사에 맞는 / 서비스 찾기(주황)] [실제 AX 보기(먹색)] [카톡] [뒤로 · 앞으로]
// 홈과 AX 상세 안내가 같은 바를 쓴다.
import DetailMobileBar from './DetailMobileBar'

export default function BusinessStickyCta({
  visible,
  onOpenSampleNav,
  diagnosisHref = '/business-diagnosis',
}: {
  visible: boolean
  onOpenSampleNav: () => void
  /** 진단 CTA 목적지 — 트랙 페이지는 ?interest= 를 붙여 유입을 구분한다 */
  diagnosisHref?: string
}) {
  if (!visible) return null
  return (
    <DetailMobileBar
      primary={{
        to: diagnosisHref,
        ariaLabel: '우리 회사에 맞는 서비스 찾기',
        // 칸이 좁아 두 줄로 — 위는 작게, 아래 '서비스 찾기' 를 굵게
        label: (
          <span className="flex flex-col items-center leading-tight">
            <span className="text-[0.66rem] font-semibold opacity-80 min-[380px]:text-[0.7rem]">우리 회사에 맞는</span>
            <span>서비스 찾기</span>
          </span>
        ),
      }}
      secondary={{
        onClick: onOpenSampleNav,
        label: (
          <>
            <span className="min-[360px]:hidden">AX 보기</span>
            <span className="hidden min-[360px]:inline">실제 AX 보기</span>
          </>
        ),
      }}
    />
  )
}
