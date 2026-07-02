// 대표자용 서비스몰 상품 카드 상단 썸네일. 외부 이미지 없이 CSS/HTML 로만
// 상품 내용을 보여주는 미니 목업을 그립니다. variant 는 패키지 id 를 받습니다.
import type { ReactNode } from 'react'

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-t-3xl border-b border-slate-100 bg-slate-50 p-4 sm:h-32">
      {children}
    </div>
  )
}

export default function PackageThumb({ variant }: { variant: string }) {
  switch (variant) {
    case 'fund-diagnosis':
      return (
        <Frame>
          <div className="flex h-full items-center gap-3">
            <div className="flex-1 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className="h-1.5 w-10 rounded bg-slate-300" />
              <div className="mt-1.5 space-y-1">
                <div className="h-1 w-full rounded bg-slate-100" />
                <div className="h-1 w-4/5 rounded bg-slate-100" />
              </div>
              <span className="mt-2 inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">✓ 검토</span>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <p className="text-[10px] text-slate-400">한도</p>
                <p className="text-xs font-extrabold text-slate-800">검토 중</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5">
                <p className="text-[10px] text-blue-500">금리 방향</p>
                <p className="text-xs font-extrabold text-blue-700">↓ 낮추기</p>
              </div>
            </div>
          </div>
        </Frame>
      )
    case 'gov-plan':
      return (
        <Frame>
          <div className="flex h-full gap-3">
            <div className="flex-1 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
              <div className="h-1.5 w-12 rounded bg-slate-300" />
              <div className="mt-1.5 space-y-1">
                <div className="h-1 w-full rounded bg-slate-100" />
                <div className="h-1 w-full rounded bg-slate-100" />
                <div className="h-1 w-3/5 rounded bg-slate-100" />
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <p className="text-[10px] text-slate-400">평가 항목</p>
                <div className="mt-1 flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <p className="text-[10px] text-slate-400">신청 일정</p>
                <div className="mt-1 flex items-end gap-0.5">
                  {[6, 9, 5, 8].map((h, i) => (
                    <span key={i} className="w-1.5 rounded-sm bg-slate-200" style={{ height: h }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Frame>
      )
    case 'venture-story':
      return (
        <Frame>
          <div className="flex h-full flex-col justify-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-slate-600">기술성</span>
              <span className="text-slate-300">→</span>
              <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-slate-600">성장성</span>
              <span className="text-slate-300">→</span>
              <span className="rounded bg-blue-600 px-1.5 py-0.5 text-white">벤처</span>
            </div>
            <div className="flex items-end gap-1">
              {[30, 45, 62, 82].map((h, i) => (
                <span key={i} className="w-3 rounded-t bg-blue-200" style={{ height: `${h * 0.28}px` }} />
              ))}
              <span className="ml-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                🏅 인증
              </span>
            </div>
          </div>
        </Frame>
      )
    case 'web-mvp':
      return (
        <Frame>
          <div className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </div>
            <div className="space-y-1.5 p-2.5">
              <div className="h-1.5 w-2/3 rounded bg-slate-200" />
              <div className="h-1 w-full rounded bg-slate-100" />
              <div className="h-1 w-5/6 rounded bg-slate-100" />
              <span className="mt-0.5 inline-block rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">시작하기</span>
            </div>
          </div>
        </Frame>
      )
    case 'lab-cert':
      return (
        <Frame>
          <div className="flex h-full gap-3">
            <div className="flex-1 space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm">
              {['연구소 요건', '인증 서류', '사후관리'].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-500">✓</span>
                  <span className="text-[10px] text-slate-500">{t}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-1">
              {['벤처', '이노비즈', '연구소'].map((t) => (
                <span key={t} className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-center text-[10px] font-bold text-slate-600">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Frame>
      )
    case 'full':
    default:
      return (
        <Frame>
          <div className="flex h-full flex-wrap items-center justify-center gap-1.5">
            {['자금', '인증', 'MVP', '사업계획'].map((t, i, arr) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
                  {t}
                </span>
                {i < arr.length - 1 && <span className="text-blue-300">→</span>}
              </span>
            ))}
          </div>
        </Frame>
      )
  }
}
