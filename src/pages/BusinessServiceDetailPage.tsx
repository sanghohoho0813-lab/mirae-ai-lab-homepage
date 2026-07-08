// 서비스몰 공용 상품 상세페이지 — 한국형 이커머스 "긴 세로 상세" 템플릿.
// /business-services/:slug 전 상품에 적용 (정책자금은 전용 페이지가 우선 매칭).
// 상단 구매영역(카페24형) + 후킹 → 고민 공감 → 왜 필요한가(네이비) → 믿을 수 있는 이유
// → 진행/결과 예시 카드(알림톡형·문서형, '예시' 명시) → 진행 과정 → 결과물 → 추천 대상
// → 재구매 CTA(네이비) → FAQ → 유의사항 → 상담 폼.
// 결제(포트원)는 연동 예정 → 구매 클릭 시 '곧 오픈' 안내 + 상담 폼 브릿지.
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BusinessInquiryForm from '../components/BusinessInquiryForm'
import { businessPackages, categoryToneClass, DISCLAIMER, getPackageBySlug } from '../data/businessPackages'
import { getDetailContent, type DetailCase } from '../data/businessDetailContent'

const band = 'px-5 py-16 sm:py-24'
const inner = 'mx-auto max-w-[720px]'
const bigHead = 'mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[2.7rem]'

// 공용 진행 과정 (상담 → 진단 → 방향 → 안내 → 협의)
const STEPS = [
  { t: '상담 신청', d: '편하게 남겨주세요. 담당자가 연락드릴게요.' },
  { t: '기업 현황 진단', d: '업종, 업력, 지금 상황을 같이 살펴봐요.' },
  { t: '준비 방향 정리', d: '뭘 먼저 하면 좋을지 순서를 잡아드려요.' },
  { t: '전략·자료 안내', d: '필요한 전략과 준비 자료를 알려드려요.' },
  { t: '이후 진행 협의', d: '진행할지 말지는 이야기해 보고 정하셔도 돼요.' },
]

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  )
}

// 진행/결과 예시 카드 (talk = 카톡 알림톡형 / doc = 문서형)
function CaseCard({ c, accent }: { c: DetailCase; accent: string }) {
  return (
    <div>
      <p className="text-center text-[1.6rem] font-black tracking-tight text-slate-900 sm:text-4xl">
        <span className={accent}>{c.bigAccent}</span> {c.bigRest}
      </p>
      <div className="mx-auto mt-5 max-w-sm overflow-hidden rounded-3xl bg-slate-200/70 shadow-xl ring-1 ring-slate-200">
        {c.style === 'talk' ? (
          <div className="flex items-center gap-2 bg-[#FEE500] px-4 py-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-[#3C1E1E] text-[10px] font-black text-[#FEE500]">TALK</span>
            <span className="text-sm font-black text-[#3C1E1E]">알림톡 도착</span>
            <span className="ml-auto rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-black text-[#3C1E1E]">예시</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-white/15 text-[12px]" aria-hidden>📄</span>
            <span className="text-sm font-black text-white">진행 결과 미리보기</span>
            <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-black text-white">예시</span>
          </div>
        )}
        <div className="p-4">
          <div className={`rounded-2xl bg-white p-4 shadow-sm ${c.style === 'talk' ? 'rounded-tl-md' : ''}`}>
            <p className="text-sm font-bold text-slate-900">{c.title}</p>
            {c.sub && <p className="mt-1 text-xs text-slate-400">{c.sub}</p>}
            <dl className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-[13px]">
              {c.rows.map((r) => (
                <div key={r.k} className="flex justify-between gap-3">
                  <dt className="shrink-0 text-slate-400">{r.k}</dt>
                  <dd className="text-right font-semibold text-slate-700">{r.v}</dd>
                </div>
              ))}
            </dl>
            <div className="relative mt-5 rounded-xl border-2 border-blue-600 bg-blue-50 px-4 py-3 text-center">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                {c.boxLabel}
              </span>
              <p className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{c.boxValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BusinessServiceDetailPage() {
  const { slug } = useParams()
  const pkg = getPackageBySlug(slug)
  const [variantIdx, setVariantIdx] = useState(0)
  const [showBar, setShowBar] = useState(false)
  const [payNotice, setPayNotice] = useState(false)

  useEffect(() => {
    if (pkg) document.title = `${pkg.name} | 미래 AI 랩 서비스몰`
    window.scrollTo(0, 0)
    setVariantIdx(0)
    setPayNotice(false)
  }, [pkg])

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
  const kicker = `text-center text-sm font-black uppercase tracking-widest ${accentText}`

  function handleBuy() {
    setPayNotice(true)
    scrollToId('apply')
  }

  // 구매/상담 버튼 묶음
  const BuyButtons = () =>
    consult ? (
      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => scrollToId('apply')}
          className={`flex w-full items-center justify-center rounded-xl px-6 py-4 text-lg font-black shadow-lg transition-transform hover:-translate-y-0.5 ${
            flagship ? 'bg-amber-400 text-slate-900 shadow-amber-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'
          }`}
        >
          무료 상담 신청하기
        </button>
        <p className="text-center text-xs font-medium text-slate-400">기업 상황에 따라 맞춤 안내드립니다</p>
      </div>
    ) : (
      <div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleBuy}
            className="flex flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-900 shadow-lg shadow-amber-500/20 transition-transform hover:-translate-y-0.5"
          >
            바로 구매하기
          </button>
          <button
            type="button"
            onClick={handleBuy}
            aria-label="장바구니"
            className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-4 font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <CartIcon />
          </button>
        </div>
        <button
          type="button"
          onClick={() => scrollToId('apply')}
          className="mt-3 w-full text-center text-sm font-semibold text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-900"
        >
          또는 무료 상담 신청하기 →
        </button>
      </div>
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
              <span className="text-[0.7rem] font-medium text-slate-500">Mirae AI Lab · 미래경영지원센터</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/business-services" className="hidden text-[0.95rem] font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline">서비스몰 홈</Link>
            <button
              type="button"
              onClick={consult ? () => scrollToId('apply') : handleBuy}
              className="rounded-lg bg-slate-900 px-4 py-2 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
            >
              {consult ? '상담 신청' : '바로 구매'}
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-5 py-3 text-sm text-slate-500 sm:px-6">
          <Link to="/business-services" className="font-medium hover:text-slate-900">서비스몰</Link>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.category}</span>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{pkg.name}</span>
        </div>
      </div>

      {/* ── 상단 구매영역 (카페24형) ───────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[900px] gap-7 px-5 py-8 sm:grid-cols-[minmax(0,340px)_1fr] sm:py-10">
          <div className={`relative aspect-[3/2] self-start overflow-hidden rounded-2xl border bg-slate-100 ${flagship ? 'border-amber-400 ring-1 ring-amber-300/40' : 'border-slate-200'}`}>
            {pkg.imageSrc && <img src={pkg.imageSrc} alt={pkg.name} className="absolute inset-0 h-full w-full object-cover" />}
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${categoryToneClass[pkg.category] ?? 'bg-slate-100 text-slate-600'}`}>{pkg.category}</span>
              {flagship ? (
                <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-black text-slate-900">★ 대표 상품</span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">{pkg.badge}</span>
              )}
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">리뷰 준비중</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{pkg.name}</h1>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-slate-600">{pkg.short}</p>

            {/* 옵션 선택 (ISO 등 variant 상품) */}
            {variants && (
              <div className="mt-4 flex flex-wrap gap-2">
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

            <div className="mt-4 flex items-end gap-2">
              <span className={`font-black tracking-tight ${consult ? 'text-3xl text-slate-700 sm:text-4xl' : `text-4xl sm:text-5xl ${flagship ? 'text-amber-600' : 'text-slate-900'}`}`}>
                {displayPrice}
              </span>
            </div>
            {pkg.priceNote && <p className="mt-1 text-sm font-medium text-slate-500">{pkg.priceNote}</p>}
            {!consult && (
              <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-blue-600"><span aria-hidden>💳</span> 카드 무이자 할부 가능</p>
            )}

            <div className="mt-5">
              <BuyButtons />
            </div>
          </div>
        </div>
      </section>

      {/* ── 긴 세로 상세 ───────────────────────────────────────── */}

      {/* Hero hook */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>{pkg.name}</p>
          <h2 className={bigHead}>
            {content.hookLine}<br /><span className={accentText}>{content.hookAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-center text-base font-medium leading-relaxed text-slate-600 sm:text-lg">{content.hookSub}</p>
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
            <span className="text-3xl font-black tracking-tight text-slate-900">{displayPrice}</span>
            {pkg.priceNote && <span className="text-xs font-medium text-slate-400">{pkg.priceNote}</span>}
          </div>
        </div>
      </section>

      {/* 공감 (이런 고민) */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue-50 text-4xl">{content.emoji}</div>
          <p className={kicker}>이런 고민, 있으시죠?</p>
          <h2 className={bigHead}>대표님만 <span className={accentText}>그런 게 아니에요</span></h2>
          <ul className="mx-auto mt-9 max-w-xl space-y-3">
            {content.pains.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base font-bold text-slate-800 sm:text-lg">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-black text-white ${flagship ? 'bg-amber-500' : 'bg-blue-600'}`} aria-hidden>?</span>
                “{p}”
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-lg font-black text-slate-900 sm:text-xl">
            그런데 이 고민들, <span className="text-red-600">미룰수록 비싸지더라고요.</span>
          </p>
        </div>
      </section>

      {/* 손실 환기 — 미루면 잃는 것 (적당한 긴장) */}
      <section className={`bg-rose-50/60 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-red-600">미루면 어떻게 될까요</p>
          <h2 className={bigHead}>
            가만히 두면,<br /><span className="text-red-600">이런 것들이 조용히 새나가요</span>
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {content.losses.map((l) => (
              <div key={l.t} className="flex flex-col rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-50 text-2xl" aria-hidden>{l.icon}</span>
                <p className="mt-3 text-base font-extrabold leading-snug text-slate-900">{l.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{l.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-center sm:p-7">
            <p className="text-lg font-black leading-snug text-white sm:text-xl">{content.lossClosing}</p>
            <p className="mt-2 text-sm font-semibold text-slate-400">그래도 다행인 건, 지금 시작해도 늦지 않았다는 거예요.</p>
          </div>
        </div>
      </section>

      {/* 왜 필요한가 (네이비) */}
      <section className={`bg-slate-900 ${band}`}>
        <div className={inner}>
          <p className="text-center text-sm font-black uppercase tracking-widest text-amber-300">그래서, 저희가 합니다</p>
          <h2 className="mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.7rem]">
            혼자 애쓰지 마세요<br /><span className="text-amber-300">저희가 이렇게 도와드릴게요</span>
          </h2>
          <div className="mt-10 space-y-4">
            {content.whyPoints.map((w, i) => (
              <div key={w.t} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="text-2xl font-black text-amber-300 sm:text-3xl">{`0${i + 1}`}</span>
                <div>
                  <p className="text-lg font-bold text-white sm:text-xl">{w.t}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300 sm:text-base">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-amber-400 p-6 text-center">
            <p className="text-base font-black text-slate-900 sm:text-lg">{pkg.expectation}</p>
          </div>
        </div>
      </section>

      {/* 변화 — 진행 후 달라지는 것 (Before → After) */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행하고 나면</p>
          <h2 className={bigHead}>
            대표님의 하루가<br /><span className={accentText}>이렇게 달라져요</span>
          </h2>
          <div className="mt-10 space-y-4">
            {content.afters.map((a) => (
              <div key={a.after} className="grid items-stretch gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_1.1fr] sm:gap-3 sm:p-5">
                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">지금</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-500 line-through decoration-slate-300 sm:text-[0.95rem]">{a.before}</p>
                </div>
                <div className={`flex items-center justify-center text-xl font-black sm:text-2xl ${accentText}`} aria-hidden>→</div>
                <div className={`rounded-xl p-4 ${flagship ? 'bg-amber-50 ring-1 ring-inset ring-amber-200' : 'bg-blue-50 ring-1 ring-inset ring-blue-100'}`}>
                  <p className={`text-[11px] font-black uppercase tracking-wide ${flagship ? 'text-amber-600' : 'text-blue-500'}`}>진행 후</p>
                  <p className="mt-1 text-[0.95rem] font-extrabold leading-snug text-slate-900 sm:text-base">{a.after}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-lg font-black text-slate-900 sm:text-xl">{content.afterClosing}</p>
        </div>
      </section>

      {/* 믿을 수 있는 이유 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>믿을 수 있는 이유</p>
          <h2 className={bigHead}>“왜 미래 AI 랩이냐”<br /><span className={accentText}>물으신다면요</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {content.reasons.map((r) => (
              <div key={r} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                <span className={`grid h-12 w-12 place-items-center rounded-full text-xl font-black text-white ${flagship ? 'bg-amber-500' : 'bg-blue-600'}`} aria-hidden>✓</span>
                <p className="mt-3 text-base font-bold text-slate-900">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행/결과 예시 */}
      {content.cases.length > 0 && (
        <section className={`bg-slate-50 ${band}`}>
          <div className={inner}>
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white text-4xl shadow-sm ring-1 ring-slate-200">🙋‍♂️</div>
            <p className={kicker}>{content.casesKicker}</p>
            <h2 className={bigHead}>
              {content.casesTitle}<br /><span className={accentText}>{content.casesAccent}</span>
            </h2>
            <div className="mt-12 space-y-14">
              {content.cases.map((c, i) => (
                <CaseCard key={i} c={c} accent={accentText} />
              ))}
            </div>
            <p className="mt-12 rounded-2xl border border-slate-200 bg-white p-4 text-xs leading-relaxed text-slate-500">
              ※ 위 화면은 이해를 돕기 위한 <b>예시</b>이며 실제 고객 정보가 아닙니다. 실제 결과(승인·인증·지급 여부, 금액·기간 등)는 기관 심사와 기업 상황에 따라 달라질 수 있으며 보장하지 않습니다.
            </p>
          </div>
        </section>
      )}

      {/* 진행 과정 */}
      <section id="flow" className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>진행 과정</p>
          <h2 className={bigHead}>이렇게 진행됩니다</h2>
          <ol className="mt-10 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-900 text-lg font-black text-white">{i + 1}</span>
                <div className="pt-1">
                  <p className="text-lg font-bold text-slate-900">{s.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500 sm:text-base">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-center text-sm text-slate-500">부담 갖지 마세요. 진행할지 말지는 이야기해 보고 정하셔도 됩니다.</p>
        </div>
      </section>

      {/* 제공 결과물 */}
      <section className={`bg-slate-50 ${band}`}>
        <div className={inner}>
          <p className={kicker}>제공 결과물</p>
          <h2 className={bigHead}>손에 쥐어지는 건<br /><span className={accentText}>이것들이에요</span></h2>
          <div className="mt-10 space-y-4">
            {pkg.deliverables.map((d, i) => (
              <div key={d} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className={`text-2xl font-black sm:text-3xl ${accentText}`}>{`0${i + 1}`}</span>
                <p className="text-lg font-extrabold text-slate-900 sm:text-xl">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {pkg.highlights.map((hi) => (
              <span key={hi} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/15">{hi}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 대상 */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>추천 대상</p>
          <h2 className={bigHead}>이런 대표님이라면<br /><span className={accentText}>잘 맞으실 거예요</span></h2>
          <ul className="mx-auto mt-10 max-w-xl space-y-3">
            {pkg.recommendedFor.map((r) => (
              <li key={r} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base font-semibold text-slate-800">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-black text-white ${flagship ? 'bg-amber-500' : 'bg-blue-600'}`} aria-hidden>✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 재CTA (네이비) */}
      <section className={`bg-slate-900 ${band}`}>
        <div className="mx-auto max-w-[520px] px-1">
          <p className="text-center text-sm font-black uppercase tracking-widest text-amber-300">고민은 여기까지</p>
          <h2 className="mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-white sm:text-[2.5rem]">{pkg.name}</h2>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white p-7 shadow-2xl">
            <p className={`text-center text-5xl font-black tracking-tight ${consult ? 'text-4xl text-slate-700' : flagship ? 'text-amber-600' : 'text-slate-900'}`}>
              {displayPrice}
            </p>
            {pkg.priceNote && <p className="mt-2 text-center text-sm font-medium text-slate-500">{pkg.priceNote}</p>}
            {!consult && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-blue-600"><span aria-hidden>💳</span> 카드 무이자 할부 가능</p>
            )}
            <ul className="mx-auto mt-6 max-w-xs space-y-2.5 border-t border-slate-100 pt-6">
              {pkg.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className={`mt-0.5 font-black ${flagship ? 'text-amber-500' : 'text-blue-500'}`} aria-hidden>✓</span>{d}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <BuyButtons />
            </div>
            <p className="mt-5 border-t border-slate-100 pt-4 text-center text-sm leading-relaxed text-slate-500">
              지금 당장 결정 안 하셔도 괜찮아요.<br />
              <b className="text-slate-700">무료 상담으로 가능성만 먼저 확인</b>해 두세요. 확인만 해두는 건 공짜니까요.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>자주 묻는 질문</p>
          <h2 className={bigHead}>{pkg.name} FAQ</h2>
          <div className="mt-9 space-y-3">
            {pkg.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 [&_summary]:cursor-pointer">
                <summary className="flex items-center justify-between text-base font-bold text-slate-900 marker:content-['']">
                  <span>Q. {f.q}</span>
                  <span className="ml-3 text-slate-400 transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 유의사항 */}
      <section className="bg-white px-5 pb-4">
        <div className={`${inner} rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6`}>
          <p className="text-sm font-bold text-slate-700">안내 및 유의사항</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{pkg.notice ?? DISCLAIMER}</p>
        </div>
      </section>

      {/* 상담 폼 */}
      <section id="apply" className={`bg-white ${band}`}>
        <div className={inner}>
          <p className={kicker}>무료 상담 신청</p>
          <h2 className={bigHead}>일단, 대표님 상황부터<br />같이 봐요</h2>
          <p className="mx-auto mt-4 max-w-md text-center text-base leading-relaxed text-slate-600">
            간단히만 남겨주세요. {pkg.name} 기준으로 뭐부터 하면 좋을지 정리해서 알려드릴게요.
          </p>
          {payNotice && (
            <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-800">
              🛒 온라인 카드결제(무이자 할부)는 지금 준비 중이에요. 우선 아래 <b>상담 신청</b>을 남겨주시면, 결제와 진행을 같이 안내드릴게요.
            </div>
          )}
          <div className="mt-8">
            <BusinessInquiryForm />
          </div>

          <div className="mt-12">
            <p className="text-sm font-bold text-slate-700">다른 상품도 살펴보세요</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to={`/business-services/${o.slug}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  {o.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} 미래 AI 랩 · 미래경영지원센터 — 중소기업 대표님을 위한 경영지원</p>
          <Link to="/business-services" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">← 서비스몰 홈으로</Link>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:hidden">
          <span className="shrink-0 text-lg font-black text-slate-900">{displayPrice}</span>
          <button
            type="button"
            onClick={consult ? () => scrollToId('apply') : handleBuy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white"
          >
            {consult ? '무료 상담 신청하기' : <><CartIcon /> 바로 구매하기</>}
          </button>
        </div>
      )}
    </div>
  )
}
