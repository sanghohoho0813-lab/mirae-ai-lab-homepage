// SECTION 3 — 미래AI랩 컨설팅 진행 6단계 (인터랙티브, 텍스트·UI카드 중심)
// 이미지는 4단계(화면 방향=68 1장) + 5단계(대표 프로토타입 2~3장)에만. 6단계=타임라인 UI.
import { useState } from 'react'
import { AX_PROCESS, ax, type AxImage } from '../../data/axShowcase'
import { AxImg, SectionHead } from './axFrames'
import AxLightbox from './AxLightbox'

const TIMELINE = [
  { label: '자금 신청 서류 접수', state: '완료', tone: 'done' },
  { label: '기관 보완자료 요청 대응', state: '진행 중', tone: 'now' },
  { label: 'AX 화면 2차 피드백 반영', state: '진행 중', tone: 'now' },
  { label: '다음 과제 · 연구소 신고일정 점검', state: '예정', tone: 'next' },
] as const

export default function AxProcessSection() {
  const [step, setStep] = useState(0)
  const [lb, setLb] = useState<AxImage | null>(null)
  const s = AX_PROCESS[step]
  return (
    <section id="process" className="scroll-mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-11 sm:px-6 sm:py-14">
        <SectionHead
          eyebrow="How We Work"
          title="상담 이후, 프로젝트는 이 순서로 진행됩니다"
          desc="단계마다 고객이 제공하는 것, 미래AI랩이 수행하는 것, 남는 결과물이 명확합니다."
        />

        <div className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)] lg:items-start">
          {/* 단계 선택 */}
          <div role="tablist" aria-label="진행 단계" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {AX_PROCESS.map((p, i) => {
              const on = i === step
              return (
                <button
                  key={p.no}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setStep(i)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-2.5 text-left transition-colors lg:w-full ${on ? 'border-blue-300 bg-white shadow-md' : 'border-transparent bg-white/60 hover:bg-white'}`}
                >
                  <span className={`text-[0.95rem] font-black tabular-nums ${on ? 'text-blue-600' : 'text-slate-300'}`}>{p.no}</span>
                  <span className={`whitespace-nowrap text-[0.95rem] font-bold lg:whitespace-normal ${on ? 'text-slate-900' : 'text-slate-500'}`}>{p.title}</span>
                </button>
              )
            })}
          </div>

          {/* 단계 상세 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-baseline gap-3">
              <span className="text-[1.6rem] font-black tabular-nums text-blue-600">{s.no}</span>
              <h3 className="text-[1.3rem] font-black tracking-tight text-slate-900">{s.title}</h3>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[0.78rem] font-black text-slate-400">고객이 제공하는 것</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-700">{s.client}</p>
              </div>
              <div className="rounded-2xl bg-blue-50/70 p-4">
                <p className="text-[0.78rem] font-black text-blue-600">미래AI랩이 수행하는 것</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-700">{s.lab}</p>
              </div>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-[0.92rem]">
              <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[0.75rem] font-black text-white">결과물</span>
              <b className="text-slate-800">{s.output}</b>
            </p>

            {/* 4단계 — 화면 방향(68) 1장 */}
            {s.no === '04' && s.imageNos && (
              <>
                <button type="button" onClick={() => setLb(ax(s.imageNos![0]))} className="group mt-5 block w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-0.5" aria-label={`${ax(s.imageNos[0]).screen} 확대 보기`}>
                  <AxImg image={ax(s.imageNos[0])} sizes="(min-width:1024px) 700px, 100vw" className="w-full transition-transform duration-300 group-hover:scale-[1.01] motion-reduce:transition-none" />
                </button>
                <p className="mt-2 text-[0.75rem] font-medium text-slate-400">화면 예시는 프로젝트 초기 방향을 함께 정하기 위한 디자인 가이드입니다.</p>
              </>
            )}

            {/* 5단계 — 대표 프로토타입 2~3장 */}
            {s.no === '05' && s.imageNos && (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {s.imageNos.map((no) => {
                    const im = ax(no)
                    return (
                      <button key={no} type="button" onClick={() => setLb(im)} className="group overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-0.5" aria-label={`${im.screen} 확대 보기`}>
                        <AxImg image={im} sizes="(min-width:640px) 240px, 100vw" className="w-full transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-[0.75rem] font-medium text-slate-400">가상 업종 기반 프로토타입 화면 예시 · 누르면 크게 볼 수 있습니다.</p>
              </>
            )}

            {/* 6단계 — 진행 타임라인 UI */}
            {s.no === '06' && (
              <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                <p className="text-[0.8rem] font-black text-slate-500">진행 상태 예시</p>
                <ul className="mt-3 space-y-2.5">
                  {TIMELINE.map((t) => (
                    <li key={t.label} className="flex items-center gap-3">
                      <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.6rem] font-black ${t.tone === 'done' ? 'bg-emerald-500 text-white' : t.tone === 'now' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{t.tone === 'done' ? '✓' : t.tone === 'now' ? '●' : ''}</span>
                      <span className="flex-1 text-[0.9rem] font-semibold text-slate-700">{t.label}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-black ${t.tone === 'done' ? 'bg-emerald-50 text-emerald-700' : t.tone === 'now' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{t.state}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <AxLightbox image={lb} onClose={() => setLb(null)} />
    </section>
  )
}
