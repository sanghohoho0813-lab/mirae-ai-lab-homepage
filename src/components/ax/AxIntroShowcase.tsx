// SECTION 2 — 히어로 다음 첫 스크롤 화면. AX 화면 예시 5개를 먼저 보여준 뒤,
// "사업계획서만 준비하는 것이 아닙니다" 메시지와 진행속도·CTA로 이어간다.
// 업종 데이터는 #ax-showcase와 같은 단일 소스(AX_INDUSTRY_CARDS)를 그대로 읽어온다(내용 변경 없음).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AX_INDUSTRY_CARDS, type AxIndustryCard, type ShowcaseImg } from '../../data/axShowcase'
import AxPhotoSwipe, { type AxPswpSlide } from './AxPhotoSwipe'
import { SectionHead } from './axFrames'

// 미리보기 업종 5개 — 제조 · 도소매 · 학원 · B2B · 외식 프랜차이즈
const PREVIEW_KEYS = ['mfg', 'retail', 'classpilot', 'b2bsales', 'storepulse']

type Preview = { card: AxIndustryCard; img: ShowcaseImg; screen: string }

function previewOf(card: AxIndustryCard): Preview | null {
  if (card.screens.integrated) return { card, img: card.screens.integrated, screen: '통합 화면' }
  if (card.screens.pc) return { card, img: card.screens.pc, screen: '관리자·PC 화면' }
  if (card.screens.mobile) return { card, img: card.screens.mobile, screen: '현장·모바일 화면' }
  return null
}

const PREVIEWS: Preview[] = PREVIEW_KEYS.map((k) => AX_INDUSTRY_CARDS.find((c) => c.key === k))
  .filter((c): c is AxIndustryCard => Boolean(c))
  .map(previewOf)
  .filter((p): p is Preview => Boolean(p))

export default function AxIntroShowcase({ onShowcase, onProcess }: { onShowcase: () => void; onProcess: () => void }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides: AxPswpSlide[] = PREVIEWS.map((p) => ({
    src: p.img.src,
    width: p.img.w,
    height: p.img.h,
    alt: p.img.alt,
    caption: `${p.card.emoji} ${p.card.label} · ${p.screen}`,
  }))

  return (
    <section id="ax-preview" className="scroll-mt-16 border-t border-white/10 bg-slate-900">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <SectionHead
          dark
          eyebrow="AX 화면 미리보기"
          title={<>말로만 설명하지 않습니다. <span className="text-teal-300">이런 화면</span>을 직접 만들어 드립니다.</>}
          desc="업종별로 실제 업무가 돌아가는 화면입니다. 눌러서 크게 확인해보세요."
        />

        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-5">
          {PREVIEWS.map((p, i) => {
            // 5개를 2열로 놓으면 마지막 1개가 남는다 — 마지막 카드만 가로로 채운다(모바일·태블릿)
            const wide = i === PREVIEWS.length - 1
            return (
              <button
                key={p.card.key}
                type="button"
                onClick={() => { setIndex(i); setOpen(true) }}
                aria-label={`${p.card.label} ${p.screen} 크게 보기`}
                className={`flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-left transition-colors hover:bg-white/[0.08] sm:p-2.5 ${wide ? 'max-lg:col-span-2' : ''}`}
              >
                <div className={`flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 p-1 sm:h-[132px] ${wide ? 'h-[150px]' : 'h-[104px]'}`}>
                  <img
                    src={p.img.srcSm}
                    alt={p.img.alt}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                  <span aria-hidden className="text-[0.95rem] leading-none">{p.card.emoji}</span>
                  <span className="text-[0.9rem] font-black leading-tight text-white">{p.card.label}</span>
                  {p.card.status === 'similar' && (
                    <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[0.78rem] font-bold text-amber-200 ring-1 ring-inset ring-amber-400/30">유사 사례</span>
                  )}
                </div>
                <p className="mt-1 break-keep text-[0.82rem] leading-snug text-slate-400">{p.card.tasks.slice(0, 3).join(' · ')}</p>
              </button>
            )
          })}
        </div>

        <button type="button" onClick={onShowcase} className="mt-3.5 inline-flex items-center gap-1 text-[0.9rem] font-semibold text-teal-200/90 underline underline-offset-4 transition-colors hover:text-teal-100">
          16개 업종 화면 전체 보기 <span aria-hidden>↓</span>
        </button>

        {/* 핵심 메시지 — 화면을 본 직후에 읽히도록 바로 뒤에 둔다 */}
        <p className="mt-8 break-keep border-t border-white/10 pt-8 text-[1.2rem] font-black leading-snug tracking-tight text-white sm:mt-10 sm:pt-10 sm:text-[1.6rem]">
          사업계획서만 준비하는 것이 아닙니다.<br />
          <span className="text-teal-300">자금전략과 실제 업무에 사용할 AX 프로그램</span>을 함께 만듭니다.
        </p>

        <div className="mt-5 max-w-2xl break-keep border-l-2 border-amber-400 pl-3.5">
          <p className="text-[0.95rem] leading-snug text-amber-100 sm:text-[1rem]">
            인터뷰와 동시에 설계를 시작합니다. 1~2일 안에 방향을 보여드리고, 5일 안에 MVP 초안을 만듭니다.
          </p>
          <p className="mt-1.5 text-[0.95rem] font-bold leading-snug text-amber-100 sm:text-[1rem]">
            피드백과 보완을 거쳐 <span className="text-amber-300">최대 2주</span> 안에 최종 결과물 완성을 목표로 합니다.
          </p>
        </div>
        <p className="mt-2.5 max-w-2xl break-keep text-[0.82rem] leading-relaxed text-slate-500">
          자료가 모두 접수되고 의사결정이 원활한 경우의 목표 일정입니다. 정책기관 심사기간과 별도 본개발 일정은 포함하지 않습니다.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-3 sm:max-w-lg sm:flex-row">
          <Link to="/business-diagnosis" className="shine-cta flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5 hover:bg-blue-400">
            <span aria-hidden>🩺</span> 3분 기업진단
          </Link>
          <button type="button" onClick={onProcess} className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-white/10">
            2주 진행과정 보기 <span aria-hidden>→</span>
          </button>
        </div>

        {/* 신뢰 바 — 선별 진행 사실을 한 줄로만 */}
        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:gap-4 sm:p-3.5">
          <img src="/assets/profile/ceo-avatar.webp" alt="미래 AI 랩 대표 프로필" loading="lazy" decoding="async" width={96} height={96} className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-amber-400/40 sm:h-12 sm:w-12" />
          <div className="min-w-0 flex-1">
            <p className="break-keep text-[0.85rem] font-black leading-snug text-white sm:text-[0.9rem]">
              월 5개사 선별 · 김팀장 직접 참여 · 최대 2주 완성 목표
            </p>
            <p className="mt-0.5 break-keep text-[0.82rem] leading-snug text-slate-400">
              정책자금 전문 · 누적 자금조달 지원 100억원+ · 개발 담당자 공동 참여
            </p>
          </div>
        </div>

        <p className="mt-5 break-keep text-[0.82rem] leading-relaxed text-slate-500">
          가상 업종 시나리오로 제작한 프로토타입 화면입니다. 상호·수치는 시연용 예시이며, 기업별 업무분석 후 실제 작동형 시스템으로 확장합니다.
        </p>
      </div>

      <AxPhotoSwipe open={open} slides={slides} index={index} onClose={() => setOpen(false)} />
    </section>
  )
}
