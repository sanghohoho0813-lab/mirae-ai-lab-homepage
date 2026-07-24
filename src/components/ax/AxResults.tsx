// SECTION 5 — 상담으로 끝나지 않고, 실제 확인할 수 있는 결과물 (기존 S6 결과물 + S7 구축수준 통합)
// 대표 미리보기 3장 크게: 관리자 대시보드(65) + 모바일 화면(74) + 구성/문서(67). 하단: 구축 수준 3단계.
import { useState } from 'react'
import { AX_BUILD_LEVELS, AX_DELIVERABLES, AX_RESULT_PREVIEW, ax, type AxImage } from '../../data/axShowcase'
import { AxImg, BrowserShell, PhoneShell, SectionHead } from './axFrames'
import AxLightbox from './AxLightbox'

export default function AxResults() {
  const [lb, setLb] = useState<AxImage | null>(null)
  const browser = ax(AX_RESULT_PREVIEW.browserNo)
  const phone = ax(AX_RESULT_PREVIEW.phoneNo)
  const doc = ax(AX_RESULT_PREVIEW.docNo)
  return (
    <section id="results" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-9 sm:px-6 sm:py-7">
        <SectionHead
          eyebrow="Deliverables & Scope"
          title="상담으로 끝나지 않고, 실제 확인할 수 있는 결과물을 만듭니다"
          desc="문서와 화면으로 남는 결과물, 그리고 어디까지 만들어지는지 구축 수준을 처음부터 명확히 합니다."
        />

        {/* 대표 미리보기 3장 — 데스크톱 3열 / 모바일 가로 스크롤 */}
        <div className="mt-6 flex items-end gap-4 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible">
          <figure className="w-[78%] shrink-0 sm:w-full">
            <BrowserShell label="관리자 대시보드">
              <button type="button" onClick={() => setLb(browser)} aria-label={`${browser.screen} 확대 보기`} className="group block w-full">
                <AxImg image={browser} sizes="(min-width:1024px) 380px, 78vw" className="w-full transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
              </button>
            </BrowserShell>
            <figcaption className="mt-2 text-center text-[0.82rem] font-bold text-slate-600">데스크톱 관리자 화면</figcaption>
          </figure>
          <figure className="w-[48%] shrink-0 sm:mx-auto sm:w-full sm:max-w-[220px]">
            <PhoneShell>
              <button type="button" onClick={() => setLb(phone)} aria-label={`${phone.screen} 확대 보기`} className="group block w-full">
                <AxImg image={phone} sizes="220px" className="w-full transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
              </button>
            </PhoneShell>
            <figcaption className="mt-2 text-center text-[0.82rem] font-bold text-slate-600">모바일 업무화면</figcaption>
          </figure>
          <figure className="w-[78%] shrink-0 sm:w-full">
            <BrowserShell label="구성·업무 흐름 문서">
              <button type="button" onClick={() => setLb(doc)} aria-label={`${doc.screen} 확대 보기`} className="group block w-full">
                <AxImg image={doc} sizes="(min-width:1024px) 380px, 78vw" className="w-full transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
              </button>
            </BrowserShell>
            <figcaption className="mt-2 text-center text-[0.82rem] font-bold text-slate-600">구성안·업무 흐름 문서</figcaption>
          </figure>
        </div>
        <p className="mt-2.5 text-center text-[0.72rem] font-medium text-slate-400">미리보기 화면은 가상 업종 기반 프로토타입 예시 · 누르면 크게 볼 수 있습니다.</p>

        {/* 결과물 9종 */}
        <ol className="mt-6 grid grid-cols-2 gap-2 lg:grid-cols-3">
          {AX_DELIVERABLES.map((d, i) => (
            <li key={d} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-slate-900 text-[0.68rem] font-black text-white">{i + 1}</span>
              <span className="text-[0.88rem] font-bold leading-tight text-slate-800">{d}</span>
            </li>
          ))}
        </ol>

        {/* 하단 — 구축 수준 3단계 */}
        <div className="mt-7">
          <p className="text-[0.95rem] font-black text-slate-900">구축 수준은 3단계로 나눠, 기본 제공 범위와 별도 개발 범위를 명확히 구분합니다.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {AX_BUILD_LEVELS.map((lv) => (
              <div key={lv.no} className={`flex flex-col rounded-2xl border-2 p-4 ${lv.tone === 'base' ? 'border-blue-500 bg-blue-50/40 shadow-lg shadow-blue-500/10' : lv.tone === 'mid' ? 'border-teal-300 bg-white' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[0.75rem] font-black ${lv.tone === 'base' ? 'bg-blue-600 text-white' : lv.tone === 'mid' ? 'bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-200' : 'bg-slate-100 text-slate-600'}`}>{lv.no}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[0.7rem] font-black ${lv.tone === 'ext' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' : lv.tone === 'mid' ? 'text-teal-600' : 'text-blue-600'}`}>{lv.provided}</span>
                </div>
                <h3 className="mt-3 text-[1.08rem] font-black leading-snug text-slate-900">{lv.name}</h3>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {lv.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-[0.88rem] leading-snug text-slate-600">
                      <span aria-hidden className={`mt-0.5 font-black ${lv.tone === 'ext' ? 'text-amber-500' : 'text-blue-500'}`}>{lv.tone === 'ext' ? '+' : '✓'}</span>{it}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-slate-100 pt-2 text-[0.78rem] font-semibold text-slate-500">{lv.scope}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.8rem] leading-relaxed text-slate-500">
            미래AI랩 기본 AX 컨설팅은 <b className="text-slate-700">1단계에서 시작해 기업 상황에 따라 2단계까지</b> 선택 확장합니다. 결제·문자·ERP 등 외부 연동이 필요한 <b className="text-slate-700">3단계는 별도 범위·견적</b>이며, 모든 기능을 기본 제공하지 않습니다.
          </p>
        </div>
      </div>
      <AxLightbox image={lb} onClose={() => setLb(null)} />
    </section>
  )
}
