// AX 페이지 폰 하단 고정 바 — 2주 기술사업 빌드 페이지와 같은 모양(DetailMobileBar)을 쓴다.
//   [우리 회사에 맞는 / 서비스 찾기(주황)] [샘플 22개 보기(먹색)] [카톡] [뒤로 · 앞으로]
// 홈과 AX 상세 안내가 같은 바를 쓴다.
//  - samplesTo 가 있으면(AX 페이지) 2주 기술사업 빌드와 같이 '샘플 모아보기' 페이지로 간다.
//  - 없으면(숨겨 둔 AX 상세 안내) 예전처럼 샘플 창을 연다.
import DetailMobileBar from './DetailMobileBar'
import { SAMPLE_TOTAL } from '../../data/portfolioSamples'

export default function BusinessStickyCta({
  visible,
  onOpenSampleNav,
  samplesTo,
  onSamplesClick,
  diagnosisHref = '/business-diagnosis',
}: {
  visible: boolean
  onOpenSampleNav?: () => void
  /** 샘플 모아보기 주소 — 있으면 창 대신 이 페이지로 간다 */
  samplesTo?: string
  /** 샘플 버튼을 누를 때(돌아올 위치 기억 등) */
  onSamplesClick?: () => void
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
      secondary={
        samplesTo
          ? {
              to: samplesTo,
              onClick: onSamplesClick,
              label: (
                <span data-ax-sticky-samples>
                  <span className="min-[360px]:hidden">샘플 보기</span>
                  <span className="hidden min-[360px]:inline">샘플 {SAMPLE_TOTAL}개 보기</span>
                </span>
              ),
            }
          : {
              onClick: onOpenSampleNav ?? (() => {}),
              label: (
                <>
                  <span className="min-[360px]:hidden">AX 보기</span>
                  <span className="hidden min-[360px]:inline">실제 AX 보기</span>
                </>
              ),
            }
      }
    />
  )
}
