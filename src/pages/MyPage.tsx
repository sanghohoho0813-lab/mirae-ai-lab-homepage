// /mypage (별칭 /account) — 공통 계정 허브.
// 탭: 내 정보 · 계정/보안 · 이용 상품 · 결제 내역 · 역할.
// 데이터는 기존 라이브러리 재사용(portal/platform/payments/identityVerification) — 신규 계산·컬럼 가정 없음.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Avatar from '../components/account/Avatar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import {
  accountEmail, connectedProviders, displayName, hasEmailPassword, memberTypeLabel, providerLabel, resolveAvatarUrl,
} from '../lib/accountDisplay'
import { addRole } from '../lib/identityVerification'
import { evaluateAccess, formatDate, formatDateTime, type ToolAccess } from '../lib/platform'
import { fetchMyAccess, fetchTrialTools, type DbTool } from '../lib/portal'
import { formatKrw, getOrder, loadLocalOrders, type LocalOrder, type OrderSummary } from '../lib/payments'
import { activeCouponAmount, formatWon, loadMyCoupons, type UserCoupon } from '../lib/coupons'
import { EmptyOrders, StatusBadge } from '../components/payment/PaymentUX'

type Tab = 'profile' | 'security' | 'products' | 'orders' | 'roles'
const TABS: { key: Tab; label: string }[] = [
  { key: 'profile', label: '내 정보' },
  { key: 'security', label: '계정 · 보안' },
  { key: 'products', label: '이용 상품' },
  { key: 'orders', label: '결제 내역' },
  { key: 'roles', label: '역할' },
]

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm font-semibold text-slate-500">{label}</span>
      <span className="min-w-0 break-all text-right text-sm font-bold text-slate-900">{children}</span>
    </div>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>{children}</section>
}

export default function MyPage() {
  const {
    loading, configured, user, profile, roles, memberType, needsOnboarding, isAdmin,
    getAccessToken, refreshProfile, resetPassword, signOut,
  } = useAuth()
  const navigate = useNavigate()

  const initialTab: Tab = typeof window !== 'undefined' && window.location.hash === '#roles' ? 'roles' : 'profile'
  const [tab, setTab] = useState<Tab>(initialTab)

  useEffect(() => { document.title = '마이페이지 | 미래 AI 랩' }, [])

  // ── 접근 제어 ──
  if (!configured) {
    return <PageShell title="마이페이지" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">서비스를 준비하고 있습니다.</p></PageShell>
  }
  if (loading) {
    return <PageShell title="마이페이지" compact><p className="mx-auto max-w-[500px] text-center text-slate-500">불러오는 중…</p></PageShell>
  }
  if (!user) return <Navigate to="/login?next=%2Fmypage" replace />
  if (needsOnboarding) return <Navigate to="/auth/onboarding?next=%2Fmypage" replace />

  const name = displayName(user, profile)
  const email = accountEmail(user, profile)
  const typeLabel = memberTypeLabel({ roles, memberType, needsOnboarding }) ?? '회원'
  const avatarUrl = resolveAvatarUrl(user)
  const providers = connectedProviders(user)
  const signupProvider = profile?.initial_signup_provider ?? (user.app_metadata?.provider as string | undefined) ?? (providers[0] ?? 'email')

  return (
    <PageShell title="마이페이지" subtitle="계정 정보와 이용 현황을 한 곳에서 관리하세요.">
      {/* 계정 요약 */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <Avatar name={name} imageUrl={avatarUrl} size={56} />
        <div className="min-w-0">
          <p className="truncate text-lg font-black tracking-tight text-slate-900">{name}</p>
          {email && <p className="truncate text-sm font-medium text-slate-500">{email}</p>}
          <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-black text-blue-700">{typeLabel}</span>
        </div>
      </div>

      {/* 탭 */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-current={tab === t.key ? 'page' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
              tab === t.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-5">
        {tab === 'profile' && (
          <ProfileTab
            name={name} email={email} typeLabel={typeLabel}
            signupProvider={signupProvider}
            createdAt={profile?.created_at} lastLoginAt={profile?.last_login_at}
            currentName={profile?.name ?? ''}
            onSaved={refreshProfile}
            userId={user.id}
          />
        )}
        {tab === 'security' && (
          <SecurityTab
            email={email} providers={providers} hasPassword={hasEmailPassword(user)}
            onResetPassword={resetPassword} onSignOut={async () => { await signOut(); navigate('/') }}
          />
        )}
        {tab === 'products' && <ProductsTab userId={user.id} configured={configured} />}
        {tab === 'orders' && <OrdersTab hasUser={!!user} />}
        {tab === 'roles' && (
          <RolesTab
            roles={roles} memberType={memberType} isAdmin={isAdmin}
            getAccessToken={getAccessToken} onChanged={refreshProfile}
          />
        )}
      </div>
    </PageShell>
  )
}

// ── A. 내 정보 ──
function ProfileTab({
  name, email, typeLabel, signupProvider, createdAt, lastLoginAt, currentName, onSaved, userId,
}: {
  name: string; email: string | null; typeLabel: string; signupProvider: string
  createdAt?: string; lastLoginAt?: string | null; currentName: string
  onSaved: () => Promise<void>; userId: string
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(currentName)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [coupons, setCoupons] = useState<UserCoupon[]>([])
  useEffect(() => { void loadMyCoupons().then(setCoupons) }, [])
  const couponTotal = activeCouponAmount(coupons)

  async function save() {
    if (busy || !supabase) return
    const next = value.trim()
    if (!next) { setMsg({ ok: false, text: '이름을 입력해주세요.' }); return }
    setBusy(true); setMsg(null)
    const { error } = await supabase.from('profiles').update({ name: next }).eq('id', userId)
    setBusy(false)
    if (error) { setMsg({ ok: false, text: '이름을 저장하지 못했어요. 잠시 후 다시 시도해주세요.' }); return }
    await onSaved()
    setEditing(false)
    setMsg({ ok: true, text: '이름을 변경했어요.' })
  }

  return (
    <Card>
      <h2 className="text-base font-black text-slate-900">내 정보</h2>
      <div className="mt-2">
        {!editing ? (
          <InfoRow label="이름">
            <span className="inline-flex items-center gap-2">
              {name}
              <button type="button" onClick={() => { setValue(currentName); setEditing(true); setMsg(null) }} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600 hover:bg-slate-200">수정</button>
            </span>
          </InfoRow>
        ) : (
          <div className="flex flex-col gap-2 border-b border-slate-100 py-3 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-slate-500 sm:w-20">이름</span>
            <input
              value={value} onChange={(e) => setValue(e.target.value)} autoFocus
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={save} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50">{busy ? '저장 중…' : '저장'}</button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100">취소</button>
            </div>
          </div>
        )}
        <InfoRow label="이메일">{email ?? '미등록'}</InfoRow>
        <InfoRow label="회원유형">{typeLabel}</InfoRow>
        <InfoRow label="가입 방식">{providerLabel(signupProvider)}</InfoRow>
        <InfoRow label="가입일">{formatDate(createdAt)}</InfoRow>
        <InfoRow label="마지막 로그인">{lastLoginAt ? formatDateTime(lastLoginAt) : '-'}</InfoRow>
      </div>
      {couponTotal > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="flex items-center gap-2 text-sm font-bold text-amber-800"><span aria-hidden>🎁</span> 보유 쿠폰</span>
          <span className="text-right">
            <span className="text-base font-black text-amber-700">{formatWon(couponTotal)}</span>
            <span className="ml-2 text-[0.72rem] font-medium text-amber-600/80">결제 오픈 시 사용 가능</span>
          </span>
        </div>
      )}
      {msg && <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{msg.text}</p>}
    </Card>
  )
}

// ── B. 계정 및 보안 ──
function SecurityTab({
  email, providers, hasPassword, onResetPassword, onSignOut,
}: {
  email: string | null; providers: string[]; hasPassword: boolean
  onResetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>; onSignOut: () => void
}) {
  const [pwSent, setPwSent] = useState(false)
  const [pwBusy, setPwBusy] = useState(false)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)

  async function handlePassword() {
    if (pwBusy || !email) return
    setPwBusy(true)
    await onResetPassword(email)
    setPwBusy(false)
    setPwSent(true)
  }

  return (
    <>
      <Card>
        <h2 className="text-base font-black text-slate-900">연결된 로그인 방식</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {providers.length === 0 && <span className="text-sm text-slate-400">연결된 로그인 방식이 없습니다.</span>}
          {providers.map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
              <span aria-hidden>{p === 'kakao' ? '💬' : p === 'google' ? '🔵' : '✉️'}</span>
              {providerLabel(p)}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-black text-slate-900">비밀번호</h2>
        {pwSent ? (
          <p className="mt-2 rounded-lg bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-800" role="status">
            <b>{email}</b> 로 {hasPassword ? '비밀번호 변경' : '비밀번호 설정'} 메일을 보냈어요. 메일의 링크에서 새 비밀번호를 설정해주세요.
          </p>
        ) : (
          <>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              {hasPassword
                ? '가입하신 이메일로 비밀번호 변경 링크를 보내드려요.'
                : '소셜 로그인으로 가입해 비밀번호가 없어요. 이메일로 비밀번호를 설정하면 이메일 로그인도 사용할 수 있어요.'}
            </p>
            <button
              type="button" onClick={handlePassword} disabled={pwBusy || !email}
              className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
            >
              {pwBusy ? '보내는 중…' : hasPassword ? '비밀번호 변경 메일 받기' : '비밀번호 설정 메일 받기'}
            </button>
          </>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-black text-slate-900">이메일 변경</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          이메일 변경은 보안을 위해 가입 완료 화면에서 확인 메일로 진행됩니다. 변경이 필요하면 고객센터로 문의해주세요.
        </p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-slate-900">로그아웃</h2>
            <p className="mt-1 text-sm text-slate-500">이 브라우저에서 로그아웃합니다.</p>
          </div>
          <button type="button" onClick={onSignOut} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100">로그아웃</button>
        </div>
      </Card>

      <Card className="border-rose-200">
        <h2 className="text-base font-black text-rose-700">회원탈퇴</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          탈퇴를 원하시면 아래 버튼을 눌러주세요. 계정·이용내역 삭제는 운영자가 확인 후 처리하며, 처리 전까지 로그인 상태가 유지될 수 있습니다.
        </p>
        {!confirmWithdraw ? (
          <button type="button" onClick={() => setConfirmWithdraw(true)} className="mt-3 rounded-xl border border-rose-300 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50">회원탈퇴 요청</button>
        ) : (
          <div className="mt-3 rounded-xl bg-rose-50 p-4">
            <p className="text-sm font-semibold text-rose-800">정말 탈퇴를 요청하시겠어요? 진행 중인 서비스·결제 건이 있으면 먼저 확인해주세요.</p>
            <div className="mt-3 flex gap-2">
              <a href="mailto:sanghohoho0813@gmail.com?subject=회원탈퇴%20요청" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-700">탈퇴 요청 메일 보내기</a>
              <button type="button" onClick={() => setConfirmWithdraw(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-white">취소</button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

// ── C. 이용 중인 상품 (MyToolsPage 와 동일 데이터: portal + evaluateAccess) ──
function ProductsTab({ userId, configured }: { userId: string; configured: boolean }) {
  const [tools, setTools] = useState<DbTool[]>([])
  const [access, setAccess] = useState<ToolAccess[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let active = true
    if (!configured) { setState('ready'); return }
    void Promise.all([fetchTrialTools(), fetchMyAccess(userId)])
      .then(([t, a]) => { if (active) { setTools(t); setAccess(a); setState('ready') } })
      .catch(() => { if (active) setState('error') })
    return () => { active = false }
  }, [userId, configured])

  const started = useMemo(
    () => tools.filter((t) => access.find((a) => a.tool_id === t.id && a.trial_started_at)),
    [tools, access],
  )

  if (state === 'loading') return <Card><p className="text-sm text-slate-500">이용 상품을 불러오는 중…</p></Card>
  if (state === 'error') return <Card><p className="text-sm text-rose-600">이용 상품을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p></Card>
  if (started.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-base font-bold text-slate-700">아직 이용 중인 상품이 없어요.</p>
        <p className="mt-1 text-sm text-slate-500">내 도구함에서 7일 무료 체험을 시작할 수 있어요.</p>
        <Link to="/my-tools" className="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">내 도구함으로 →</Link>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {started.map((tool) => {
        const rec = access.find((a) => a.tool_id === tool.id)
        const view = evaluateAccess(rec)
        return (
          <Card key={tool.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${view.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{view.statusLabel}</span>
                  {tool.category && <span className="text-xs font-semibold text-slate-400">{tool.category}</span>}
                </div>
                <h3 className="mt-1.5 text-base font-black text-slate-900">{tool.title}</h3>
                <div className="mt-1 space-y-0.5 text-xs text-slate-500">
                  {rec?.trial_started_at && <p>체험 시작 {formatDate(rec.trial_started_at)}</p>}
                  {view.expiresAt && <p>이용 종료 {formatDateTime(view.expiresAt)} · 남은 기간 <b className="text-slate-700">{view.remainingLabel}</b></p>}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {view.active && tool.external_url ? (
                  <a href={tool.external_url} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">바로가기 ↗</a>
                ) : (
                  <Link to="/my-tools" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">{view.active ? '관리' : '연장 · 결제'}</Link>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ── D. 결제 내역 (MyOrdersPage 와 동일 데이터: loadLocalOrders + getOrder) ──
function OrdersTab({ hasUser }: { hasUser: boolean }) {
  const [rows, setRows] = useState<{ local: LocalOrder; server: OrderSummary | null }[] | null>(null)
  const ranRef = useRef(false)

  useEffect(() => {
    if (!hasUser || ranRef.current) return
    ranRef.current = true
    const locals = loadLocalOrders()
    if (locals.length === 0) { setRows([]); return }
    void Promise.all(locals.map(async (local) => {
      const r = await getOrder(local.paymentId, local.orderAccessToken)
      return { local, server: r.ok ? r.order : null }
    })).then(setRows)
  }, [hasUser])

  if (rows === null) return <Card><p className="text-sm text-slate-500">결제 내역을 확인하는 중…</p></Card>
  if (rows.length === 0) return <EmptyOrders />

  return (
    <div className="space-y-3">
      {rows.map(({ local, server }) => {
        const status = server?.status ?? local.status
        const paidAt = server?.paidAt ?? null
        return (
          <Card key={local.paymentId}>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} />
              {server?.environment === 'test' && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-700">테스트</span>}
              <span className="ml-auto text-xs font-semibold text-slate-400">{new Date(local.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <p className="mt-2 text-base font-black leading-snug text-slate-900">{server?.productName ?? local.productName}</p>
            {(server?.optionName ?? local.optionName) && <p className="mt-0.5 text-sm text-slate-500">{server?.optionName ?? local.optionName}</p>}
            <div className="mt-2 space-y-0.5 text-xs text-slate-500">
              <p>주문번호 {server?.orderNumber ?? local.orderNumber}</p>
              {paidAt && <p>결제일 {formatDateTime(paidAt)}</p>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-black tabular-nums text-slate-900">{formatKrw(server?.amount ?? local.amount)}</span>
              <div className="flex gap-2">
                {server?.receiptUrl && <a href={server.receiptUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-50">영수증</a>}
                <Link to={`/payment/complete?paymentId=${encodeURIComponent(local.paymentId)}`} className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-bold text-white hover:bg-slate-700">상세보기</Link>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ── 역할 관리 (user_roles 복수 역할 · addRole 재사용) ──
function RolesTab({
  roles, memberType, isAdmin, getAccessToken, onChanged,
}: {
  roles: string[]; memberType: string | null | undefined; isAdmin: boolean
  getAccessToken: () => Promise<string | null>; onChanged: () => Promise<void>
}) {
  const navigate = useNavigate()
  const hasCeo = roles.includes('ceo') || memberType === 'business'
  const hasConsultant = roles.includes('consultant') || memberType === 'consultant'
  const [busy, setBusy] = useState<'ceo' | 'consultant' | null>(null)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const add = useCallback(async (role: 'ceo' | 'consultant') => {
    if (busy) return
    setBusy(role); setMsg(null)
    const token = await getAccessToken()
    if (!token) { setBusy(null); setMsg({ ok: false, text: '로그인이 만료됐어요. 다시 로그인해주세요.' }); return }
    const r = await addRole(token, role)
    setBusy(null)
    if (!r.ok) { setMsg({ ok: false, text: r.error ?? '역할을 추가하지 못했어요.' }); return }
    await onChanged()
    setMsg({ ok: true, text: `${role === 'ceo' ? '중소기업 대표' : '컨설턴트'} 역할이 추가됐어요.` })
  }, [busy, getAccessToken, onChanged])

  return (
    <div className="space-y-5" id="roles">
      <Card>
        <h2 className="text-base font-black text-slate-900">현재 역할</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {hasCeo && <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-black text-blue-700">중소기업 대표</span>}
          {hasConsultant && <span className="rounded-full bg-slate-900 px-3 py-1.5 text-sm font-black text-sky-300">컨설턴트</span>}
          {isAdmin && <span className="rounded-full bg-rose-50 px-3 py-1.5 text-sm font-black text-rose-700">관리자</span>}
          {!hasCeo && !hasConsultant && !isAdmin && <span className="text-sm text-slate-400">부여된 역할이 없습니다.</span>}
        </div>
        {hasCeo && hasConsultant && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="text-sm font-semibold text-slate-500">역할 전환 — 바로 이동</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate('/business-services')} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">대표자 서비스로</button>
              <button type="button" onClick={() => navigate('/my-tools')} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700">컨설턴트 도구로</button>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-black text-slate-900">역할 추가</h2>
        <p className="mt-1 text-sm text-slate-500">가입을 다시 하지 않아도 두 번째 역할을 추가할 수 있어요. 이미 보유한 역할은 추가되지 않습니다.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button" disabled={hasCeo || busy !== null} onClick={() => add('ceo')}
            className="flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasCeo ? '중소기업 대표 · 보유중' : busy === 'ceo' ? '추가 중…' : '중소기업 대표 역할 추가'}
          </button>
          <button
            type="button" disabled={hasConsultant || busy !== null} onClick={() => add('consultant')}
            className="flex items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hasConsultant ? '컨설턴트 · 보유중' : busy === 'consultant' ? '추가 중…' : '컨설턴트 역할 추가'}
          </button>
        </div>
        {msg && <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-medium ${msg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{msg.text}</p>}
      </Card>
    </div>
  )
}
