// /api/reviews — 상품 리뷰 (정책자금 컨설팅 등).
// 공개:
//   GET  ?slug=funding-consulting      — 승인된 리뷰 목록(안전 컬럼만) + 평점 통계
//   POST { action:'submit', ... }      — 리뷰 접수(status='pending'). 비회원 가능. 승인 후 공개.
// 관리자(Bearer → profiles.role==='admin'):
//   GET  ?action=admin-list[&slug=]    — 전체 리뷰(연락처 포함) + 통계
//   POST { action:'moderate', id, status?, ebookSent?, adminMemo? }
// service_role 은 서버에서만 사용. 연락처(email/phone)는 공개 조회에 절대 포함하지 않음.
import { getSupabaseAdmin, verifyAdmin } from './_lib/supabaseAdmin'

function detailOf(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`.slice(0, 180)
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message?: unknown }).message).slice(0, 180)
  return String(e).slice(0, 180)
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim()
}

function clientIp(req: any): string {
  const xf = req.headers?.['x-forwarded-for'] ?? req.headers?.['X-Forwarded-For']
  const raw = Array.isArray(xf) ? xf[0] : String(xf ?? '')
  return raw.split(',')[0].trim().slice(0, 60)
}

// 공개 노출용 안전 컬럼 매핑 (연락처 제외)
function toPublic(r: any) {
  return {
    id: r.id,
    authorName: r.author_name,
    company: r.company ?? null,
    rating: r.rating,
    content: r.content,
    createdAt: r.created_at,
  }
}

export default async function handler(req: any, res: any) {
  try {
    const admin = await getSupabaseAdmin()
    if (!admin) return res.status(500).json({ ok: false, message: '서버 환경변수가 설정되지 않았습니다.', debugCode: 'no_env' })

    const q = req.query ?? {}
    const method = req.method

    // ── 공개: 승인된 리뷰 목록 ──
    if (method === 'GET' && String(q.action ?? '') !== 'admin-list') {
      const slug = str(q.slug)
      if (!slug) return res.status(400).json({ ok: false, message: '상품 정보가 없습니다.', debugCode: 'no_slug' })
      const { data } = await admin
        .from('product_reviews')
        .select('id, author_name, company, rating, content, created_at')
        .eq('product_slug', slug)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(200)
      const rows = (data ?? []) as any[]
      const count = rows.length
      const avg = count ? Math.round((rows.reduce((s, r) => s + (r.rating || 0), 0) / count) * 10) / 10 : 0
      return res.status(200).json({ ok: true, reviews: rows.map(toPublic), stats: { count, avg } })
    }

    // ── 공개: 리뷰 접수 (pending) ──
    if (method === 'POST' && str((req.body ?? {}).action) === 'submit') {
      const b = req.body ?? {}
      const slug = str(b.slug)
      const authorName = str(b.authorName).slice(0, 40)
      const company = str(b.company).slice(0, 60)
      const content = str(b.content)
      const email = str(b.email).slice(0, 120)
      const phone = str(b.phone).replace(/[^\d+\-]/g, '').slice(0, 30)
      const rating = Math.trunc(Number(b.rating))

      if (!slug) return res.status(400).json({ ok: false, message: '상품 정보가 없습니다.', debugCode: 'no_slug' })
      if (!authorName) return res.status(400).json({ ok: false, message: '성함(표시명)을 입력해 주세요.', debugCode: 'no_name' })
      if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ ok: false, message: '별점을 선택해 주세요.', debugCode: 'bad_rating' })
      if (content.length < 5) return res.status(400).json({ ok: false, message: '후기를 5자 이상 입력해 주세요.', debugCode: 'short_content' })
      if (content.length > 2000) return res.status(400).json({ ok: false, message: '후기는 2000자 이내로 입력해 주세요.', debugCode: 'long_content' })
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return res.status(400).json({ ok: false, message: '이메일 형식을 확인해 주세요.', debugCode: 'bad_email' })

      const { error } = await admin.from('product_reviews').insert({
        product_slug: slug,
        author_name: authorName,
        company: company || null,
        rating,
        content,
        contact_email: email || null,
        contact_phone: phone || null,
        status: 'pending',
        source_ip: clientIp(req) || null,
      })
      if (error) return res.status(500).json({ ok: false, message: '접수에 실패했습니다. 잠시 후 다시 시도해 주세요.', debugCode: 'insert_fail', detail: detailOf(error) })
      return res.status(200).json({ ok: true, message: '소중한 후기 감사합니다. 검토 후 게시되며, 전자책 3종은 확인 후 이메일로 보내드립니다.' })
    }

    // ── 관리자: 전체 목록 ──
    if (method === 'GET' && String(q.action ?? '') === 'admin-list') {
      const auth = await verifyAdmin(admin, req.headers?.authorization ?? req.headers?.Authorization)
      if (!auth.ok) return res.status(auth.status).json({ ok: false, message: auth.message, debugCode: auth.debugCode })
      const slug = str(q.slug)
      let sel = admin
        .from('product_reviews')
        .select('id, product_slug, author_name, company, rating, content, contact_email, contact_phone, status, ebook_sent, admin_memo, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(1000)
      if (slug) sel = sel.eq('product_slug', slug)
      const { data } = await sel
      const rows = (data ?? []) as any[]
      const stats = {
        total: rows.length,
        pending: rows.filter((r) => r.status === 'pending').length,
        approved: rows.filter((r) => r.status === 'approved').length,
        rejected: rows.filter((r) => r.status === 'rejected').length,
        ebookPending: rows.filter((r) => r.status === 'approved' && !r.ebook_sent).length,
      }
      return res.status(200).json({ ok: true, reviews: rows, stats })
    }

    // ── 관리자: 모더레이션 ──
    if (method === 'POST' && str((req.body ?? {}).action) === 'moderate') {
      const auth = await verifyAdmin(admin, req.headers?.authorization ?? req.headers?.Authorization)
      if (!auth.ok) return res.status(auth.status).json({ ok: false, message: auth.message, debugCode: auth.debugCode })
      const b = req.body ?? {}
      const id = str(b.id)
      if (!id) return res.status(400).json({ ok: false, message: '리뷰 ID가 없습니다.', debugCode: 'no_id' })
      const patch: Record<string, unknown> = {}
      if (b.status != null) {
        const s = str(b.status)
        if (!['pending', 'approved', 'rejected'].includes(s)) return res.status(400).json({ ok: false, message: '상태 값이 올바르지 않습니다.', debugCode: 'bad_status' })
        patch.status = s
      }
      if (b.ebookSent != null) patch.ebook_sent = Boolean(b.ebookSent)
      if (b.adminMemo != null) patch.admin_memo = str(b.adminMemo).slice(0, 500) || null
      if (Object.keys(patch).length === 0) return res.status(400).json({ ok: false, message: '변경할 내용이 없습니다.', debugCode: 'no_patch' })
      const { error } = await admin.from('product_reviews').update(patch).eq('id', id)
      if (error) return res.status(500).json({ ok: false, message: '변경에 실패했습니다.', debugCode: 'update_fail', detail: detailOf(error) })
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ ok: false, message: '허용되지 않은 요청입니다.', debugCode: 'method' })
  } catch (e) {
    return res.status(500).json({ ok: false, message: '리뷰 처리 중 오류가 발생했습니다.', debugCode: 'unhandled', detail: detailOf(e) })
  }
}
