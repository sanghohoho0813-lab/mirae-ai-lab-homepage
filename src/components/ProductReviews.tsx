// 상품 리뷰 섹션 — 승인된 후기 목록 + 작성 폼.
// 정책자금 컨설팅: 후기 작성 시 정가 237,000원 전자책 3종 증정(검토 후 이메일 발송) 인센티브 연동.
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { fetchReviews, submitReview, type PublicReview, type ReviewStats } from '../lib/reviews'

const band = 'px-5 py-16 sm:py-24'
const inner = 'mx-auto max-w-[720px]'
const kicker = 'text-center text-sm font-black uppercase tracking-widest text-blue-600'
const bigHead = 'mt-3 text-center text-[1.85rem] font-black leading-[1.28] tracking-tight text-slate-900 sm:text-[2.7rem]'

function Stars({ value, size = 'text-base' }: { value: number; size?: string }) {
  return (
    <span className={`inline-flex ${size} leading-none tracking-tight`} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= value ? 'text-amber-400' : 'text-slate-300'} aria-hidden>★</span>
      ))}
    </span>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          className="text-3xl leading-none transition-transform hover:scale-110"
          aria-label={`${n}점`}
        >
          <span className={n <= shown ? 'text-amber-400' : 'text-slate-300'}>★</span>
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-slate-500">{value ? `${value}.0` : '별점을 선택해 주세요'}</span>
    </div>
  )
}

function fmtDate(s: string): string {
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-1.5 block text-sm font-bold text-slate-800'

export default function ProductReviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [stats, setStats] = useState<ReviewStats>({ count: 0, avg: 0 })
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  // 폼 상태
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetchReviews(slug)
      .then((r) => { if (alive) { setReviews(r.reviews); setStats(r.stats) } })
      .catch(() => { /* 조회 실패 시 조용히 빈 목록 */ })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [slug])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr(null)
    if (!name.trim()) { setErr('성함(표시명)을 입력해 주세요.'); return }
    if (!(rating >= 1)) { setErr('별점을 선택해 주세요.'); return }
    if (content.trim().length < 5) { setErr('후기를 5자 이상 입력해 주세요.'); return }
    if (!agree) { setErr('개인정보 수집·이용에 동의해 주세요.'); return }
    setBusy(true)
    try {
      const msg = await submitReview({ slug, authorName: name.trim(), company: company.trim(), rating, content: content.trim(), email: email.trim(), phone: phone.trim() })
      setDone(msg)
      setName(''); setCompany(''); setRating(0); setContent(''); setEmail(''); setPhone(''); setAgree(false)
      setOpen(false)
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : '접수에 실패했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={`bg-white ${band}`}>
      <div className={inner}>
        <p className={kicker}>고객 후기</p>
        <h2 className={bigHead}>
          먼저 경험한 대표님들의<br /><span className="text-blue-600">솔직한 후기</span>
        </h2>

        {/* 전자책 인센티브 배너 */}
        <div className="mx-auto mt-7 max-w-lg rounded-2xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-center">
          <p className="text-[1.05rem] font-black text-slate-900">🎁 후기를 남겨주시면 전자책 3종을 드립니다</p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-600">
            컨설팅을 받으신 뒤 후기를 작성해 주시면, 정가 <b className="text-slate-900">237,000원</b> 상당의 정책자금 셀프 진행 전자책 3종을 검토 후 이메일로 보내드립니다.
          </p>
        </div>

        {/* 평점 요약 */}
        {stats.count > 0 && (
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5">
            <div className="text-center">
              <p className="text-4xl font-black tracking-tight text-slate-900">{stats.avg.toFixed(1)}</p>
              <Stars value={Math.round(stats.avg)} />
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <p className="text-sm font-semibold text-slate-500">후기 <b className="text-slate-900">{stats.count}</b>건</p>
          </div>
        )}

        {/* 작성 토글 */}
        {!open && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => { setOpen(true); setDone(null) }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              ✍️ 후기 작성하고 전자책 받기
            </button>
          </div>
        )}

        {/* 완료 안내 */}
        {done && (
          <div role="status" className="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-[1.02rem] font-semibold text-emerald-800">
            {done}
          </div>
        )}

        {/* 작성 폼 */}
        {open && (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5">
              <span className={labelClass}>별점 <span className="text-rose-500">*</span></span>
              <StarInput value={rating} onChange={setRating} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rv-name" className={labelClass}>표시명 <span className="text-rose-500">*</span></label>
                <input id="rv-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김대표 / 이○○" className={inputClass} />
              </div>
              <div>
                <label htmlFor="rv-company" className={labelClass}>회사·업종 <span className="font-medium text-slate-400">(선택)</span></label>
                <input id="rv-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="예: 제조업 / (주)미래상사" className={inputClass} />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="rv-content" className={labelClass}>후기 내용 <span className="text-rose-500">*</span></label>
              <textarea
                id="rv-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="어떤 점이 도움이 되셨는지 편하게 남겨주세요."
                className={`${inputClass} resize-y`}
              />
            </div>
            <div className="mt-5 rounded-2xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
              <p className="text-sm font-bold text-amber-800">🎁 전자책 3종을 받을 곳</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="rv-email" className={labelClass}>이메일</label>
                  <input id="rv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="전자책 받을 이메일" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="rv-phone" className={labelClass}>연락처 <span className="font-medium text-slate-400">(선택)</span></label>
                  <input id="rv-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="확인용 휴대폰 번호" className={inputClass} />
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-700/90">이메일·연락처는 전자책 발송·본인 확인 용도로만 사용되며 후기에는 공개되지 않습니다.</p>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />
              <span>
                후기 게시 및 전자책 발송을 위한 개인정보 수집·이용에 동의합니다.{' '}
                <Link to="/privacy" className="underline underline-offset-2 hover:text-slate-800">개인정보처리방침</Link>
              </span>
            </label>

            {err && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{err}</p>}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-amber-400 px-6 py-3.5 text-base font-black text-slate-900 shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {busy ? '접수 중…' : '후기 등록하기'}
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); setErr(null) }}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3.5 text-base font-bold text-slate-600 hover:bg-slate-50"
              >
                취소
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">등록하신 후기는 검토 후 게시됩니다. 광고성·비방·허위 내용은 게시되지 않을 수 있습니다.</p>
          </form>
        )}

        {/* 후기 목록 */}
        <div className="mx-auto mt-10 max-w-lg space-y-3">
          {loading ? (
            <p className="py-6 text-center text-sm text-slate-400">후기를 불러오는 중…</p>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
              <p className="text-[1.05rem] font-bold text-slate-700">아직 등록된 후기가 없습니다</p>
              <p className="mt-1.5 text-sm text-slate-500">첫 후기를 남기고 전자책 3종을 받아보세요.</p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[1.02rem] font-bold text-slate-900">{r.authorName}</span>
                      {r.company && <span className="truncate rounded-full bg-slate-100 px-2 py-0.5 text-[0.72rem] font-semibold text-slate-500">{r.company}</span>}
                    </div>
                    <Stars value={r.rating} size="text-sm" />
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-400">{fmtDate(r.createdAt)}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-[1.02rem] leading-relaxed text-slate-700">{r.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
