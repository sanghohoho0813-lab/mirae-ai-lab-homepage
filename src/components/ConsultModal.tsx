// 사이트 공통 "상담 신청 / 문의" 모달 — 어디서 열든 담긴 상품·선택 항목(contextRows)을
// 함께 실어 /api/consult(→ 관리자 지메일)로 보냅니다. 카드결제 준비 중 상담 우회 CTA 공용.
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
  /** 진행방식(핵심 프로그램 A/B/C) 선택 + 자금 공통질문 + AX 조건부 문항 노출 */
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
  const scrollRef = useRef<HTMLDivElement>(null)

  const isAx = programSelect && program === AX_PROGRAM_NAME

  const toggleTopic = (t: string) =>
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const toggleGroup = (t: string) =>
    setExpanded((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))
  const pickCompany = (key: string, value: string) =>
    setCompany((cur) => ({ ...cur, [key]: cur[key] === value ? '' : value }))
  const toggleIn = (setter: (fn: (cur: string[]) => string[]) => void) => (v: string) =>
    setter((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]))

  // 열릴 때마다 상태 초기화 + 스크롤 잠금 + ESC 닫기 (자동 포커스 없음 → 항상 상단부터)
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
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, preselectProduct, topicGroups, preselectProgram])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!agree) {
      setAgreeError(true)
      return
    }
    // AX 결합 성장자금형 — 레퍼런스 필수 동의 2건 확인
    if (isAx && (!axConsentAnon || !axConsentFb)) {
      setAxConsentError(true)
      return
    }
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const contact = String(fd.get('contact') ?? '').trim()
    const companyName = String(fd.get('company') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
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
      const res = await submitConsult({ name, contact, company: companyName, message, source, context, structured })
      setServerMessage(res.message)
      setStatus('success')
      form.reset()
    } catch (e) {
      setServerMessage(e instanceof Error ? e.message : '')
      setStatus('error')
    }
  }

  const submitting = status === 'submitting'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      onClick={onClose}
    >
      <div
        ref={scrollRef}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-6 pb-4 pt-6">
          <div className="min-w-0">
            <h2 className="text-xl font-black tracking-tight text-slate-900">{heading}</h2>
            <p className="mt-1.5 text-[0.92rem] leading-relaxed text-slate-500">{intro}</p>
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

        <div className="px-6 pb-7 pt-5">
          {status === 'success' ? (
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
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* 담긴 상품/선택 항목 요약 */}
              {contextRows.length > 0 && (
                <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
              )}

              {/* 진행방식 선택 — 핵심 프로그램 A/B/C */}
              {programSelect && (
                <div className="mb-5 rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4">
                  <p className="text-sm font-bold text-slate-900">어떤 방식의 진행을 희망하시나요?</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    {PROGRAM_CHOICES.map((c) => {
                      const on = program === c
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setProgram(on ? '' : c)}
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
                  {program === AX_PROGRAM_NAME && (
                    <p className="mt-2.5 rounded-lg bg-white px-3 py-2 text-[0.78rem] leading-relaxed text-slate-500 ring-1 ring-blue-100">
                      AX 결합 성장자금형은 <b className="text-slate-700">적합성 신청 → 내부 검토 → 참여 승인 → 착수금 결제</b> 순서로 진행됩니다. 신청 시 결제가 이뤄지지 않습니다.
                    </p>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="consult-name" className={labelClass}>
                    성함 <span className="text-rose-500">*</span>
                  </label>
                  <input id="consult-name" name="name" type="text" required placeholder="예: 김대표" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="consult-contact" className={labelClass}>
                    연락처 <span className="text-rose-500">*</span>
                  </label>
                  <input id="consult-contact" name="contact" type="tel" required defaultValue="010-" placeholder="휴대폰 번호" inputMode="tel" className={inputClass} />
                </div>
              </div>

              {showContactMethod && (
                <div className="mt-4">
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
              )}

              <div className="mt-4">
                <label htmlFor="consult-company" className={labelClass}>
                  회사명 <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <input id="consult-company" name="company" type="text" placeholder="예: (주)미래상사" className={inputClass} />
              </div>

              {/* 기업 정보 — 규모 파악용(선택). 채워주시면 상담이 더 정확해집니다. */}
              {showCompanyFields && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
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
                        {/* 업종 '기타' 선택 시 직접 입력 */}
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
              )}

              {/* 자금 공통질문 — 진행방식 선택 모드에서만 */}
              {programSelect && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    자금 계획 <span className="font-normal text-slate-400">(선택 · 채워주시면 진단이 더 정확해져요)</span>
                  </p>
                  <div className="mt-3 space-y-3">
                    <Chips label="사업자 형태" options={BIZ_FORM_OPTIONS} single value={bizForm} onPick={(v) => setBizForm(bizForm === v ? '' : v)} />
                    <Chips label="목표 조달금액" options={FUNDING_GOAL_OPTIONS} single value={goal} onPick={(v) => setGoal(goal === v ? '' : v)} />
                    <Chips label="자금이 필요한 시기" options={FUNDING_TIMING_OPTIONS} single value={timing} onPick={(v) => setTiming(timing === v ? '' : v)} />
                    <Chips label="현재 세금 체납 여부" options={ARREARS_OPTIONS} single value={arrears} onPick={(v) => setArrears(arrears === v ? '' : v)} />
                    <Chips label="기존 정책자금·보증 이용 내역" options={PRIOR_FUNDING_OPTIONS} single value={priorFunding} onPick={(v) => setPriorFunding(priorFunding === v ? '' : v)} />
                  </div>
                </div>
              )}

              {/* AX 결합 성장자금형 조건부 문항 */}
              {isAx && (
                <div className="mt-4 rounded-2xl border-2 border-blue-200 bg-blue-50/40 p-4">
                  <p className="text-sm font-bold text-slate-900">AX 결합 성장자금형 추가 문항</p>
                  <p className="mt-1 text-[0.8rem] leading-snug text-slate-500">적합성 검토에 사용됩니다. 해당하는 항목을 눌러주세요.</p>
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
                      {axConsentError && <p className="mt-1.5 text-[0.78rem] font-bold text-rose-600">AX 성장형 참여에는 위 2가지 동의가 필요합니다.</p>}
                      <p className="mt-2 text-[0.75rem] leading-snug text-slate-400">
                        긍정적인 후기를 요구하지 않습니다. 솔직한 사용경험·개선 피드백이면 충분합니다.
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
              )}

              {/* 관심 상품 — 맨 아래 · 선택 사항(안 골라도 상황 맞춰 추천). 목차 안 상품은 2열 카드+큰 썸네일 */}
              {topicGroups.length > 0 && (
                <div className="mt-4">
                  <p className={labelClass}>관심 상품 <span className="font-normal text-slate-400">(선택)</span></p>
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
              )}

              <div className="mt-4">
                <label htmlFor="consult-message" className={labelClass}>
                  {programSelect ? '현재 가장 어려운 부분' : '문의 내용'} <span className="font-normal text-slate-400">(선택)</span>
                </label>
                <textarea
                  id="consult-message"
                  name="message"
                  rows={3}
                  placeholder={programSelect ? '자금·운영에서 지금 가장 어려운 부분을 편하게 적어주세요.' : '궁금한 점이나 현재 상황을 편하게 적어주세요.'}
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* 신청 전 입력내용 요약 확인 */}
              {programSelect && (program || goal || timing || bizForm) && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[0.78rem] font-black uppercase tracking-wide text-slate-400">신청 전 확인 — 선택하신 내용</p>
                  <dl className="mt-2 space-y-1">
                    {[
                      ['진행방식', program],
                      ['사업자 형태', bizForm],
                      ['목표 조달금액', goal],
                      ['자금 필요 시기', timing],
                      ['체납 여부', arrears],
                      ['정책자금·보증 이용', priorFunding],
                      ...(isAx
                        ? ([
                            ['AX 반복업무', axTasks.join(', ')],
                            ['추가 관심 모듈', axModules.join(', ')],
                            ['레퍼런스 동의', axConsentAnon && axConsentFb ? '필수 2건 동의' : '미완료'],
                          ] as [string, string][])
                        : []),
                    ]
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-[0.85rem]">
                          <dt className="shrink-0 font-semibold text-slate-500">{k}</dt>
                          <dd className="min-w-0 font-bold text-slate-800">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}

              {/* 개인정보 동의 */}
              <label className="mt-4 flex cursor-pointer items-start gap-2.5">
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

              {status === 'error' && (
                <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  전송에 문제가 발생했습니다. 잠시 후 다시 시도하시거나 아래로 직접 보내주세요.{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>
                  {serverMessage && <span className="mt-1 block text-xs font-normal text-amber-700/80">사유: {serverMessage}</span>}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-4 text-base font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? '전송 중…' : submitLabel}
              </button>
              <p className="mt-2.5 text-center text-xs text-slate-400">무료 · 신청 1~2분 · 진행 여부는 상담 후 결정</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
