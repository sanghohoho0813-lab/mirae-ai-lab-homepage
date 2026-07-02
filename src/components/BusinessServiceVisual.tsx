// 대표자용 서비스몰 비주얼 컴포넌트 — 이미지 교체가 쉬운 구조.
//  - imageSrc 가 있으면 실제 이미지(<img>)를 보여줍니다.
//    (예: '/assets/business-services/fund-diagnosis.png' → public/assets/business-services/…)
//  - imageSrc 가 없으면 visualType 에 맞는 CSS/HTML mockup 을 보여줍니다.
// 부모가 비율(aspect) 컨테이너를 주고, 이 컴포넌트는 h-full w-full 로 채웁니다.
import type { ReactNode } from 'react'

export type BusinessVisualType = 'hero' | 'funding' | 'gov' | 'venture' | 'mvp' | 'lab' | 'full'

type Props = {
  type: BusinessVisualType
  imageSrc?: string
  alt?: string
  /** 좌하단 캡션(선택) — 이미지/목업 위 오버레이 */
  label?: string
}

// ── 작은 목업 조각들 ──────────────────────────────────────────────────────────
function WinBar({ title }: { title?: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-2.5 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
      <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      {title && <span className="ml-1.5 text-[10px] font-semibold text-slate-400">{title}</span>}
    </div>
  )
}

function Panel({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
      <p className="text-[10px] font-bold text-slate-500">{title}</p>
      <div className="mt-1.5 flex flex-1 flex-col justify-center">{children}</div>
    </div>
  )
}

function Bars({ widths }: { widths: string[] }) {
  return (
    <div className="space-y-1">
      {widths.map((w, i) => (
        <div key={i} className="h-1 rounded bg-slate-100" style={{ width: w }} />
      ))}
    </div>
  )
}

function Mockup({ type }: { type: BusinessVisualType }) {
  switch (type) {
    case 'hero':
      return (
        <div className="flex h-full flex-col bg-slate-100">
          <WinBar title="미래 AI 랩 · 대표님 대시보드" />
          <div className="grid flex-1 grid-cols-2 gap-2.5 p-3 sm:gap-3 sm:p-4">
            <Panel title="정책자금 진단">
              <div className="flex items-center gap-1.5">
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">금리 ↓</span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">한도</span>
              </div>
              <span className="mt-1.5 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">✓ 검토</span>
            </Panel>
            <Panel title="벤처인증 스토리">
              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500">
                기술성<span className="text-slate-300">→</span>성장성<span className="text-slate-300">→</span>
                <span className="rounded bg-blue-600 px-1 text-white">벤처</span>
              </div>
            </Panel>
            <Panel title="MVP 화면">
              <div className="overflow-hidden rounded border border-slate-200">
                <div className="h-2 bg-slate-100" />
                <div className="space-y-1 p-1.5">
                  <div className="h-1 w-2/3 rounded bg-slate-200" />
                  <span className="inline-block rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">시작하기</span>
                </div>
              </div>
            </Panel>
            <Panel title="사업계획서">
              <Bars widths={['100%', '90%', '70%']} />
            </Panel>
          </div>
        </div>
      )
    case 'funding':
      return (
        <div className="flex h-full items-center gap-3 bg-slate-100 p-4">
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="h-1.5 w-12 rounded bg-slate-300" />
            <div className="mt-2"><Bars widths={['100%', '80%']} /></div>
            <span className="mt-2 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">✓ 검토 완료</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              <p className="text-[10px] text-slate-400">한도</p>
              <p className="text-xs font-extrabold text-slate-800">검토 중</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2">
              <p className="text-[10px] text-blue-500">금리 방향</p>
              <p className="text-xs font-extrabold text-blue-700">↓ 낮추기</p>
            </div>
          </div>
        </div>
      )
    case 'gov':
      return (
        <div className="flex h-full gap-3 bg-slate-100 p-4">
          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            <div className="h-1.5 w-14 rounded bg-slate-300" />
            <div className="mt-2"><Bars widths={['100%', '100%', '60%']} /></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              <p className="text-[10px] text-slate-400">평가 항목</p>
              <div className="mt-1 flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
              <p className="text-[10px] text-slate-400">신청 일정</p>
              <div className="mt-1 flex items-end gap-0.5">
                {[7, 11, 6, 10].map((h, i) => (
                  <span key={i} className="w-2 rounded-sm bg-slate-200" style={{ height: h }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    case 'venture':
      return (
        <div className="flex h-full flex-col justify-center gap-3 bg-slate-100 p-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-600 shadow-sm">기술성</span>
            <span className="text-slate-300">→</span>
            <span className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-600 shadow-sm">성장성</span>
            <span className="text-slate-300">→</span>
            <span className="rounded bg-blue-600 px-2 py-1 text-white shadow-sm">벤처</span>
          </div>
          <div className="flex items-end gap-1.5">
            {[30, 48, 66, 88].map((h, i) => (
              <span key={i} className="w-4 rounded-t bg-blue-200" style={{ height: `${h * 0.4}px` }} />
            ))}
            <span className="ml-1.5 self-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
              🏅 인증
            </span>
          </div>
        </div>
      )
    case 'mvp':
      return (
        <div className="flex h-full items-center justify-center bg-slate-100 p-4">
          <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <WinBar />
            <div className="space-y-1.5 p-3">
              <div className="h-2 w-2/3 rounded bg-slate-200" />
              <div className="h-1 w-full rounded bg-slate-100" />
              <div className="h-1 w-5/6 rounded bg-slate-100" />
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-block rounded bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white">시작하기</span>
                <span className="inline-block rounded border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500">데모</span>
              </div>
            </div>
          </div>
        </div>
      )
    case 'lab':
      return (
        <div className="flex h-full gap-3 bg-slate-100 p-4">
          <div className="flex-1 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
            {['연구소 요건', '인증 서류', '사후관리'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-emerald-500">✓</span>
                <span className="text-[11px] text-slate-500">{t}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center gap-1.5">
            {['벤처', '이노비즈', '연구소'].map((t) => (
              <span key={t} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-center text-[11px] font-bold text-slate-600 shadow-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      )
    case 'full':
    default:
      return (
        <div className="flex h-full flex-wrap items-center justify-center gap-2 bg-slate-100 p-4">
          {['자금', '인증', 'MVP', '사업계획'].map((t, i, arr) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm">{t}</span>
              {i < arr.length - 1 && <span className="text-blue-300">→</span>}
            </span>
          ))}
        </div>
      )
  }
}

export default function BusinessServiceVisual({ type, imageSrc, alt, label }: Props) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      {imageSrc ? (
        <img src={imageSrc} alt={alt ?? ''} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <Mockup type={type} />
      )}
      {label && (
        <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur-sm">
          {label}
        </span>
      )}
    </div>
  )
}
