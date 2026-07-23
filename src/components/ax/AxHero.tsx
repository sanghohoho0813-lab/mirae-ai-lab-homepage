// SECTION 1 — Hero: 정책자금↔AX 인과를 첫 화면에서 직접 전달
// 데스크톱: 메인 브라우저 1(크고 선명) + 보조 브라우저 1 + 폰 1. 모바일: 폰 화면(74) 단일, contain.
import { Link } from 'react-router-dom'
import { AX_HERO, AX_HERO_FLOW, ax } from '../../data/axShowcase'
import { AxImg, BrowserShell, PhoneShell } from './axFrames'

const trustStats: { value: string; label: string }[] = [
  { value: '100억원+', label: '누적 자금조달 지원' },
  { value: '9년', label: '세무·노무·법무·자금 경험' },
  { value: 'ISO 3종', label: '9001·14001·45001 심사원' },
  { value: '직접 구현', label: '화면·프로토타입 자체 제작' },
]

export default function AxHero({ onShowcase }: { onShowcase: () => void }) {
  const phone = ax(AX_HERO.phone)
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8 lg:py-16">
        {/* 왼쪽 — 메시지 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8rem] font-semibold text-teal-200 backdrop-blur">
            정책자금 · 기업인증 · AX 운영시스템
          </span>
          <h1 className="mt-5 text-[1.85rem] font-black leading-[1.22] tracking-tight text-white sm:text-[2.6rem] sm:leading-[1.16]">
            정책자금 신청에서 끝내지 않습니다.<br />
            <span className="text-teal-300">평가받을 근거와 실제 운영 시스템</span>까지 함께 만듭니다.
          </h1>
          <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-slate-300 sm:text-[1.05rem]">
            기업진단과 자금전략을 먼저 세우고, 필요한 인증·연구개발 근거·업무 시스템을 <b className="text-white">기업 상황에 맞게 연결</b>합니다.
          </p>
          {/* 보조 흐름 라벨 */}
          <div className="mt-5 flex flex-wrap items-center gap-y-2">
            {AX_HERO_FLOW.map((w, i) => (
              <span key={w} className="flex items-center">
                {i > 0 && <span aria-hidden className="mx-1.5 text-teal-400/60">→</span>}
                <span className={`rounded-lg px-2.5 py-1 text-[0.82rem] font-black ${i === 3 ? 'bg-teal-400 text-slate-900' : 'bg-white/5 text-slate-200 ring-1 ring-inset ring-white/15'}`}>{w}</span>
              </span>
            ))}
          </div>
          <div className="mt-7 flex max-w-md flex-col gap-2.5 sm:flex-row">
            <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 py-3.5 text-base font-black text-slate-900 shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5">
              <span aria-hidden>🩺</span> 3분 기업진단 시작
            </Link>
            <button type="button" onClick={onShowcase} className="flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/10">
              AX 구축 예시 보기
            </button>
          </div>
          <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-6 sm:grid-cols-4">
            {trustStats.map((s) => (
              <div key={s.label}>
                <dd className="text-[1.2rem] font-black leading-none tracking-tight text-white">{s.value}</dd>
                <dt className="mt-1 text-[0.72rem] font-medium leading-snug text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* 오른쪽 — 프로토타입 목업 (데스크톱): 메인 1 크고 선명 + 보조 2 작게 */}
        <div className="relative hidden lg:block" aria-label="직접 구현한 업무시스템 화면 예시">
          <div className="relative h-[430px]">
            {/* 메인 브라우저 — 물류 입고검수 (가장 크고 선명) */}
            <div className="absolute left-0 top-2 w-[86%]">
              <BrowserShell label="물류 · 입고·검수·적치 관리">
                <img src={AX_HERO.browserMain.src} alt={AX_HERO.browserMain.alt} width={AX_HERO.browserMain.w} height={AX_HERO.browserMain.h} loading="eager" decoding="async" className="w-full" />
              </BrowserShell>
            </div>
            {/* 보조 브라우저 — 연구소 (작게, 뒤) */}
            <div className="ax-float-slow absolute -right-1 top-0 w-[40%] opacity-70">
              <BrowserShell label="연구소 · 과제관리">
                <img src={AX_HERO.browserSub.src} alt={AX_HERO.browserSub.alt} width={AX_HERO.browserSub.w} height={AX_HERO.browserSub.h} loading="eager" decoding="async" className="w-full" />
              </BrowserShell>
            </div>
            {/* 보조 폰 — 모바일 주문 (작게, 앞) */}
            <div className="ax-float absolute -bottom-2 right-4 w-[21%] min-w-[130px]">
              <PhoneShell>
                <AxImg image={phone} sizes="200px" eager className="w-full" />
              </PhoneShell>
            </div>
          </div>
          <p className="mt-5 text-right text-[0.72rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 화면 예시</p>
        </div>

        {/* 모바일 — 폰 화면 단일(74), contain·식별 가능한 크기 */}
        <div className="lg:hidden">
          <div className="mx-auto max-w-[220px]">
            <PhoneShell>
              <AxImg image={phone} sizes="220px" eager className="w-full" />
            </PhoneShell>
          </div>
          <p className="mt-2.5 text-center text-[0.72rem] font-medium text-slate-500">직접 설계·구현한 가상 업종 기반 프로토타입 예시</p>
        </div>
      </div>
    </section>
  )
}
