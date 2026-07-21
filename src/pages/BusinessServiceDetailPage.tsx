// 서비스몰 공용 상품 상세페이지 — 한국형 "랜딩형" 상세 템플릿(슈가 컴퍼니류 리듬).
// /business-services/:slug 전 상품에 적용 (정책자금은 전용 페이지가 우선 매칭).
// 흐름: 히어로(구매+후킹 합본) → 밤잠 고민 공감(속마음) → 악화 시나리오 → 진짜 가치
//       리프레임(다크 · '사실 대표님이 사는 것') → 핵심 혜택 → 우리 방식(네이비) → 변화
//       → 추천 대상+결과물 → 왜 미래 AI 랩(신뢰) → FAQ → 최종 CTA(네이비) → 유의사항.
// 섹션마다 컬러 칩 아이브로우 + 큰 가운데 제목 + 리듬(배경/레이아웃) 변화로 술술 읽히게.
// 하단 상담 폼은 제거 — 상담은 모든 CTA에서 구글폼으로 연결(모바일은 하단 고정바가 따라다님).
// 결제: /checkout/:slug 별도 페이지 (PortOne V2). ⚠️ 결제/PortOne/API/slug/amount 로직은 미변경.
import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import HeaderAccount from '../components/account/HeaderAccount'
import LegalFooter from '../components/LegalFooter'
import ConsultModal from '../components/ConsultModal'
import { CONSULT_TOPIC_GROUPS, type ConsultContextRow } from '../lib/consultApi'
import { businessPackages, categoryToneClass, DISCLAIMER, getPackageBySlug } from '../data/businessPackages'
import { paymentsEnabled, paymentsPreparingNotice } from '../config/commerce'
import { getDetailContent } from '../data/businessDetailContent'

const band = 'px-5 py-16 sm:py-24'
const inner = 'mx-auto max-w-[720px]'

// 섹션별 컬러 칩(아이브로우) 톤 — 리듬용 포인트 컬러
const CHIP = {
  blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/15',
  rose: 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/15',
  emerald: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/15',
  violet: 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/15',
  sky: 'bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/15',
  slate: 'bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-300/50',
  dark: 'bg-white/10 text-amber-300',
}

// 신뢰 라인(누적 자금조달 실적) 미노출 상품 — 자금과 무관한 순수 구축형(IT) 상품만 제외
const NO_TRUST_IDS = new Set(['responsive-homepage', 'ai-ax-system', 'ax-full-package'])

// ─────────────────────────────────────────────────────────────────────────────
// 상세페이지 "보완중(teaser)" 모드 (기본 꺼짐)
//  · 켜면(true): 히어로+보완중 안내 + 고민/혜택/변화 + 마무리만 노출, 나머지 숨김.
//  ▶ 복원 사인: 채팅 "보완중" → true / "상세페이지 풀오픈" → false. (코드는 그대로 보존)
// ─────────────────────────────────────────────────────────────────────────────
const DETAIL_TEASER_MODE = false
const FULL_DETAIL_SLUGS = new Set<string>([]) // 여기에 slug 를 넣으면 그 상품만 전체 노출

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

// **강조** → 볼드(숫자·핵심 수치를 눈에 띄게)
function renderEmphasis(text: string) {
  return text.split(/\*\*/).map((seg, i) =>
    i % 2 === 1 ? (
      <b key={i} className="font-bold text-slate-900">{seg}</b>
    ) : (
      <span key={i}>{seg}</span>
    ),
  )
}

// 컬러 칩(아이브로우)
function Chip({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-black ${tone}`}>
      {children}
    </span>
  )
}

// 공용 섹션 헤더 — 가운데 정렬 칩 + 큰 제목
function SectionTitle({ chip, tone, dark, children }: { chip: ReactNode; tone: string; dark?: boolean; children: ReactNode }) {
  return (
    <div className="text-center">
      <Chip tone={tone}>{chip}</Chip>
      <h2 className={`mt-4 text-[2.05rem] font-black leading-[1.16] tracking-tight sm:text-[3rem] ${dark ? 'text-white' : 'text-slate-900'}`}>
        {children}
      </h2>
    </div>
  )
}

export default function BusinessServiceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const pkg = getPackageBySlug(slug)
  const [variantIdx, setVariantIdx] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    if (pkg) document.title = `${pkg.name} | 미래 AI 랩 서비스몰`
    window.scrollTo(0, 0)
    setVariantIdx(0)
  }, [pkg])

  // (구버전 호환) ?buy=1 링크 → 체크아웃 페이지로 이동
  useEffect(() => {
    if (!pkg) return
    const q = new URLSearchParams(window.location.search)
    if (q.get('buy') === '1' && pkg.priceType !== 'consult') {
      navigate(`/checkout/${pkg.slug}`, { replace: true })
    }
  }, [pkg, navigate])

  useEffect(() => {
    const onScroll = () => setShowBar(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!pkg) return <Navigate to="/business-services" replace />

  const content = getDetailContent(pkg.id, pkg.name)
  const flagship = pkg.flagship
  const consult = pkg.priceType === 'consult'
  const variants = pkg.variants
  const selected = variants?.[Math.min(variantIdx, variants.length - 1)]
  const displayPrice = selected ? `${(selected.amount / 10000).toLocaleString('ko-KR')}만원` : pkg.price
  const others = businessPackages.filter((p) => p.id !== pkg.id).slice(0, 3)

  // 강조 색 (대표 상품은 골드)
  const accentText = flagship ? 'text-amber-600' : 'text-blue-600'
  const checkBg = flagship ? 'bg-amber-500' : 'bg-blue-600'
  const priceColor = consult ? 'text-slate-800' : flagship ? 'text-amber-600' : 'text-slate-900'

  // 결제 대신 상담(구글폼) — consult 상품이거나 결제 시스템 준비 중(paymentsEnabled=false)일 때
  const inquiryOnly = consult || !paymentsEnabled

  // 보완중(teaser) 모드 — 핵심 섹션만 노출(위 DETAIL_TEASER_MODE 주석 참고)
  const trimmed = DETAIL_TEASER_MODE && !FULL_DETAIL_SLUGS.has(pkg.slug)

  // 상담 신청 시 함께 보낼 상품/선택 정보 (담긴 것 그대로 지메일로 전달)
  const consultContext: ConsultContextRow[] = [
    { label: '상품', value: pkg.name },
    ...(selected ? [{ label: '옵션', value: selected.label }] : []),
    { label: '가격', value: displayPrice },
  ]
  function handleInquiry() {
    setConsultOpen(true)
  }

  function handleBuy() {
    if (!pkg) return
    const opt = pkg.variants?.[Math.min(variantIdx, (pkg.variants?.length ?? 1) - 1)]
    navigate(`/checkout/${pkg.slug}${opt ? `?option=${encodeURIComponent(opt.optionId)}` : ''}`)
  }

  // 구매/상담 버튼 묶음 — 결제 가능 시 카드결제(체크아웃), 그 외에는 상담(구글폼)
  const BuyButtons = () =>
    inquiryOnly ? (
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={handleInquiry}
          className={`flex w-full items-center justify-center rounded-2xl px-6 py-4 text-lg font-black shadow-lg transition-transform hover:-translate-y-0.5 ${
            flagship ? 'bg-amber-400 text-slate-900 shadow-amber-500/25' : 'bg-slate-900 text-white shadow-slate-900/20'
          }`}
        >
          가능성 진단 신청하기 →
        </button>
        <p className="text-center text-xs font-medium text-slate-400">{consult ? '무료 · 신청 1~2분 · 진행 여부는 상담 후 결정' : paymentsPreparingNotice}</p>
      </div>
    ) : (
      <div>
        <button
          type="button"
          onClick={handleBuy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5"
        >
          <CartIcon /> 바로 결제하기
        </button>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1"><span className="text-emerald-500" aria-hidden>✔</span> 카드 할부 가능</span>
          <span className="inline-flex items-center gap-1"><span className="text-emerald-500" aria-hidden>✔</span> 결제 단계에서 개월 수 선택</span>
        </p>
        <button
          type="button"
          onClick={handleInquiry}
          className="mt-3 w-full text-center text-sm font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-900"
        >
          결제 전 상담하기 →
        </button>
      </div>
    )

  // 가격 + 옵션 + CTA 카드 (히어로 / 최종 CTA 공용 코어)
  const PriceCTACard = () => (
    <>
      {variants && (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {variants.map((v, i) => {
            const active = i === Math.min(variantIdx, variants.length - 1)
            return (
              <button
                key={v.label}
                type="button"
                onClick={() => setVariantIdx(i)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                  active ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {v.label}
                {v.badge && (
                  <span className={`ml-1.5 rounded px-1.5 py-0.5 text-[11px] font-black ${active ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-700'}`}>
                    {v.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
      <p className={`text-center text-4xl font-black tracking-tight sm:text-5xl ${priceColor}`}>{displayPrice}</p>
      {pkg.priceNote && <p className="mt-1.5 text-center text-sm font-medium text-slate-500">{pkg.priceNote}</p>}
      {!consult && <p className="mt-1.5 text-center text-sm font-semibold text-blue-600">💳 카드 무이자 할부 가능</p>}
      <div className="mt-5">
        <BuyButtons />
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-white pb-24 text-slate-900 antialiased [word-break:keep-all] sm:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-sm font-black tracking-tight text-sky-400">AI</span>
            <span className="flex flex-col leading-tight">
              <span className="text-[0.95rem] font-bold tracking-tight text-slate-900">미래 AI 랩</span>
              <span className="text-[0.8rem] font-medium text-slate-500">Mirae AI Lab · <b className="font-bold text-slate-800">미래경영지원센터</b></span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <button
              type="button"
              onClick={inquiryOnly ? handleInquiry : handleBuy}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
            >
              {inquiryOnly ? '가능성 진단' : '바로 결제하기'}
            </button>
            <HeaderAccount />
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.categoryLabel ?? pkg.category}</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.name}</span>
        </div>
      </div>

      {/* ── 히어로 (구매 + 후킹 합본) ─────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-[760px] px-5 py-12 text-center sm:py-16">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.categoryLabel ?? pkg.category}</span>
            {flagship ? (
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-900">★ 대표 상품</span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{pkg.badge}</span>
            )}
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">가능성 진단 무료</span>
          </div>

          <p className={`mt-6 text-sm font-black tracking-wide ${accentText}`}>{pkg.name}</p>
          <h1 className="mt-2 text-[2.2rem] font-black leading-[1.13] tracking-tight text-slate-900 sm:text-[3.3rem]">
            {content.hookLine}<br /><span className={accentText}>{content.hookAccent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[1.05rem] font-medium leading-relaxed text-slate-500 sm:text-lg">{content.hookSub}</p>

          {pkg.imageSrc && (
            <div className={`mx-auto mt-9 max-w-sm overflow-hidden rounded-3xl border bg-white shadow-xl ${flagship ? 'border-amber-300' : 'border-slate-200'}`}>
              <div className="relative aspect-[3/2]">
                <img src={pkg.imageSrc} alt={pkg.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          )}

          <div className="mx-auto mt-8 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)]">
            <PriceCTACard />
          </div>

          {!NO_TRUST_IDS.has(pkg.id) && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm font-bold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden>🏆</span> 누적 자금조달 100억+</span>
              <span className="text-slate-300" aria-hidden>·</span>
              <span>실무 경력 8년+</span>
            </div>
          )}
        </div>
      </section>

      {/* 보완중 안내 (보완중 모드에서만) */}
      {trimmed && (
        <section className={`bg-slate-900 ${band}`}>
          <div className="mx-auto max-w-[560px] px-1 text-center">
            <Chip tone={CHIP.dark}>🛠️ 상세페이지 보완 중</Chip>
            <h2 className="mt-4 text-[1.9rem] font-black leading-[1.25] tracking-tight text-white sm:text-[2.4rem]">
              더 자세한 내용은<br /><span className="text-amber-300">상담으로 안내드려요</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
              상담을 신청해 주시면 <b className="text-white">담당 팀장이 직접 연락</b>드려 대표님 상황에 맞게 안내드리겠습니다.
            </p>
            <div className="mx-auto mt-8 max-w-sm">
              <BuyButtons />
            </div>
          </div>
        </section>
      )}

      {/* ── 밤잠 고민 공감 (속마음 → 악화 시나리오) ─────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <SectionTitle chip="🌙 밤잠 설치는 고민" tone={CHIP.rose}>
            이런 고민,<br /><span className={accentText}>한 번쯤 해보셨죠?</span>
          </SectionTitle>
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {content.pains.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                <span className="mt-0.5 shrink-0 text-lg" aria-hidden>💬</span>
                <p className="text-[1.05rem] font-bold leading-snug text-slate-700">“{p}”</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-[1.35rem] font-black leading-snug text-slate-900 sm:text-2xl">
            이 문제들 <span className="text-rose-600">해결 안 하고 내버려두면요,</span>
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {content.losses.map((l) => (
              <div key={l.t} className="rounded-3xl border border-rose-100 bg-rose-50/50 p-6">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-2xl shadow-sm" aria-hidden>{l.icon}</span>
                <p className="mt-4 text-[1.15rem] font-extrabold leading-snug text-slate-900">{l.t}</p>
                <p className="mt-2 text-[0.98rem] leading-relaxed text-slate-500">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-5 text-center">
            <p className="text-[1.05rem] font-black leading-snug text-slate-900 sm:text-lg">{content.lossClosing}</p>
          </div>
        </div>
      </section>

      {/* ── 진짜 가치 리프레임 — 사실 대표님께 필요한 것 (다크) ────── */}
      <section className={`bg-slate-900 ${band}`}>
        <div className="mx-auto max-w-[640px] px-1 text-center">
          <Chip tone={CHIP.dark}>🎯 사실, 대표님께 필요한 건</Chip>
          <p className="mt-7 text-[1.1rem] font-bold text-slate-500 line-through decoration-slate-600 sm:text-[1.3rem]">{content.realBuyNot}</p>
          <h2 className="mt-2.5 text-[1.9rem] font-black leading-[1.24] tracking-tight text-white sm:text-[2.5rem]">
            <span className="text-amber-300">{content.realBuyIs}</span>입니다
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[1.02rem] font-medium leading-relaxed text-slate-300 sm:text-[1.08rem]">{content.realBuyDesc}</p>
          <p className="mx-auto mt-6 max-w-md border-t border-white/10 pt-5 text-sm leading-relaxed text-slate-400">
            미래 AI 랩은 필요한 것을 팔기 전에, <b className="text-slate-200">지금 무엇부터 해야 손실을 막을 수 있는지</b>부터 진단합니다.
          </p>
        </div>
      </section>

      {/* ── 핵심 혜택 ─────────────────────────────────────────────── */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <SectionTitle chip="💡 핵심 혜택" tone={CHIP.emerald}>
            정리하면,<br /><span className={accentText}>이런 게 좋아져요</span>
          </SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.benefits.map((b) => (
              <div key={b.t} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-50 text-2xl ring-1 ring-slate-200" aria-hidden>{b.icon}</span>
                  <p className="text-[1.12rem] font-extrabold leading-snug text-slate-900">{b.t}</p>
                </div>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-slate-600">{renderEmphasis(b.d)}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-slate-400">
            ※ 수치는 제도·시점·요건·심사에 따라 달라질 수 있고, 예시 금액은 이해를 돕기 위한 것입니다.
          </p>
        </div>
      </section>

      {/* ── 우리 방식 (네이비 · 리듬 전환) ────────────────────────── */}
      {!trimmed && (
        <section className={`bg-slate-900 ${band}`}>
          <div className={inner}>
            <SectionTitle chip="🧭 우리가 하는 일" tone={CHIP.dark} dark>
              혼자 하기 어려운 일,<br /><span className="text-amber-300">저희가 정리해드려요</span>
            </SectionTitle>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {content.whyPoints.map((w, i) => (
                <div key={w.t} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <span className="text-3xl font-black text-amber-300 sm:text-4xl">{`0${i + 1}`}</span>
                  <p className="mt-3 text-[1.1rem] font-bold text-white">{w.t}</p>
                  <p className="mt-1.5 text-[0.98rem] leading-relaxed text-slate-300">{w.d}</p>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-amber-400 px-6 py-5 text-center">
              <p className="text-[1.02rem] font-black leading-snug text-slate-900 sm:text-lg">{pkg.expectation}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── 변화 (Before → After) ─────────────────────────────────── */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <SectionTitle chip="💫 진행 후" tone={CHIP.violet}>
            {content.afterLine}<br /><span className={accentText}>{content.afterAccent}</span>
          </SectionTitle>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {content.afters.map((a) => (
              <div key={a.after} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">지금</p>
                <p className="mt-1 text-[0.95rem] font-semibold leading-snug text-slate-400 line-through decoration-slate-300">{a.before}</p>
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" aria-hidden />
                <p className={`text-[11px] font-black uppercase tracking-wide ${accentText}`}>진행 후</p>
                <p className="mt-1 text-[1.15rem] font-extrabold leading-snug text-slate-900">{a.after}</p>
              </div>
            ))}
          </div>
          <p className="mt-9 text-center text-[1.1rem] font-black text-slate-900 sm:text-xl">{content.afterClosing}</p>
        </div>
      </section>

      {/* 마무리 — 유선/카톡 안내(보완중 모드에서만) */}
      {trimmed && (
        <section className={`bg-slate-900 ${band}`}>
          <div className="mx-auto max-w-[560px] px-1 text-center">
            <h2 className="text-[1.9rem] font-black leading-[1.25] tracking-tight text-white sm:text-[2.4rem]">
              더 궁금한 점이<br /><span className="text-amber-300">있으신가요?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-300 sm:text-lg">
              자세한 내용은 <b className="text-amber-300">유선이나 카톡으로</b> 안내해 드릴게요. 편하게 남겨주세요.
            </p>
            <div className="mx-auto mt-8 max-w-sm">
              <BuyButtons />
            </div>
          </div>
        </section>
      )}

      {/* ↓↓↓ 보완중 모드에서 숨김(코드 보존 · "상세페이지 풀오픈" 시 복원) ↓↓↓ */}
      {!trimmed && (
        <>
          {/* ── 추천 대상 + 결과물 ─────────────────────────────────── */}
          <section className={`bg-slate-50 ${band}`}>
            <div className={inner}>
              <SectionTitle chip="🙌 추천 대상" tone={CHIP.sky}>
                이런 분들께<br /><span className={accentText}>추천드려요</span>
              </SectionTitle>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {pkg.recommendedFor.map((r) => (
                  <div key={r} className="flex items-start gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black text-white ${checkBg}`} aria-hidden>✓</span>
                    <p className="text-[1.05rem] font-semibold leading-snug text-slate-700">{r}</p>
                  </div>
                ))}
              </div>

              <div className="mt-14 text-center">
                <Chip tone={CHIP.slate}>📦 상담 후 남는 것</Chip>
                <h3 className="mt-3 text-[1.55rem] font-black leading-snug tracking-tight text-slate-900 sm:text-[2rem]">
                  이런 결과물이 남아요
                </h3>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pkg.deliverables.map((d, i) => (
                  <div key={d} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className={`text-xl font-black ${accentText}`}>{`0${i + 1}`}</span>
                    <p className="mt-2 text-[1.05rem] font-extrabold leading-snug text-slate-900">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {pkg.highlights.map((hi) => (
                  <span key={hi} className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">{hi}</span>
                ))}
              </div>
            </div>
          </section>

          {/* ── 왜 미래 AI 랩 (신뢰) ───────────────────────────────── */}
          <section className={`bg-white ${band}`}>
            <div className={inner}>
              <SectionTitle chip="🛡️ 왜 미래 AI 랩?" tone={CHIP.blue}>
                그냥 대행과는<br /><span className={accentText}>다릅니다</span>
              </SectionTitle>

              {!NO_TRUST_IDS.has(pkg.id) && (
                <div className="mx-auto mt-9 grid max-w-lg grid-cols-3 gap-3">
                  {[
                    { v: '100억+', l: '누적 자금조달' },
                    { v: '8년+', l: '실무 경력' },
                    { v: '무료', l: '가능성 진단' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl bg-slate-50 p-4 text-center ring-1 ring-slate-100">
                      <p className={`text-2xl font-black tracking-tight sm:text-3xl ${accentText}`}>{s.v}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {content.reasons.map((r) => (
                  <div key={r} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100 sm:flex-col sm:text-center">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-black text-white ${checkBg}`} aria-hidden>✓</span>
                    <p className="text-[1.05rem] font-bold text-slate-900">{r}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl bg-slate-900 p-7 text-center">
                <p className="text-[1.1rem] font-black text-white sm:text-xl">감이 아니라, <span className="text-sky-300">데이터로 진단합니다</span></p>
                <p className="mx-auto mt-3 max-w-md text-[0.98rem] leading-relaxed text-slate-300">
                  직접 개발하고 전문가 검증을 거친 <b className="text-white">자체 SaaS</b>가 인증·자금 심사 데이터를 반영해 진단 기준을 계속 다듬어 갑니다.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">🧠 데이터 학습</span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">🛠️ 자체 개발</span>
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200">✅ 전문가 검증</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── FAQ ────────────────────────────────────────────────── */}
          <section className={`bg-slate-50 ${band}`}>
            <div className={inner}>
              <SectionTitle chip="❓ 자주 묻는 질문" tone={CHIP.slate}>
                궁금한 점,<br /><span className={accentText}>미리 정리했어요</span>
              </SectionTitle>
              <div className="mt-9 space-y-3">
                {pkg.faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 [&_summary]:cursor-pointer">
                    <summary className="flex items-center justify-between gap-3 text-[1.1rem] font-bold text-slate-900 marker:content-['']">
                      <span className="flex items-start gap-2">
                        <span className={`font-black ${accentText}`} aria-hidden>Q</span>
                        <span>{f.q}</span>
                      </span>
                      <span className="ml-2 shrink-0 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="mt-3 pl-6 text-[1rem] leading-relaxed text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── 최종 CTA (네이비) ──────────────────────────────────── */}
          <section className={`bg-slate-900 ${band}`}>
            <div className="mx-auto max-w-[520px] px-1">
              <div className="text-center">
                <Chip tone={CHIP.dark}>🚀 지금 시작하기</Chip>
                <h2 className="mt-4 text-[1.95rem] font-black leading-[1.18] tracking-tight text-white sm:text-[2.6rem]">
                  고민만 하기엔,<br /><span className="text-amber-300">시간이 아깝잖아요</span>
                </h2>
              </div>
              <div className="mt-8 rounded-3xl bg-white p-7 shadow-2xl">
                <p className={`text-center text-sm font-black ${accentText}`}>{pkg.name}</p>
                <div className="mt-3">
                  <PriceCTACard />
                </div>
                <ul className="mx-auto mt-6 max-w-xs space-y-2.5 border-t border-slate-100 pt-6">
                  {pkg.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[1rem] text-slate-700">
                      <span className={`mt-0.5 font-black ${flagship ? 'text-amber-500' : 'text-blue-500'}`} aria-hidden>✓</span>{d}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-slate-100 pt-4 text-center text-[0.98rem] leading-relaxed text-slate-500">
                  지금 결정 안 하셔도 괜찮아요.<br />
                  <b className="text-slate-700">가능성만 먼저 확인</b>해 보세요. 확인은 무료예요.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 유의사항 + 다른 상품 */}
      <section className="bg-white px-5 pb-16 pt-4">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-[0.98rem] leading-relaxed text-slate-500">{pkg.notice ?? DISCLAIMER}</p>
        </div>
        <div className={`${inner} mt-8`}>
          <p className="text-center text-sm font-bold text-slate-700">다른 상품도 살펴보세요</p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.id}
                to={`/business-services/${o.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <LegalFooter
        topSlot={
          <Link to="/business-services" className="text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900">
            ← 서비스몰 홈으로
          </Link>
        }
      />

      {/* Mobile sticky CTA — 상담 모드에선 '가능 여부 확인' 진단형 프레이밍 */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          {inquiryOnly ? (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.92rem] font-black text-slate-900">우리 회사, 적용 가능 여부 확인</span>
              <span className="block truncate text-xs font-medium text-slate-500">가능성 진단 · 신청 1~2분</span>
            </span>
          ) : (
            <span className="shrink-0 text-lg font-black text-slate-900">{displayPrice}</span>
          )}
          <button
            type="button"
            onClick={inquiryOnly ? handleInquiry : handleBuy}
            className={`flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white ${inquiryOnly ? 'shrink-0' : 'flex-1'}`}
          >
            {inquiryOnly ? '가능성 진단' : <><CartIcon /> 바로 결제하기</>}
          </button>
        </div>
      )}

      <ConsultModal
        open={consultOpen}
        onClose={() => setConsultOpen(false)}
        source={pkg.name}
        contextRows={consultContext}
        heading={consult ? '가능성 진단 신청' : '상담 신청'}
        topicGroups={CONSULT_TOPIC_GROUPS}
        preselectProduct={pkg.name}
        showContactMethod
        showCompanyFields
      />
    </div>
  )
}
