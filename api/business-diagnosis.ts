// /api/business-diagnosis — 3분 AX Fit 익명 저장 API (action: session | submit | event).
// 자체 포함(외부 helper import 0개) + 동적 supabase import. service_role 전용.
// ⚠️ SUPABASE_SERVICE_ROLE_KEY 는 서버에서만 사용 (VITE_ 환경변수 금지, 프론트 노출 금지).
// 원칙:
//  - 클라이언트가 보낸 리드 점수·등급을 신뢰하지 않음 → 서버가 답변 기준으로 재계산
//  - 전화번호 정규화·필수값 검증·enum 차단·길이 제한·HTML 제거·honeypot·과속 제출 차단
//  - 같은 session_token 재제출 시 기존 리드 갱신(중복 리드 생성 방지, idempotent)
//  - 개인정보(전화·이메일)는 로그에 출력하지 않음

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

/** 뒷정리 작업이 함수 실행시간 상한까지 매달리지 않도록 상한을 둔다. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>
  return Promise.race([
    p,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label} 시간 초과 (${ms}ms)`)), ms)
    }),
  ]).finally(() => clearTimeout(timer)) as Promise<T>
}

// ── 진단 결과 알림 메일 (Resend) ──────────────────────────
// submit 시점에 대표자에게 진단 요약을 이메일로 발송. inquiry.ts 와 동일한 env 사용.
//   RESEND_API_KEY(필수) · INQUIRY_TO_EMAIL(기본 sanghohoho0813@gmail.com) · INQUIRY_FROM_EMAIL
// 메일 실패가 리드 저장/응답을 깨지 않도록 호출부에서 try/catch 로 감쌈.
function escapeHtml(v: string): string {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ── 관심 분야 목차 ────────────────────────────────────────
// 화면(src/lib/consultApi.ts CONSULT_INTEREST_GROUPS)과 같은 순서·묶음으로 메일에도 박스로 보여준다.
// ⚠️ 이 파일은 외부 helper 를 import 하지 않는 규칙이라 목록을 여기에 한 벌 더 둔다. 화면 쪽을 고치면 여기도 같이 고칠 것.
const INTEREST_GROUPS: Array<{ no: number; title: string; hint?: string; color: string; items: string[] }> = [
  { no: 1, title: '연 2%대 · 최대 10억 — 성장자금이 필요하다면', color: '#2563eb', items: ['정책자금'] },
  { no: 2, title: '정부지원사업 · 정부지원금을 놓치고 있다면', color: '#0284c7', items: ['정부지원사업', 'R&D 과제', '고용지원금'] },
  { no: 3, title: '외부에서 볼 때 좋은 회사로 보이고 싶다면', color: '#059669', items: ['벤처기업 인증', '기업부설연구소', '이노비즈 인증', '메인비즈 인증', 'ISO 인증'] },
  { no: 4, title: '사람을 뽑고, 오래 다니게 하고 싶다면', color: '#d97706', items: ['사내(공동)근로복지기금'] },
  { no: 5, title: '일하는 방식을 바꾸고 싶다면', color: '#ea580c', items: ['AX 풀 패키지', '소형 업무자동화', '사업화 아이디어 MVP', '반응형 홈페이지'] },
  { no: 6, title: '세금을 줄이고 회사 자산을 정리하고 싶다면', hint: '세무사 등 각 분야 전문가와 함께 검토', color: '#7c3aed', items: ['가지급금 정리', '이익잉여금 처분', '가업승계 증여특례', '배우자 증여 이익소각'] },
]
// 화면에서 자동으로 덧붙는 내부 표기 — 고른 항목과 겹쳐서 메일에는 싣지 않는다
const INTEREST_INTERNAL = ['정책·R&D·기업성장 전략 검토 희망']
// 유입 트랙(Full AX / 기술사업·MVP) — 클라이언트가 interests[] 에 이 접두로 넣어 보낸다(src/lib/interestTrack.ts).
// 분야 박스가 아니라 위쪽 표에 한 줄로 보여준다.
const INTEREST_TRACK_PREFIX = '유입 트랙: '
const isTrackLabel = (x: unknown): x is string => typeof x === 'string' && x.startsWith(INTEREST_TRACK_PREFIX)
const trackOf = (interests: unknown[]): string => {
  const hit = interests.find(isTrackLabel)
  return hit ? hit.slice(INTEREST_TRACK_PREFIX.length) : ''
}

/** 고른 분야를 목차별 박스로. 고르지 않았으면 빈 문자열. */
function renderInterestBoxes(interests: string[]): string {
  const picked = interests.filter((x) => typeof x === 'string' && x && !INTEREST_INTERNAL.includes(x) && !isTrackLabel(x)).slice(0, 40)
  if (!picked.length) return ''
  const known = new Set<string>()
  const boxes = INTEREST_GROUPS.map((g) => {
    const hit = g.items.filter((i) => picked.includes(i))
    hit.forEach((i) => known.add(i))
    if (!hit.length) return ''
    return `
      <div style="border:1px solid #e2e8f0;border-left:4px solid ${g.color};border-radius:8px;padding:10px 12px;margin:0 0 8px">
        <p style="margin:0;font-size:11px;font-weight:800;color:${g.color};line-height:1.5">${g.no}. ${escapeHtml(g.title)}${g.hint ? ` <span style="font-weight:500;color:#94a3b8">(${escapeHtml(g.hint)})</span>` : ''}</p>
        <p style="margin:5px 0 0;font-size:14px;font-weight:700;color:#0f172a;line-height:1.6">${hit.map((i) => escapeHtml(i)).join(' · ')}</p>
      </div>`
  }).join('')
  const rest = picked.filter((x) => !known.has(x))
  const restBox = rest.length
    ? `<div style="border:1px solid #e2e8f0;border-left:4px solid #94a3b8;border-radius:8px;padding:10px 12px;margin:0 0 8px">
        <p style="margin:0;font-size:11px;font-weight:800;color:#64748b">기타</p>
        <p style="margin:5px 0 0;font-size:14px;font-weight:700;color:#0f172a;line-height:1.6">${rest.map((i) => escapeHtml(i)).join(' · ')}</p>
      </div>`
    : ''
  return `<div style="padding:14px 16px;border-top:8px solid #f1f5f9">
      <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#2563eb">🔖 함께 검토하고 싶은 분야 (${picked.length}개)</p>
      ${boxes}${restBox}
    </div>`
}

/** 같은 내용을 텍스트 메일용으로 */
function interestLines(interests: string[]): string {
  const picked = interests.filter((x) => typeof x === 'string' && x && !INTEREST_INTERNAL.includes(x) && !isTrackLabel(x)).slice(0, 40)
  if (!picked.length) return ''
  const known = new Set<string>()
  const lines = INTEREST_GROUPS.map((g) => {
    const hit = g.items.filter((i) => picked.includes(i))
    hit.forEach((i) => known.add(i))
    return hit.length ? `${g.no}. ${g.title}${g.hint ? ` (${g.hint})` : ''}\n   - ${hit.join(' · ')}` : ''
  }).filter(Boolean)
  const rest = picked.filter((x) => !known.has(x))
  if (rest.length) lines.push(`기타\n   - ${rest.join(' · ')}`)
  return '\n\n[함께 검토하고 싶은 분야]\n' + lines.join('\n')
}

// 문자열/객체 배열을 사람이 읽을 수 있는 줄 목록으로 (라벨 매핑 불필요)
function asLines(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v
    .map((it) => {
      if (it === null || it === undefined) return ''
      if (typeof it === 'string') return it
      if (typeof it === 'object') {
        const o = it as Record<string, unknown>
        const pick = (k: string) => (typeof o[k] === 'string' ? (o[k] as string) : '')
        const main = pick('title') || pick('label') || pick('name') || pick('task') || pick('action') || pick('text') || pick('headline')
        const sub = pick('reason') || pick('desc') || pick('detail') || pick('note')
        if (main) return sub ? `${main} — ${sub}` : main
        try { return JSON.stringify(o).slice(0, 200) } catch { return '' }
      }
      return String(it)
    })
    .filter(Boolean)
    .slice(0, 40)
}

const bizTypeLabel = (t: string) => (t === 'corp' ? '법인' : t === 'individual' ? '개인사업자' : t === 'pre' ? '예비창업' : t || '-')
const depthLabel = (d: string) => (d === 'comprehensive' ? 'AX Fit 진단 완료' : d === 'funding' ? '(구) 자금 단계' : d === 'basic' ? '(구) 기본 단계' : d || '-')

// 리드 플래그 → 한글 라벨
const FLAG_LABELS: Record<string, string> = {
  hot: '🔥 최우선(핫리드)',
  pkg_mvp: '추천 시작: MVP',
  pkg_platform: '추천 시작: 플랫폼형',
  pkg_full: '추천 시작: 풀 패키지',
  pkg_step_up: '단계적 확장 대상',
  need_fund: '정책자금 필요',
  need_grant: '정부지원사업 준비',
  need_invest: '투자 유치 앞둠',
  need_cert: '벤처기업확인·인증 준비',
  deadline_1m: '⏰ 1개월 안 일정',
  budget_ready: '예산 1,500만 원 이상',
  budget_after_funding: '자금 들어온 뒤 결정(후불 희망)',
  just_browsing: '알아보는 중(정보형)',
  over_50: '50인 이상(대상 확인 필요)',
  growth_interest: '정책·R&D·성장전략 함께 검토 희망',
  no_internal_owner: '내부 담당자 미정',
  consultation_opt_in: '상담 신청 동의',
  // 구버전 리드 호환
  ax_high_priority: 'AX HIGH PRIORITY(구)',
  ax_full_candidate: 'AX FULL 후보(구)',
  ax_lite: 'AX LITE(구)',
  ax_no_go: 'AX NO-GO(구)',
  funding_urgent: '자금 시급(구)',
  certification_interest: '인증 관심(구)',
  employment_interest: '고용지원금 관심(구)',
  digital_interest: 'AX·디지털 관심(구)',
  prerequisite_issue: '선결과제(구)',
  information_only: '정보만 원함(구)',
}
const flagLabel = (f: string) => FLAG_LABELS[f] || f

type AnswersDisplayStage = { stage: number; name: string; items: { q: string; a: string }[] }

async function sendDiagnosisEmail(p: {
  companyName: string; repName: string; phone: string; email: string
  businessType: string; industry: string; contactMethod: string; preferredContactTime: string
  consultationConsent: boolean; marketingConsent: boolean
  grade: string; score: number; flags: string[]
  completedStage?: number; stoppedAfterStage?: boolean; depth?: string
  summary: Record<string, unknown>; interests: string[]; recProducts: unknown; answers: Record<string, unknown>
  answersDisplay?: AnswersDisplayStage[]
  companyProfile?: Record<string, string>
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[business-diagnosis] RESEND_API_KEY 미설정 — 진단 알림 메일 생략')
    return
  }
  const to = process.env.INQUIRY_TO_EMAIL || 'sanghohoho0813@gmail.com'
  const from = process.env.INQUIRY_FROM_EMAIL || 'AI Business Lab <onboarding@resend.dev>'
  const receivedAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', dateStyle: 'long', timeStyle: 'short' })
  const s = p.summary || {}
  // 메일 제목·본문에 들어가는 결과 문구는 길이를 자른다(제출 값이 거대하면 메일이 넘쳤다)
  const str = (k: string) => (typeof s[k] === 'string' ? (s[k] as string).slice(0, 120) : '')
  const num = (k: string) => (typeof s[k] === 'number' ? String(s[k]) : '')
  const axGrade = str('gradeLabel') || str('grade')
  // v6 부터는 추천 상품(시작 → 목표)을 보여 준다. 점수는 구버전 결과에만 붙인다
  const isPkg = typeof s.priceFrom === 'string'
  const axScore = isPkg ? '' : num('score') || num('overallScore')
  const pkgTxt = isPkg
    ? `${axGrade} (${str('priceFrom')})${str('targetLabel') && str('targetLabel') !== axGrade ? ` → 목표 ${str('targetLabel')}` : ''}`
    : ''
  const stageTxt = p.completedStage ? (p.depth ? depthLabel(p.depth) : `${p.completedStage}단계 완료`) : '-'

  // 상담 폼에서 고른 추가 정보 — 있으면 표에 추가
  const profileRows: Array<[string, string]> = p.companyProfile
    ? Object.entries(p.companyProfile).filter(([, v]) => v).map(([k, v]) => [k, String(v)] as [string, string])
    : []

  const kv: Array<[string, string]> = [
    ['회사명', p.companyName],
    ['대표자명', p.repName],
    ['연락처', p.phone],
    ['이메일', p.email || '-'],
    ...(p.businessType ? ([['사업자 유형', bizTypeLabel(p.businessType)]] as Array<[string, string]>) : []),
    ['상담 방식', p.contactMethod || '-'],
    ...((t) => (t ? ([['유입 트랙', t]] as Array<[string, string]>) : []))(trackOf(p.interests || [])),
    ...profileRows,
    ['상담 동의', p.consultationConsent ? '동의' : '미동의'],
    ['마케팅 동의', p.marketingConsent ? '동의' : '미동의'],
    ['진단', stageTxt],
    ...(pkgTxt
      ? ([['추천 상품', pkgTxt]] as Array<[string, string]>)
      : axGrade
        ? ([['AX Fit 등급', axScore ? `${axGrade} · ${axScore}점` : axGrade]] as Array<[string, string]>)
        : []),
    ['상담 우선순위', `${p.score}점 · ${p.grade}등급`],
    ['분류', p.flags.length ? p.flags.map(flagLabel).join(', ') : '-'],
    ['접수 시간', receivedAt],
  ]

  // 결과 요약 — 관리자에겐 부차적이라 접어서 노출(지원 클라이언트 한정).
  const foldBlocks: Array<[string, string[]]> = [
    ['핵심 요약', [str('headline'), str('summary'), str('readiness')].filter(Boolean)],
    ['추천 이유', asLines(s.reasons)],
    ['상담에서 같이 준비할 것', asLines(s.focus)],
    ['업무에서 걸리는 문제', asLines(s.improvements)],
    ['권장 AX 방향', asLines(s.strengths)],
    ['다음 행동', asLines(s.actionPlan)],
    ['선결 과제', asLines(s.prerequisites)],
    ['(구) 추천 상품', asLines(p.recProducts)],
  ]

  const kvHtml = kv
    .map(
      ([k, v]) => `<tr>
        <td style="padding:9px 12px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#64748b;width:88px;vertical-align:top;font-size:11.5px;line-height:1.4">${escapeHtml(k)}</td>
        <td style="padding:9px 12px;border:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;line-height:1.55;white-space:pre-wrap">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join('')

  // ── 제일 중요: 단계별 진단 응답(한글) — 크게, 접지 않고 노출 ──
  const answersHtml = (p.answersDisplay && p.answersDisplay.length > 0)
    ? p.answersDisplay.map((st) => `
        <div style="padding:14px 16px 4px">
          <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#0f172a">
            <span style="display:inline-block;background:#2563eb;color:#fff;border-radius:6px;padding:2px 8px;font-size:11px;margin-right:6px">${st.stage}단계</span>${escapeHtml(st.name)}
          </p>
          <table style="width:100%;border-collapse:collapse">
            ${st.items.map((it) => `<tr>
              <td style="padding:7px 10px;background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;font-size:12px;width:46%;vertical-align:top;line-height:1.45">${escapeHtml(it.q)}</td>
              <td style="padding:7px 10px;border:1px solid #e2e8f0;color:#0f172a;font-size:13px;font-weight:700;line-height:1.5">${escapeHtml(it.a)}</td>
            </tr>`).join('')}
          </table>
        </div>`).join('')
    : ''

  const interestsHtml = renderInterestBoxes(p.interests || [])

  // 접이식 고객용 요약 — details 미지원 클라이언트에선 펼쳐진 채 하단 노출
  const foldHtml = foldBlocks
    .filter(([, lines]) => lines.length > 0)
    .map(
      ([title, lines]) => `
      <details style="border:1px solid #e2e8f0;border-top:none">
        <summary style="padding:11px 16px;font-size:12px;font-weight:700;color:#64748b;cursor:pointer;background:#fbfcfe">${escapeHtml(title)} <span style="color:#94a3b8;font-weight:500">(펼쳐보기)</span></summary>
        <ul style="margin:0;padding:2px 16px 12px 34px;color:#334155;font-size:13px;line-height:1.7">
          ${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}
        </ul>
      </details>`,
    )
    .join('')

  const html = `
  <div style="font-family:-apple-system,'Apple SD Gothic Neo','Segoe UI',sans-serif;background:#f1f5f9;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
      <div style="background:#0f172a;padding:20px 24px">
        <p style="margin:0;color:#38bdf8;font-size:12px;font-weight:700;letter-spacing:1px">미래 AI 랩 · 3분 AX Fit</p>
        <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700">새 진단 접수 · ${escapeHtml(p.companyName)}${axGrade ? ` (${escapeHtml(axGrade)})` : ''} · 우선순위 ${escapeHtml(p.grade)} ${p.score}점</p>
      </div>
      <table style="width:100%;border-collapse:collapse">${kvHtml}</table>
      ${answersHtml ? `<div style="padding:14px 16px 4px;border-top:8px solid #f1f5f9"><p style="margin:0;font-size:13px;font-weight:800;color:#2563eb">📋 진단 응답</p></div>${answersHtml}<div style="height:8px"></div>` : ''}
      ${interestsHtml}
      ${foldHtml}
      <div style="padding:14px 24px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6">
        이 메일은 3분 AX Fit 상담 신청 시 자동 발송되었습니다. ${p.email ? '회신(Reply) 시 문의자 이메일로 답장됩니다.' : '위 연락처로 직접 연락하실 수 있습니다.'}
      </div>
    </div>
  </div>`

  const answersText = (p.answersDisplay && p.answersDisplay.length > 0)
    ? '\n\n[진단 응답]\n' + p.answersDisplay.map((st) => `\n▶ ${st.name}\n` + st.items.map((it) => `- ${it.q}: ${it.a}`).join('\n')).join('\n')
    : ''

  const text =
    `미래 AI 랩 · 3분 AX Fit 접수 — ${p.companyName}${axGrade ? ` (${axGrade})` : ''} · 우선순위 ${p.grade} ${p.score}점\n\n` +
    kv.map(([k, v]) => `■ ${k}\n${v}`).join('\n\n') +
    answersText +
    interestLines(p.interests || []) +
    '\n\n' +
    foldBlocks.filter(([, l]) => l.length > 0).map(([t, l]) => `[${t}]\n` + l.map((x) => `- ${x}`).join('\n')).join('\n\n') +
    '\n'

  const mod: any = await import('resend')
  const resend = new mod.Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: `[미래 AI 랩 AX Fit] ${p.companyName}${axGrade ? ` · ${axGrade}` : ''} · 우선순위 ${p.grade} ${p.score}점`,
    html,
    text,
    ...(p.email && p.email.includes('@') ? { replyTo: p.email } : {}),
  })
  if (error) throw new Error(detailOf(error))
}

// ── 검증 헬퍼 ──────────────────────────────────────────
const strip = (v: unknown, max = 200): string =>
  String(v ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, max)

const normPhone = (v: unknown): string => String(v ?? '').replace(/\D/g, '').slice(0, 11)

const isValidPhone = (p: string) => /^01[016789]\d{7,8}$/.test(p)
const isValidEmail = (e: string) => e === '' || (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 120)

const BIZ_TYPES = ['individual', 'corp', 'pre']
const CONTACT_METHODS = ['전화', '카톡·문자', '카카오톡', '문자', '대면상담', '아직 상담은 원하지 않음']
const EVENT_TYPES = [
  'diagnosis_started', 'stage_completed', 'question_answered', 'benefit_revealed', 'benefit_interest_clicked',
  'benefit_added_to_recommendations', 'benefit_skipped', 'benefit_removed_from_recommendations', 'benefit_more_opened',
  'live_status_updated', 'saved_result_opened', 'saved_result_deleted', 'product_recommended', 'product_detail_clicked', 'report_printed',
  'product_clicked', 'lead_form_viewed', 'lead_submitted', 'result_unlocked', 'consultation_clicked', 'diagnosis_restarted',
]
const DEPTHS = ['basic', 'funding', 'comprehensive']
const SESSION_STATUS = ['in_progress', 'completed', 'submitted']

function jsonCap(v: unknown, maxLen: number): unknown {
  if (v === null || v === undefined) return null
  try {
    const s = JSON.stringify(v)
    if (s.length > maxLen) return null
    return v
  } catch {
    return null
  }
}

const one = (a: Record<string, unknown>, id: string) => (typeof a[id] === 'string' ? (a[id] as string) : undefined)

// ── 추천 상품 (서버 재계산) — 프론트 엔진(src/lib/businessDiagnosisEngine.ts 의 recommendPackage)과 같은 규칙 ──
// MVP 500만원부터 · 플랫폼형 1,500만원부터 · 풀 패키지(AX + 플랫폼) 3,000만원부터
const DEGREE: Record<string, number> = { no: 0, sometimes: 1, often: 2, always: 3 }
const OWNER: Record<string, number> = { dedicated: 3, partTime: 2, ceo: 1, none: 0 }
type AxPkg = 'MVP' | 'PLATFORM' | 'FULL'
const PKG_ORDER: AxPkg[] = ['MVP', 'PLATFORM', 'FULL']
const PKG_START_BY_TARGET: Record<string, AxPkg> = { demo: 'MVP', customer: 'PLATFORM', internal: 'FULL', both: 'FULL' }
const PKG_BUDGET_CAP: Record<string, AxPkg> = { under500: 'MVP', around1500: 'PLATFORM' }
const many = (a: Record<string, unknown>, id: string): string[] => (Array.isArray(a[id]) ? (a[id] as unknown[]).map(String) : [])

// 질문 목록(서버 기준) — 예비창업은 업무 신호 4개와 내부 담당자를 묻지 않는다
const AX_WORK_QS = ['repeatInput', 'ceoCheck', 'manualHandoff', 'uniqueWork']
const AX_BASE_QS = ['bizStage', 'industry', 'teamSize', 'reason', 'timeline', 'buildTarget', 'budget']
const axExpectedQs = (a: Record<string, unknown>) => (one(a, 'bizStage') === 'pre' ? AX_BASE_QS : [...AX_BASE_QS, ...AX_WORK_QS, 'internalOwner'])

export function axPackage(answers: Record<string, unknown>): { start: AxPkg; target: AxPkg } {
  const v = (id: string) => DEGREE[one(answers, id) ?? ''] ?? 0
  const rank = (p: AxPkg) => PKG_ORDER.indexOf(p)
  const reasons = many(answers, 'reason')
  const customer = v('manualHandoff') >= 2 || reasons.includes('service')
  const internal = v('repeatInput') + v('ceoCheck') >= 4 || v('uniqueWork') >= 2 || reasons.includes('ops')
  const needed: AxPkg = internal ? 'FULL' : customer ? 'PLATFORM' : 'MVP'
  const first = PKG_START_BY_TARGET[one(answers, 'buildTarget') ?? ''] ?? needed
  const target = rank(needed) > rank(first) ? needed : first
  const cap = PKG_BUDGET_CAP[one(answers, 'budget') ?? '']
  const start = cap && rank(first) > rank(cap) ? cap : first
  return { start, target }
}

// ── 리드 점수 (서버 기준) — 상담 우선순위 0~100. '진성 고객인가'를 가늠한다(승인 가능성 아님) ──
//  A 시급성 25 · B 예산·자금 25 · C 적합도 20 · D 행동의향 15 · E 준비도 10 · F 가점 5
export function scoreLead(answers: Record<string, unknown>, interests: string[], form: {
  consultationConsent: boolean
  preferredContactTime?: string
  email?: string
  phoneOk: boolean
  contactMethod?: string
}) {
  const cap = (n: number, m: number) => Math.min(n, m)
  const v = (id: string) => DEGREE[one(answers, id) ?? ''] ?? 0
  const reasons = many(answers, 'reason')
  const timeline = one(answers, 'timeline') ?? ''
  const budget = one(answers, 'budget') ?? ''
  const size = one(answers, 'teamSize') ?? ''
  const pre = one(answers, 'bizStage') === 'pre'
  const pkg = axPackage(answers)

  // A. 시급성 (25) — 일정 + 자금·지원사업·투자·인증 같은 뚜렷한 계기
  const TIMELINE_PTS: Record<string, number> = { within1m: 15, within3m: 11, within6m: 6, none: 2 }
  const triggers = ['fund', 'grant', 'invest', 'cert'].filter((r) => reasons.includes(r)).length
  const a = cap((TIMELINE_PTS[timeline] ?? 0) + cap(triggers * 4, 10), 25)

  // B. 예산·자금 (25) — 후불(자금 입금 뒤 정산)도 이 회사의 정상 진행 방식이라 중간 점수를 준다
  const BUDGET_PTS: Record<string, number> = { over3000: 25, around1500: 20, afterFunding: 18, under500: 12, unknown: 5 }
  const b = BUDGET_PTS[budget] ?? 0

  // C. 적합도 (20) — 만들 것이 분명한가 + 업무 신호 + 대상 규모(50인 미만)
  const bt = one(answers, 'buildTarget')
  const work = AX_WORK_QS.reduce((sum, id) => sum + v(id), 0) // 0~12
  let c = (bt && bt !== 'unsure' ? 8 : 0) + (pre ? 6 : Math.round((work / 12) * 8)) + (size && size !== 'solo' && size !== 'over' ? 4 : 0)
  if (size === 'over') c = Math.min(c, 6)
  c = cap(c, 20)

  // D. 행동의향 (15)
  let d = 0
  if (form.consultationConsent) d += 8
  if (form.contactMethod) d += 3
  if (reasons.length > 0 && !reasons.includes('explore')) d += 4
  d = cap(d, 15)

  // E. 준비도 (10) — 내부 담당자 + 답한 비율 + 연락처
  const expected = axExpectedQs(answers)
  const answered = expected.filter((q) => answers[q] !== undefined && !(Array.isArray(answers[q]) && (answers[q] as unknown[]).length === 0)).length
  const owner = OWNER[one(answers, 'internalOwner') ?? ''] ?? 0
  const ownerPts = pre ? 2 : owner === 3 ? 5 : owner === 2 ? 4 : owner === 1 ? 2 : 0
  const e = cap(ownerPts + Math.round((answered / expected.length) * 3) + (form.phoneOk ? 2 : 0), 10)

  // F. 가점 (5)
  let f = 0
  if (form.preferredContactTime) f += 3
  if (form.email) f += 2
  f = cap(f, 5)

  const penalty = 0
  const total = Math.max(0, Math.min(100, a + b + c + d + e + f - penalty))
  const grade = total >= 75 ? 'A' : total >= 50 ? 'B' : 'C'

  const budgetReady = budget === 'over3000' || budget === 'around1500'
  const flags: string[] = []
  if (total >= 85 || (timeline === 'within1m' && budgetReady && form.consultationConsent)) flags.push('hot')
  flags.push(pkg.start === 'FULL' ? 'pkg_full' : pkg.start === 'PLATFORM' ? 'pkg_platform' : 'pkg_mvp')
  if (pkg.target !== pkg.start) flags.push('pkg_step_up')
  if (reasons.includes('fund')) flags.push('need_fund')
  if (reasons.includes('grant')) flags.push('need_grant')
  if (reasons.includes('invest')) flags.push('need_invest')
  if (reasons.includes('cert')) flags.push('need_cert')
  if (timeline === 'within1m') flags.push('deadline_1m')
  if (budgetReady) flags.push('budget_ready')
  if (budget === 'afterFunding') flags.push('budget_after_funding')
  if (reasons.includes('explore') || (timeline === 'none' && (budget === 'unknown' || !budget))) flags.push('just_browsing')
  if (size === 'over') flags.push('over_50')
  if (interests.some((k) => /정책|R&D|성장/.test(k))) flags.push('growth_interest')
  if (!pre && one(answers, 'internalOwner') === 'none') flags.push('no_internal_owner')
  if (form.consultationConsent) flags.push('consultation_opt_in')

  return { total, grade, flags, breakdown: { urgency: a, budget: b, fit: c, intent: d, readiness: e, bonus: f, penalty } }
}

// 공개 응답에는 내부 오류 원문(detail)을 싣지 않는다 — 서버 기록(Vercel 로그)에만 남긴다(2026-10 보안 점검)
function hideErrorDetail(res: any, tag: string) {
  const json = res.json.bind(res)
  res.json = (body: any) => {
    if (body && typeof body === 'object' && 'detail' in body) {
      const { detail, ...rest } = body
      console.error(`[${tag}] ${rest.debugCode ?? 'error'}:`, detail)
      return json(rest)
    }
    return json(body)
  }
}

export default async function handler(req: any, res: any) {
  hideErrorDetail(res, 'business-diagnosis')
  try {
    if (req.method === 'GET') return res.status(200).json({ ok: true, message: 'business-diagnosis api alive' })
    if (req.method !== 'POST') {
      res.setHeader?.('Allow', 'POST')
      return res.status(405).json({ ok: false, message: 'POST만 허용됩니다.', debugCode: 'method_not_allowed' })
    }

    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return res.status(500).json({ ok: false, message: '서버 저장 설정이 완료되지 않았습니다.', debugCode: 'no_env' })
    }

    let body: any = {}
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {}
    } catch (e) {
      return res.status(400).json({ ok: false, message: '요청 본문(JSON)을 해석할 수 없습니다.', debugCode: 'bad_body', detail: detailOf(e) })
    }

    const action = strip(body.action, 20)
    const sessionToken = strip(body.sessionToken, 64)
    if (!sessionToken || sessionToken.length < 10 || !/^diag_[a-z0-9_]+$/.test(sessionToken)) {
      return res.status(400).json({ ok: false, message: '세션 정보가 올바르지 않습니다.', debugCode: 'bad_session_token' })
    }

    let createClient: (u: string, k: string, o?: unknown) => any
    try {
      ;({ createClient } = await import('@supabase/supabase-js'))
    } catch (e) {
      return res.status(500).json({ ok: false, message: '저장 모듈 로드에 실패했습니다.', debugCode: 'supabase_import', detail: detailOf(e) })
    }
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })

    // 단계 메타 (점진형)
    const sm = body.stageMeta && typeof body.stageMeta === 'object' ? body.stageMeta : {}
    const clampStage = (n: unknown) => Math.min(3, Math.max(1, Number(n) || 1))
    const stageMetaRow: Record<string, unknown> = {}
    if (sm.completedStage !== undefined) stageMetaRow.completed_stage = clampStage(sm.completedStage)
    if (sm.diagnosisDepth !== undefined && DEPTHS.includes(strip(sm.diagnosisDepth, 20))) stageMetaRow.diagnosis_depth = strip(sm.diagnosisDepth, 20)
    if (sm.stoppedAfterStage !== undefined) stageMetaRow.stopped_after_stage = sm.stoppedAfterStage === true
    if (sm.nextStageInterest !== undefined) stageMetaRow.next_stage_interest = sm.nextStageInterest === true
    if (sm.stageDurations !== undefined) {
      const d = sm.stageDurations || {}
      stageMetaRow.stage1_duration_seconds = Number(d['1']) || null
      stageMetaRow.stage2_duration_seconds = Number(d['2']) || null
      stageMetaRow.stage3_duration_seconds = Number(d['3']) || null
      stageMetaRow.total_duration_seconds = (Number(d['1']) || 0) + (Number(d['2']) || 0) + (Number(d['3']) || 0) || null
    }

    // 세션 upsert 공통 페이로드
    const utm = body.utm && typeof body.utm === 'object' ? body.utm : {}
    const sessionRow = {
      session_token: sessionToken,
      diagnosis_version: Number(body.diagnosisVersion) || 0,
      answers: jsonCap(body.answers, 20000) ?? {},
      clicked_benefits: jsonCap(body.interests, 2000) ?? [],
      skipped_benefits: jsonCap(body.skippedBenefits, 2000),
      advantage_factors: jsonCap(body.advantageFactors ?? body.foundAdvantages, 8000),
      current_question_id: body.currentQuestionId ? strip(body.currentQuestionId, 40) : null,
      scores: jsonCap(body.scores, 4000),
      result_summary: jsonCap(body.resultSummary, 8000),
      recommended_products: jsonCap(body.recommendedProducts, 4000),
      completed_at: body.completedAt ? strip(body.completedAt, 40) : null,
      ...stageMetaRow,
      updated_at: new Date().toISOString(),
    }

    // 응답 뒤로 미룬 쓰기 작업 — 제출 응답을 붙잡아 둘 이유가 없는 것들
    const deferredWrites: Array<Promise<unknown>> = []

    // deferUpdate: 세션 스냅샷 갱신을 응답 뒤로 미룬다. 제출 경로에서는 이 갱신이
    // 리드 저장을 막을 이유가 없고(새 리드일 때는 뒤에서 어차피 다시 갱신한다) 왕복 한 번을 줄인다.
    async function upsertSession(status?: string, currentStage?: number, deferUpdate = false) {
      const { data: existing } = await admin.from('business_diagnosis_sessions').select('id, lead_id, status, utm_source').eq('session_token', sessionToken).maybeSingle()
      if (existing) {
        const patch: Record<string, unknown> = { ...sessionRow }
        if (status && SESSION_STATUS.includes(status) && existing.status !== 'submitted') patch.status = status
        if (currentStage) patch.current_stage = Math.min(3, Math.max(1, Number(currentStage) || 1))
        const write = admin.from('business_diagnosis_sessions').update(patch).eq('id', existing.id)
        if (deferUpdate) deferredWrites.push(Promise.resolve(write))
        else await write
        return existing
      }
      const { data: created, error } = await admin
        .from('business_diagnosis_sessions')
        .insert({
          ...sessionRow,
          status: status && SESSION_STATUS.includes(status) ? status : 'in_progress',
          current_stage: currentStage ? Math.min(3, Math.max(1, Number(currentStage) || 1)) : 1,
          started_at: body.startedAt ? strip(body.startedAt, 40) : new Date().toISOString(),
          // 유입경로 — 최초 저장 시에만 기록 (첫 유입값 유지)
          utm_source: strip(utm.utmSource, 120) || null,
          utm_medium: strip(utm.utmMedium, 120) || null,
          utm_campaign: strip(utm.utmCampaign, 160) || null,
          utm_content: strip(utm.utmContent, 160) || null,
          utm_term: strip(utm.utmTerm, 160) || null,
          referrer: strip(utm.referrer, 300) || null,
          landing_path: strip(utm.landingPath, 300) || null,
        })
        .select('id, lead_id, status')
        .single()
      if (error) throw error
      return created
    }

    // ── action: session ──
    if (action === 'session') {
      const s = await upsertSession(strip(body.status, 20) || undefined, body.currentStage)
      return res.status(200).json({ ok: true, sessionId: s.id })
    }

    // ── action: event ──
    if (action === 'event') {
      const eventType = strip(body.eventType, 40)
      if (!EVENT_TYPES.includes(eventType)) {
        return res.status(400).json({ ok: false, message: '허용되지 않은 이벤트입니다.', debugCode: 'bad_event_type' })
      }
      const s = await upsertSession()
      await admin.from('business_diagnosis_events').insert({
        session_id: s.id,
        event_type: eventType,
        event_key: body.eventKey ? strip(body.eventKey, 80) : null,
        payload: jsonCap(body.payload, 2000),
      })
      return res.status(200).json({ ok: true })
    }

    // ── action: submit ──
    if (action === 'submit') {
      const form = body.form && typeof body.form === 'object' ? body.form : {}

      // honeypot — 봇이 채우는 숨은 필드
      if (strip(form.honeypot, 10)) {
        return res.status(400).json({ ok: false, message: '요청을 처리할 수 없습니다.', debugCode: 'rejected' })
      }
      // 지나치게 빠른 제출 방지
      // 화면은 항상 걸린 시간(formElapsedMs)을 보낸다 — 값이 없거나 너무 짧으면 자동 제출로 본다
      const elapsed = Number(form.formElapsedMs)
      if (!Number.isFinite(elapsed) || elapsed < 2500) {
        return res.status(400).json({ ok: false, message: '입력 내용을 확인한 뒤 다시 제출해주세요.', debugCode: 'too_fast' })
      }

      const companyName = strip(form.companyName, 80)
      const repName = strip(form.representativeName, 40)
      const phone = normPhone(form.phone)
      const email = strip(form.email, 120)
      const businessType = strip(form.businessType ?? one(body.answers ?? {}, 'bizType'), 20)
      const industry = strip(form.industry ?? one(body.answers ?? {}, 'industry'), 40)
      const contactMethod = strip(form.contactMethod, 30)
      const preferredContactTime = strip(form.preferredContactTime, 80)
      const privacyConsent = form.privacyConsent === true
      const consultationConsent = form.consultationConsent === true
      const marketingConsent = form.marketingConsent === true
      const consentVersion = strip(form.privacyConsentVersion, 20) || 'unknown'

      if (!companyName || !repName || !privacyConsent) {
        return res.status(400).json({ ok: false, message: '필수 항목(회사명, 대표자명, 개인정보 동의)을 확인해주세요.', debugCode: 'missing_required' })
      }
      if (!isValidPhone(phone)) {
        return res.status(400).json({ ok: false, message: '올바른 휴대전화번호를 입력해주세요.', debugCode: 'bad_phone' })
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ ok: false, message: '이메일 형식을 확인해주세요.', debugCode: 'bad_email' })
      }
      if (businessType && !BIZ_TYPES.includes(businessType)) {
        return res.status(400).json({ ok: false, message: '사업자 유형 값이 올바르지 않습니다.', debugCode: 'bad_enum' })
      }
      if (contactMethod && !CONTACT_METHODS.includes(contactMethod)) {
        return res.status(400).json({ ok: false, message: '상담 방식 값이 올바르지 않습니다.', debugCode: 'bad_enum' })
      }

      const answers = body.answers && typeof body.answers === 'object' ? body.answers : {}
      const interests = Array.isArray(body.interests) ? body.interests.map((x: unknown) => strip(x, 30)).slice(0, 20) : []

      // 서버 기준 리드 점수 (클라이언트 값 불신)
      const scored = scoreLead(answers, interests, {
        consultationConsent,
        preferredContactTime: preferredContactTime || undefined,
        email: email || undefined,
        phoneOk: true,
        contactMethod: contactMethod || undefined,
      })

      const s = await upsertSession('submitted', undefined, true)

      const leadFields = {
        company_name: companyName,
        representative_name: repName,
        phone,
        email: email || null,
        business_type: businessType || null,
        industry: industry || null,
        contact_method: contactMethod || null,
        preferred_contact_time: preferredContactTime || null,
        privacy_consent: privacyConsent,
        privacy_consent_version: consentVersion,
        consultation_consent: consultationConsent,
        marketing_consent: marketingConsent,
        consent_at: new Date().toISOString(),
        lead_score: scored.total,
        lead_grade: scored.grade,
        score_breakdown: scored.breakdown,
        flags: scored.flags,
        source_channel: strip((utm as any).utmSource, 120) || null,
        updated_at: new Date().toISOString(),
      }

      // idempotent — 같은 세션 재제출 시 기존 리드 갱신 (중복 리드 방지)
      let leadId: string
      if (s.lead_id) {
        await admin.from('business_diagnosis_leads').update(leadFields).eq('id', s.lead_id)
        leadId = s.lead_id
      } else {
        const { data: lead, error: leadErr } = await admin
          .from('business_diagnosis_leads')
          .insert({ ...leadFields, lead_status: 'new' })
          .select('id')
          .single()
        if (leadErr) throw leadErr
        leadId = lead.id
        await admin
          .from('business_diagnosis_sessions')
          .update({ lead_id: leadId, status: 'submitted', submitted_at: new Date().toISOString(), ...sessionRow })
          .eq('id', s.id)
      }

      // 단계별 한글 응답(클라이언트가 라벨 변환) — HTML 제거·길이 제한
      const answersDisplay = Array.isArray(body.answersDisplay)
        ? body.answersDisplay
            .slice(0, 3)
            .map((st: any) => ({
              stage: Math.min(3, Math.max(1, Number(st?.stage) || 1)),
              name: strip(st?.name, 40),
              items: Array.isArray(st?.items)
                ? st.items.slice(0, 30).map((it: any) => ({ q: strip(it?.q, 120), a: strip(it?.a, 200) })).filter((it: any) => it.q && it.a)
                : [],
            }))
            .filter((st: any) => st.items.length)
        : undefined

      // 상담 폼 추가 정보(선택) — 허용 키만, 값 정리
      const companyProfile: Record<string, string> = {}
      if (form.companyProfile && typeof form.companyProfile === 'object') {
        for (const k of ['업력', '업종', '연매출', '직원 수', '지역']) {
          const v = strip((form.companyProfile as any)[k], 200)
          if (v) companyProfile[k] = v
        }
      }

      // 리드는 위에서 이미 저장됐으므로 여기서 바로 응답한다.
      // 알림 메일·이벤트 기록은 응답 뒤에 처리한다 — 메일(Resend 왕복 + 모듈 로드)을 기다리느라
      // 제출 응답이 몇 초씩 걸렸고, 함수 실행시간 상한에 걸리면 저장은 됐는데 화면에는
      // 오류가 뜨는 일이 있었다. Node 런타임은 핸들러가 끝날 때까지 살아 있으므로
      // 응답 이후의 작업도 그대로 수행된다.
      res.status(200).json({ ok: true, leadId })

      const after = await Promise.allSettled([
        withTimeout(Promise.allSettled(deferredWrites), 5000, '세션 갱신'),
        withTimeout(
          Promise.resolve(
            admin.from('business_diagnosis_events').insert({
              session_id: s.id,
              event_type: 'lead_submitted',
              event_key: leadId,
              payload: { grade: scored.grade, score: scored.total },
            }),
          ),
          5000,
          '이벤트 기록',
        ),
        withTimeout(
          sendDiagnosisEmail({
            companyName,
            repName,
            phone,
            email,
            businessType,
            industry,
            contactMethod,
            preferredContactTime,
            consultationConsent,
            marketingConsent,
            grade: scored.grade,
            score: scored.total,
            flags: scored.flags,
            completedStage: sm.completedStage !== undefined ? clampStage(sm.completedStage) : undefined,
            stoppedAfterStage: sm.stoppedAfterStage === true,
            depth: sm.diagnosisDepth !== undefined ? strip(sm.diagnosisDepth, 20) : undefined,
            summary: (() => {
              const v = jsonCap(body.resultSummary, 8000)
              return v && typeof v === 'object' ? v : {}
            })(),
            interests,
            recProducts: jsonCap(body.recommendedProducts, 4000),
            answers,
            answersDisplay,
            companyProfile: Object.keys(companyProfile).length ? companyProfile : undefined,
          }),
          9000,
          '알림 메일',
        ),
      ])
      const afterLabels = ['세션 갱신', '이벤트 기록', '알림 메일']
      for (const [i, r] of after.entries()) {
        if (r.status === 'rejected') console.error(`[business-diagnosis] 응답 후 작업 실패(${afterLabels[i]}):`, detailOf(r.reason))
      }
      return
    }

    return res.status(400).json({ ok: false, message: '알 수 없는 요청입니다.', debugCode: 'bad_action' })
  } catch (error) {
    console.error('[business-diagnosis] error:', detailOf(error)) // 개인정보 미포함
    // 이미 성공 응답을 보낸 뒤(메일·이벤트 단계)라면 응답을 덮어쓰지 않는다
    if (res.headersSent) return
    return res.status(500).json({ ok: false, message: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', debugCode: 'unhandled', detail: detailOf(error) })
  }
}
