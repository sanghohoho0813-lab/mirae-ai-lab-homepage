// 사이트 공통 "상담 신청 / 문의" 모달 — 어디서 열든 담긴 상품·선택 항목(contextRows)을
// 함께 실어 /api/consult(→ 관리자 지메일 + consult_leads)로 보냅니다. 카드결제 준비 중 상담 우회 CTA 공용.
// programSelect(핵심 프로그램 신청) 모드는 3단계 위저드로, 그 외(상세·장바구니 등)는 기존 단일 화면으로 렌더합니다.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitConsult, CONSULT_COMPANY_FIELDS, CONSULT_METHODS, type ConsultContextRow, type ConsultTopicGroup } from '../lib/consultApi'
import {
  PROGRAM_CHOICES,
  FUNDING_GOAL_OPTIONS,
  FUNDING_TIMING_OPTIONS,
  ARREARS_OPTIONS,
  PRIOR_FUNDING_OPTIONS,
  BIZ_FORM_OPTIONS,
  AX_FORM,
} from '../data/corePrograms'

const AX_PROGRAM_NAME = 'AX 결합 성장자금형'

const CONTACT_EMAIL = 'sanghohoho0813@gmail.com'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-800'

type Status = 'idle' | 'submitting' | 'success' | 'error'

// 칩 선택 그룹 (단일/복수) — 진행방식·자금 공통질문·AX 문항 공용
function Chips({
  label,
  options,
  single,
  value,
  values,
  onPick,
  onToggle,
}: {
  label: string
  options: readonly string[]
  single?: boolean
  value?: string
  values?: string[]
  onPick?: (v: string) => void
  onToggle?: (v: string) => void
}) {
  return (
    <div>
      <p className="mb-1.5 text-[0.82rem] font-semibold text-slate-500">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = single ? value === opt : (values ?? []).includes(opt)
          return (
            <button
              key={opt}
              type="button"
              onClick={() => (single ? onPick?.(opt) : onToggle?.(opt))}
              aria-pressed={on}
              className={`rounded-lg border px-2.5 py-1.5 text-[0.85rem] transition ${
                on ? 'border-blue-500 bg-blue-50 font-bold text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type ConsultModalProps = {
  open: boolean
  onClose: () => void
  /** 신청 경로(이메일 제목/본문에 표시) 예: '정책자금 컨설팅', '장바구니' */
  source: string
  /** 담긴 상품/선택 옵션/체크 항목 등 — 폼 상단에 요약 표시 + 이메일 동봉 */
  contextRows?: ConsultContextRow[]
  heading?: string
  intro?: string
  submitLabel?: string
  /** 상담 희망 분야 — 6개 상황 목차, 각 목차 안에 상품(썸네일) */
  topicGroups?: ConsultTopicGroup[]
  /** 현재 페이지 상품명 — 자동 선택 + 해당 목차 펼침 */
  preselectProduct?: string
  /** 상담 희망 방식(전화/카톡·문자) 노출 여부 */
  showContactMethod?: boolean
  /** 기업 규모 파악용 선택 항목(업력·업종·매출·직원수·지역) 노출 여부 */
  showCompanyFields?: boolean
  /** 진행방식(핵심 프로그램 A/B/C) 선택 + 자금 공통질문 + AX 조건부 문항 노출 → 3단계 위저드 */
  programSelect?: boolean
  /** 진행방식 초기 선택값 (PROGRAM_CHOICES 중 하나) */
  preselectProgram?: string
}

export default function ConsultModal({
  open,
  onClose,
  source,
  contextRows = [],
  heading = '상담 신청',
  intro = '연락처를 남겨주시면 담당자가 확인 후 빠르게 연락드립니다. 남겨주신 상품·선택 내용은 그대로 함께 전달됩니다.',
  submitLabel = '상담 신청하기',
  topicGroups = [],
  preselectProduct,
  showContactMethod = false,
  showCompanyFields = false,
  programSelect = false,
  preselectProgram,
}: ConsultModalProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [agree, setAgree] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const [topics, setTopics] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [method, setMethod] = useState('')
  const [company, setCompany] = useState<Record<string, string>>({})
  const [industryEtc, setIndustryEtc] = useState('')
  // ── 기본 연락 정보 (제어형 — 단계 이동 후에도 값 유지 + 요약 표시) ──
  const [name, setName] = useState('')
  const [contact, setContact] = useState('010-')
  const [companyName, setCompanyName] = useState('')
  const [message, setMessage] = useState('')
  const [messageExtra, setMessageExtra] = useState('')
  // ── 진행방식(핵심 프로그램) + 자금 공통질문 ──
  const [program, setProgram] = useState('')
  const [bizForm, setBizForm] = useState('')
  const [goal, setGoal] = useState('')
  const [timing, setTiming] = useState('')
  const [arrears, setArrears] = useState('')
  const [priorFunding, setPriorFunding] = useState('')
  // ── AX 결합 성장자금형 조건부 문항 ──
  const [axTasks, setAxTasks] = useState<string[]>([])
  const [axTaskEtc, setAxTaskEtc] = useState('')
  const [axData, setAxData] = useState<string[]>([])
  const [axPart, setAxPart] = useState<string[]>([])
  const [axFeedback, setAxFeedback] = useState<string[]>([])
  const [axConsentAnon, setAxConsentAnon] = useState(false)
  const [axConsentFb, setAxConsentFb] = useState(false)
  const [axConsentError, setAxConsentError] = useState(false)
  const [axDisclosure, setAxDisclosure] = useState<string[]>([])
  const [axModules, setAxModules] = useState<string[]>([])
  // ── 단계형(위저드) 상태 ──
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)
  const [stepError, setStepError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const contactRef = useRef<HTMLInputElement>(null)

  const isAx = programSelect && program === AX_PROGRAM_NAME
  const wizard = programSelect

  const toggleTopic = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const toggleGroup = (t: string) =>
    setExpanded((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const pickCompany = (key: string, value: string) =>
    setCompany((cur) => ({ ...cur, [key]: cur[key] === value ? '' : value }))
  const toggleIn = (setter: (fn: (cur: string[]) => string[]) => void) => (v: string) =>
    setter((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]))

  // 진행방식 변경 — AX 가 아니게 되면 AX 전용 입력값을 정리(제출 payload 에 남지 않도록)
  function changeProgram(v: string) {
    const next = program === v ? '' : v
    setProgram(next)
    setStepError('')
    if (next !== AX_PROGRAM_NAME) {
      setAxTasks([])
      setAxTaskEtc('')
      setAxData([])
      setAxPart([])
      setAxFeedback([])
      setAxConsentAnon(false)
      setAxConsentFb(false)
      setAxConsentError(false)
      setAxDisclosure([])
      setAxModules([])
    }
  }

  // 열릴 때마다 상태 초기화 + 스크롤 잠금 + ESC 닫기 + 포커스 트랩
  useEffect(() => {
    if (!open) return
    setStatus('idle')
    setServerMessage('')
    setAgree(false)
    setAgreeError(false)
    // 현재 상품은 미리 선택하고, 그 상품이 속한 목차를 펼쳐 둠
    const preGroup = preselectProduct ? topicGroups.find((g) => g.products.some((p) => p.name === preselectProduct)) : undefined
    setTopics(preselectProduct ? [preselectProduct] : [])
    setExpanded(preGroup ? [preGroup.title] : topicGroups.length ? [topicGroups[0].title] : [])
    setMethod('')
    setCompany({})
    setIndustryEtc('')
    setName('')
    setContact('010-')
    setCompanyName('')
    setMessage('')
    setMessageExtra('')
    setProgram(preselectProgram && (PROGRAM_CHOICES as readonly string[]).includes(preselectProgram) ? preselectProgram : '')
    setBizForm('')
    setGoal('')
    setTiming('')
    setArrears('')
    setPriorFunding('')
    setAxTasks([])
    setAxTaskEtc('')
    setAxData([])
    setAxPart([])
    setAxFeedback([])
    setAxConsentAnon(false)
    setAxConsentFb(false)
    setAxConsentError(false)
    setAxDisclosure([])
    setAxModules([])
    setStep(1)
    setMaxStep(1)
    setStepError('')
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      // 포커스 트랩 — Tab 이 모달 밖으로 나가지 않도록(숨긴 단계 필드는 offsetParent 로 제외)
      const panel = panelRef.current
      if (e.key === 'Tab' && panel) {
        const nodes = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        const visible = [...nodes].filter((n) => n.offsetParent !== null || n === document.activeElement)
        if (visible.length === 0) return
        const first = visible[0]
        const last = visible[visible.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, preselectProduct, topicGroups, preselectProgram])

  // 단계 전환 시 내부 스크롤 최상단 + 해당 단계 제목으로 포커스 이동(입력창 자동 포커스는 피해 모바일 키보드 방지)
  useEffect(() => {
    if (!open || !wizard) return
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    const h = document.getElementById(`consult-step-h-${step}`)
    h?.focus()
  }, [step, open, wizard])

  if (!open) return null

  function goNext() {
    setStepError('')
    if (step === 1 && (!name.trim() || !contact.trim())) {
      setStepError('성함과 연락처를 입력해주세요.')
      setTimeout(() => (!name.trim() ? nameRef.current : contactRef.current)?.focus(), 0)
      return
    }
    const next = Math.min(3, step + 1)
    setStep(next)
    setMaxStep((m) => Math.max(m, next))
  }

  function goPrev() {
    setStepError('')
    setStep((s) => Math.max(1, s - 1))
  }

  function gotoStep(n: number) {
    if (n <= maxStep) {
      setStepError('')
      setStep(n)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // 위저드 중간 단계에서 Enter → 최종 제출 대신 다음 단계로
    if (wizard && step !== 3) {
      goNext()
      return
    }
    const fullName = name.trim()
    const contactVal = contact.trim()
    if (!fullName || !contactVal) {
      setStepError('성함과 연락처를 입력해주세요.')
      if (wizard) setStep(1)
      setTimeout(() => (!fullName ? nameRef.current : contactRef.current)?.focus(), 0)
      return
    }
    if (!agree) {
      setAgreeError(true)
      return
    }
    // AX 결합 성장자금형 — 레퍼런스 필수 동의 2건 확인
    if (isAx && (!axConsentAnon || !axConsentFb)) {
      setAxConsentError(true)
      return
    }
    const companyNameVal = companyName.trim()
    const messageVal = [message.trim(), messageExtra.trim() ? `[추가 문의] ${messageExtra.trim()}` : '']
      .filter(Boolean)
      .join('\n\n')
    setStatus('submitting')
    setServerMessage('')
    // 고른 관심 상품 + 상담 방식 + 기업 정보를 이메일 컨텍스트에 합칩니다.
    const companyRows = CONSULT_COMPANY_FIELDS
      .filter((f) => company[f.key])
      .map((f) => ({
        label: f.key,
        value:
          f.key === '업종' && company[f.key] === '기타' && industryEtc.trim()
            ? `기타 - ${industryEtc.trim()}`
            : company[f.key],
      }))
    const axTasksAll = [...axTasks, ...(axTaskEtc.trim() ? [`기타 - ${axTaskEtc.trim()}`] : [])]
    // 진행방식·자금 공통질문·AX 문항 → 이메일 컨텍스트 행
    const programRows: ConsultContextRow[] = programSelect
      ? [
          ...(program ? [{ label: '진행방식', value: program }] : []),
          ...(bizForm ? [{ label: '사업자 형태', value: bizForm }] : []),
          ...(goal ? [{ label: '목표 조달금액', value: goal }] : []),
          ...(timing ? [{ label: '자금 필요 시기', value: timing }] : []),
          ...(arrears ? [{ label: '체납 여부', value: arrears }] : []),
          ...(priorFunding ? [{ label: '정책자금·보증 이용', value: priorFunding }] : []),
        ]
      : []
    const axRows: ConsultContextRow[] = isAx
      ? [
          ...(axTasksAll.length ? [{ label: 'AX 반복업무', value: axTasksAll.join(', ') }] : []),
          ...(axData.length ? [{ label: 'AX 데이터 형태', value: axData.join(', ') }] : []),
          ...(axPart.length ? [{ label: 'AX 참여가능성', value: axPart.join(', ') }] : []),
          { label: 'AX 익명 사례 동의', value: axConsentAnon ? '동의' : '미동의' },
          { label: 'AX 상세 피드백 동의', value: axConsentFb ? '동의' : '미동의' },
          ...(axFeedback.length ? [{ label: 'AX 피드백 방식', value: axFeedback.join(', ') }] : []),
          ...(axDisclosure.length ? [{ label: 'AX 공개범위', value: axDisclosure.join(', ') }] : []),
          ...(axModules.length ? [{ label: '추가 관심 모듈', value: axModules.join(', ') }] : []),
        ]
      : []
    const context = [
      ...contextRows,
      ...programRows,
      ...axRows,
      ...(topics.length ? [{ label: '관심 상품', value: topics.join(', ') }] : []),
      ...(method ? [{ label: '상담 희망 방식', value: method }] : []),
      ...companyRows,
    ]
    // Supabase 저장용 구조화 데이터 (다중선택은 배열 그대로)
    const structured = programSelect
      ? {
          program: program || null,
          bizForm: bizForm || null,
          fundingGoal: goal || null,
          fundingTiming: timing || null,
          arrears: arrears || null,
          priorFunding: priorFunding || null,
          companyProfile: Object.fromEntries(companyRows.map((r) => [r.label, r.value])),
          interestedProducts: topics,
          contactMethod: method || null,
          ...(isAx
            ? {
                ax: {
                  tasks: axTasksAll,
                  dataForms: axData,
                  participation: axPart,
                  consents: { anonymousCase: axConsentAnon, detailedFeedback: axConsentFb },
                  feedbackMethods: axFeedback,
                  disclosureScope: axDisclosure,
                  interestModules: axModules,
                  /** 공개 후기 활용 시 '레퍼런스 구축 참여 혜택 제공' 표시용 */
                  referenceBenefit: true,
                },
              }
            : {}),
        }
      : undefined
    try {
      const res = await submitConsult({ name: fullName, contact: contactVal, company: companyNameVal, message: messageVal, source, context, structured })
      setServerMessage(res.message)
      setStatus('success')
    } catch (e) {
      setServerMessage(e instanceof Error ? e.message : '')
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  // 진행방식별 단계 제목 — 일반과 AX 를 구분해 각 단계 성격을 명확히
  const stepTitles = isAx ? ['기업정보', '업무·AX 적합성', '참여조건·최종확인'] : ['기업정보', '자금계획', '최종확인']
  const stepHeadings = ['기업 기본정보', isAx ? '업무·AX 적합성' : '자금계획·현재 상황', '참여조건·관심 서비스']
  const stepIntros = [
    '먼저 기업의 기본 상황을 알려주세요.',
    isAx ? '현재 업무와 AX 적합성을 확인합니다.' : '자금 계획과 현재 상황을 알려주세요.',
    '마지막으로 참여조건과 관심 서비스를 확인해주세요.',
  ]

  // ── 재사용 필드 블록 ─────────────────────────────────────────────
  const contextBlock = contextRows.length > 0 && (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[0.78rem] font-black uppercase tracking-wide text-slate-400">신청 내용</p>
      <dl className="mt-2 space-y-1.5">
        {contextRows.map((row) => (
          <div key={`${row.label}-${row.value}`} className="flex gap-2 text-[0.92rem]">
            <dt className="shrink-0 font-semibold text-slate-500">{row.label}</dt>
            <dd className="min-w-0 font-bold text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )

  const programBlock = programSelect && (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4">
      <p className="text-sm font-bold text-slate-900">어떤 방식의 진행을 희망하시나요?</p>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {PROGRAM_CHOICES.map((c) => {
          const on = program === c
          return (
            <button
              key={c}
              type="button"
              onClick={() => changeProgram(c)}
              aria-pressed={on}
              className={`rounded-xl border px-3 py-2.5 text-left text-[0.85rem] leading-snug transition ${
                on ? 'border-blue-500 bg-white font-bold text-blue-700 ring-2 ring-inset ring-blue-500/30' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>
      {isAx && (
        <p className="mt-2.5 rounded-lg bg-white px-3 py-2 text-[0.78rem] leading-relaxed text-slate-500 ring-1 ring-blue-100">
          AX 결합 성장자금형은 <b className="text-slate-700">적합성 신청 → 내부 검토 → 참여 승인 → 착수금 결제</b> 순서로 진행됩니다. 신청 시 결제가 이뤄지지 않습니다.
        </p>
      )}
    </div>
  )

  const nameContactBlock = (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="consult-name" className={labelClass}>
            성함 <span className="text-rose-500">*</span>
          </label>
          <input id="consult-name" ref={nameRef} name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 김대표" className={inputClass} />
        </div>
        <div>
          <label htmlFor="consult-contact" className={labelClass}>
            연락처 <span className="text-rose-500">*</span>
          </label>
          <input id="consult-contact" ref={contactRef} name="contact" type="tel" inputMode="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="휴대폰 번호" className={inputClass} />
        </div>
      </div>
      {stepError && <p role="alert" className="mt-2 text-[0.82rem] font-bold text-rose-600">{stepError}</p>}
    </div>
  )

  const methodBlock = showContactMethod && (
    <div>
      <p className={labelClass}>상담 희망 방식 <span className="font-normal text-slate-400">(선택)</span></p>
      <div className="flex flex-wrap gap-2">
        {CONSULT_METHODS.map((m) => {
          const on = method === m
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(on ? '' : m)}
              aria-pressed={on}
              className={`rounded-lg border px-4 py-2 text-sm transition ${
                on ? 'border-blue-500 bg-blue-50 font-bold text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m === '전화' ? '📞 전화' : '💬 카톡·문자'}
            </button>
          )
        })}
      </div>
    </div>
  )

  const companyNameBlock = (
    <div>
      <label htmlFor="consult-company" className={labelClass}>
        회사명 <span className="font-normal text-slate-400">(선택)</span>
      </label>
      <input id="consult-company" name="company" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="예: (주)미래상사" className={inputClass} />
    </div>
  )

  const bizFormBlock = programSelect && (
    <Chips label="사업자 형태" options={BIZ_FORM_OPTIONS} single value={bizForm} onPick={(v) => setBizForm(bizForm === v ? '' : v)} />
  )

  const companyFieldsBlock = showCompanyFields && (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <p className="text-sm font-semibold text-slate-800">
        기업 정보 <span className="font-normal text-slate-400">(선택 · 채워주시면 상담이 더 정확해져요)</span>
      </p>
      <div className="mt-3 space-y-3">
        {CONSULT_COMPANY_FIELDS.map((f) => (
          <div key={f.key}>
            <p className="mb-1.5 text-[0.82rem] font-semibold text-slate-500">{f.label}</p>
            <div className="flex flex-wrap gap-1.5">
              {f.options.map((opt) => {
                const on = company[f.key] === opt
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pickCompany(f.key, opt)}
                    aria-pressed={on}
                    className={`rounded-lg border px-2.5 py-1.5 text-[0.85rem] transition ${
                      on ? 'border-blue-500 bg-blue-50 font-bold text-blue-700' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {f.key === '업종' && company['업종'] === '기타' && (
              <input
                type="text"
                value={industryEtc}
                onChange={(e) => setIndustryEtc(e.target.value)}
                placeholder="업종을 직접 입력해주세요 (예: 요식업)"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.85rem] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const fundingBlock = programSelect && (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <p className="text-sm font-semibold text-slate-800">
        자금 계획 <span className="font-normal text-slate-400">(선택 · 실제 필요 여부는 기업진단 후 함께 확인해요)</span>
      </p>
      <div className="mt-3 space-y-3">
        <Chips label="목표 조달금액" options={FUNDING_GOAL_OPTIONS} single value={goal} onPick={(v) => setGoal(goal === v ? '' : v)} />
        <Chips label="자금이 필요한 시기" options={FUNDING_TIMING_OPTIONS} single value={timing} onPick={(v) => setTiming(timing === v ? '' : v)} />
        <Chips label="현재 세금 체납 여부" options={ARREARS_OPTIONS} single value={arrears} onPick={(v) => setArrears(arrears === v ? '' : v)} />
        <Chips label="기존 정책자금·보증 이용 내역" options={PRIOR_FUNDING_OPTIONS} single value={priorFunding} onPick={(v) => setPriorFunding(priorFunding === v ? '' : v)} />
      </div>
      {isAx && (
        <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[0.75rem] leading-relaxed text-slate-500 ring-1 ring-blue-100">
          AX 성장형은 조달 목표금액이 1억원 이상인 성장기업에 권장합니다. 실제 승인 여부와 금액은 기관 평가와 기업 상황에 따라 달라집니다.
        </p>
      )}
    </div>
  )

  const axWorkBlock = isAx && (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-4">
      <p className="text-sm font-bold text-slate-900">현재 업무 · AX 적합성</p>
      <p className="mt-1 text-[0.8rem] leading-snug text-slate-500">적합성 검토에 사용됩니다. 현재 가장 반복되는 업무를 선택해주세요.</p>
      <div className="mt-3 space-y-3.5">
        <div>
          <Chips label={AX_FORM.tasks.label} options={AX_FORM.tasks.options} values={axTasks} onToggle={toggleIn(setAxTasks)} />
          <input
            type="text"
            value={axTaskEtc}
            onChange={(e) => setAxTaskEtc(e.target.value)}
            placeholder="기타 반복업무가 있다면 직접 입력해주세요"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[0.85rem] text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <Chips label={AX_FORM.dataForms.label} options={AX_FORM.dataForms.options} values={axData} onToggle={toggleIn(setAxData)} />
        <Chips label={AX_FORM.participation.label} options={AX_FORM.participation.options} values={axPart} onToggle={toggleIn(setAxPart)} />
      </div>
    </div>
  )

  const axConsentBlock = isAx && (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-4">
      <p className="text-sm font-bold text-slate-900">AX 참여조건</p>
      <div className="mt-3 space-y-3.5">
        {/* 레퍼런스 참여 동의 — 필수 2건 */}
        <div className={`rounded-xl bg-white p-3 ring-1 ${axConsentError ? 'ring-rose-300' : 'ring-blue-100'}`}>
          <p className="text-[0.82rem] font-black text-slate-800">레퍼런스 참여 동의 <span className="text-rose-500">*</span></p>
          <label className="mt-2 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={axConsentAnon}
              onChange={(e) => {
                setAxConsentAnon(e.target.checked)
                if (e.target.checked && axConsentFb) setAxConsentError(false)
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span className="text-[0.82rem] leading-snug text-slate-600">[필수] {AX_FORM.requiredConsents[0]}</span>
          </label>
          <label className="mt-1.5 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={axConsentFb}
              onChange={(e) => {
                setAxConsentFb(e.target.checked)
                if (e.target.checked && axConsentAnon) setAxConsentError(false)
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
            />
            <span className="text-[0.82rem] leading-snug text-slate-600">[필수] {AX_FORM.requiredConsents[1]}</span>
          </label>
          {axConsentError && <p role="alert" className="mt-1.5 text-[0.78rem] font-bold text-rose-600">AX 성장형 참여에는 위 2가지 동의가 필요합니다.</p>}
          <p className="mt-2 text-[0.75rem] leading-snug text-slate-400">
            긍정적인 후기를 요구하지 않습니다. 실제 사용경험과 개선 의견을 솔직하게 알려주세요.
          </p>
        </div>

        <Chips label="상세 피드백 방식 (하나 이상 선택)" options={AX_FORM.feedbackOptions} values={axFeedback} onToggle={toggleIn(setAxFeedback)} />
        <Chips label={AX_FORM.disclosureOptions.label} options={AX_FORM.disclosureOptions.options} values={axDisclosure} onToggle={toggleIn(setAxDisclosure)} />
        <div>
          <Chips label={AX_FORM.interestModules.label} options={AX_FORM.interestModules.options} values={axModules} onToggle={toggleIn(setAxModules)} />
          <p className="mt-2 rounded-lg bg-white px-3 py-2 text-[0.75rem] leading-relaxed text-slate-500 ring-1 ring-blue-100">{AX_FORM.interestModules.note}</p>
        </div>
      </div>
    </div>
  )

  const topicsBlock = topicGroups.length > 0 && (
    <div>
      <p className={labelClass}>{isAx ? '관심 상품·추가 모듈' : '관심 상품'} <span className="font-normal text-slate-400">(선택)</span></p>
      <p className="-mt-0.5 mb-2 text-[0.8rem] leading-snug text-slate-400">선택하지 않으셔도 상담 시 상황에 맞게 알아서 추천해 드려요.</p>
      <div className="space-y-1.5">
        {topicGroups.map((g) => {
          const isOpen = expanded.includes(g.title)
          const picked = g.products.filter((p) => topics.includes(p.name)).length
          return (
            <div key={g.title} className="overflow-hidden rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => toggleGroup(g.title)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[0.9rem] font-semibold transition ${
                  picked > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="min-w-0">
                  {g.title}
                  {picked > 0 && <span className="ml-1.5 text-xs font-bold text-blue-600">· {picked}개 선택</span>}
                </span>
                <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {isOpen && (
                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-white p-2">
                  {g.products.map((prod) => {
                    const on = topics.includes(prod.name)
                    return (
                      <button
                        key={prod.slug}
                        type="button"
                        onClick={() => toggleTopic(prod.name)}
                        aria-pressed={on}
                        className={`flex flex-col overflow-hidden rounded-xl border text-left transition ${
                          on ? 'border-blue-500 ring-2 ring-inset ring-blue-500/30' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full bg-slate-100">
                          {prod.imageSrc && <img src={prod.imageSrc} alt="" loading="lazy" className="h-full w-full object-cover" />}
                          <span
                            className={`absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full text-[0.7rem] font-black transition ${
                              on ? 'bg-blue-600 text-white' : 'bg-white/85 text-transparent ring-1 ring-inset ring-slate-300'
                            }`}
                            aria-hidden
                          >
                            ✓
                          </span>
                        </div>
                        <span className={`px-2.5 py-2 text-[0.82rem] font-semibold leading-snug ${on ? 'text-blue-700' : 'text-slate-700'}`}>{prod.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )

  const messageBlock = (
    <div>
      <label htmlFor="consult-message" className={labelClass}>
        {programSelect ? '현재 가장 어려운 부분' : '문의 내용'} <span className="font-normal text-slate-400">(선택)</span>
      </label>
      <textarea
        id="consult-message"
        name="message"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={programSelect ? '자금·운영에서 지금 가장 어려운 부분을 편하게 적어주세요. 정확하지 않아도 괜찮습니다.' : '궁금한 점이나 현재 상황을 편하게 적어주세요.'}
        className={`${inputClass} resize-y`}
      />
    </div>
  )

  const messageExtraBlock = programSelect && (
    <div>
      <label htmlFor="consult-message-extra" className={labelClass}>
        추가 문의내용 <span className="font-normal text-slate-400">(선택)</span>
      </label>
      <textarea
        id="consult-message-extra"
        rows={2}
        value={messageExtra}
        onChange={(e) => setMessageExtra(e.target.value)}
        placeholder="더 전달하고 싶은 내용이 있으면 적어주세요."
        className={`${inputClass} resize-y`}
      />
    </div>
  )

  const reviewRows: [string, string][] = ([
    ['진행방식', program],
    ['성함', name.trim()],
    ['연락처', contact.trim()],
    ['회사명', companyName.trim()],
    ['사업자 형태', bizForm],
    ['업종', company['업종'] === '기타' && industryEtc.trim() ? `기타 - ${industryEtc.trim()}` : company['업종'] || ''],
    ['업력', company['업력'] || ''],
    ['연매출', company['연매출'] || ''],
    ['직원 수', company['직원 수'] || ''],
    ['사업장 지역', company['지역'] || ''],
    ['목표 조달금액', goal],
    ['자금 필요 시기', timing],
    ['체납 여부', arrears],
    ['정책자금·보증 이용', priorFunding],
    ['상담 희망 방식', method],
    ['관심 상품', topics.join(', ')],
    ...(isAx
      ? ([
          ['AX 반복업무', [...axTasks, ...(axTaskEtc.trim() ? [`기타 - ${axTaskEtc.trim()}`] : [])].join(', ')],
          ['추가 관심 모듈', axModules.join(', ')],
          ['레퍼런스 동의', axConsentAnon && axConsentFb ? '필수 2건 동의' : '미완료'],
        ] as [string, string][])
      : []),
  ] as [string, string][]).filter(([, v]) => v)

  const reviewBlock = programSelect && reviewRows.length > 0 && (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[0.78rem] font-black uppercase tracking-wide text-slate-400">전체 입력내용 요약</p>
      <dl className="mt-2 space-y-1">
        {reviewRows.map(([k, v]) => (
          <div key={k} className="flex gap-2 text-[0.85rem]">
            <dt className="shrink-0 font-semibold text-slate-500">{k}</dt>
            <dd className="min-w-0 font-bold text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )

  const agreeBlock = (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={agree}
        onChange={(e) => {
          setAgree(e.target.checked)
          if (e.target.checked) setAgreeError(false)
        }}
        className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
      />
      <span className={`text-[0.86rem] leading-relaxed ${agreeError ? 'text-rose-600' : 'text-slate-500'}`}>
        <b className="font-bold">[필수]</b> 상담 목적의 개인정보 수집·이용에 동의합니다.{' '}
        <Link to="/privacy" target="_blank" className="underline underline-offset-2 hover:text-slate-700">개인정보처리방침</Link>
      </span>
    </label>
  )

  const errorBlock = status === 'error' && (
    <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
      전송에 문제가 발생했습니다. 잠시 후 다시 시도하시거나 아래로 직접 보내주세요.{' '}
      <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>
      {serverMessage && <span className="mt-1 block text-xs font-normal text-amber-700/80">사유: {serverMessage}</span>}
    </div>
  )

  const stepHint = <p className="mt-2.5 text-center text-xs text-slate-400">무료 · 신청 1~2분 · 진행 여부는 상담 후 결정</p>

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 (고정) */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-white px-6 pb-4 pt-6">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">{heading}</h2>
            {!(wizard && status !== 'success') && <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{intro}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="-mr-1.5 -mt-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* 단계 진행표시 (고정) — 위저드 & 폼 진행 중일 때만 */}
        {wizard && status !== 'success' && (
          <div className="shrink-0 border-b border-slate-100 bg-white px-6 py-3">
            {/* 데스크톱: 1 기업정보 ─ 2 … ─ 3 … */}
            <ol className="hidden items-center gap-1.5 sm:flex">
              {stepTitles.map((title, i) => {
                const n = i + 1
                const state = n < step ? 'done' : n === step ? 'current' : 'todo'
                const clickable = n <= maxStep
                return (
                  <li key={title} className="flex flex-1 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => gotoStep(n)}
                      disabled={!clickable}
                      aria-current={state === 'current' ? 'step' : undefined}
                      className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-left transition ${clickable ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.78rem] font-black ${
                          state === 'current' ? 'bg-blue-600 text-white' : state === 'done' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {state === 'done' ? '✓' : n}
                      </span>
                      <span className={`text-[0.82rem] font-bold ${state === 'current' ? 'text-slate-900' : state === 'done' ? 'text-blue-700' : 'text-slate-400'}`}>{title}</span>
                    </button>
                    {n < stepTitles.length && <span className={`h-[2px] flex-1 rounded-full ${n < step ? 'bg-blue-200' : 'bg-slate-100'}`} />}
                  </li>
                )
              })}
            </ol>
            {/* 모바일: 1 / 3 · 현재 단계명 + 진행 바 */}
            <div className="sm:hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-blue-700">{step} <span className="text-slate-300">/ 3</span></span>
                <span className="text-sm font-bold text-slate-700">{stepTitles[step - 1]}</span>
              </div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3].map((n) => (
                  <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-blue-500' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div className="overflow-y-auto px-6 pb-7 pt-6">
            <div className="py-4 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
              </div>
              <p className="mt-4 text-base font-bold text-slate-900">{serverMessage || '상담 신청이 접수되었습니다.'}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">담당자가 확인 후 남겨주신 연락처로 연락드리겠습니다.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-slate-700"
              >
                확인
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* 내용 영역만 내부 스크롤 */}
            <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {wizard ? (
                <>
                  {/* 단계 1 */}
                  <div hidden={step !== 1} className="space-y-4">
                    <div>
                      <h3 id="consult-step-h-1" tabIndex={-1} className="text-lg font-black tracking-tight text-slate-900 outline-none">{stepHeadings[0]}</h3>
                      <p className="mt-1 text-[0.88rem] leading-snug text-slate-500">{stepIntros[0]}</p>
                    </div>
                    {contextBlock}
                    {programBlock}
                    {nameContactBlock}
                    {companyNameBlock}
                    {bizFormBlock}
                    {companyFieldsBlock}
                  </div>
                  {/* 단계 2 */}
                  <div hidden={step !== 2} className="space-y-4">
                    <div>
                      <h3 id="consult-step-h-2" tabIndex={-1} className="text-lg font-black tracking-tight text-slate-900 outline-none">{stepHeadings[1]}</h3>
                      <p className="mt-1 text-[0.88rem] leading-snug text-slate-500">{stepIntros[1]}</p>
                    </div>
                    {fundingBlock}
                    {messageBlock}
                    {messageExtraBlock}
                    {axWorkBlock}
                  </div>
                  {/* 단계 3 */}
                  <div hidden={step !== 3} className="space-y-4">
                    <div>
                      <h3 id="consult-step-h-3" tabIndex={-1} className="text-lg font-black tracking-tight text-slate-900 outline-none">{stepHeadings[2]}</h3>
                      <p className="mt-1 text-[0.88rem] leading-snug text-slate-500">{stepIntros[2]}</p>
                    </div>
                    {methodBlock}
                    {topicsBlock}
                    {axConsentBlock}
                    {reviewBlock}
                    {agreeBlock}
                    {errorBlock}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {contextBlock}
                  {nameContactBlock}
                  {methodBlock}
                  {companyNameBlock}
                  {companyFieldsBlock}
                  {topicsBlock}
                  {messageBlock}
                  {agreeBlock}
                  {errorBlock}
                </div>
              )}
            </div>

            {/* 하단 버튼 (고정 + safe-area) */}
            <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {wizard ? (
                <>
                  <div className="flex items-center gap-2.5">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={goPrev}
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-base font-bold text-slate-600 transition-colors hover:bg-slate-50"
                      >
                        이전
                      </button>
                    )}
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        다음 · {stepTitles[step]}
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? '전송 중…' : '신청서 제출하기'}
                      </button>
                    )}
                  </div>
                  {step === 3 && stepHint}
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? '전송 중…' : submitLabel}
                  </button>
                  {stepHint}
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
