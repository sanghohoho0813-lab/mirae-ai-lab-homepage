/* eslint-disable */
/**
 * 미래 AI 랩 — 도구 앱 진입 게이트 (v1)
 *
 * 도구 앱은 포털(miraeailab.com)과 도메인이 달라 로그인 세션을 공유할 수 없다.
 * 그래서 포털이 "이 사용자는 이 도구를 지금 쓸 수 있다"는 짧은 서명 티켓(?mlt=)을 붙여 보내고,
 * 이 스크립트가 그 티켓을 포털에 되물어 확인한 뒤 화면을 열어준다.
 *
 * 도구 앱에서는 index.html <head> 에 아래 한 줄만 넣으면 된다.
 *   <script src="https://miraeailab.com/tool-gate.js" data-tool="도구ID"></script>
 *
 * data-tool 은 미래 AI 랩 tools 테이블의 slug 와 정확히 같아야 한다.
 *   hr-subsidy-pro / labcare-rnd-os / corp-sales-os / cretop-analyzer / startup-tax-checker
 * 이 값이 티켓에 담긴 도구와 다르면 잠긴다 — 다른 도구용 티켓을 가져다 쓰는 우회 방지.
 *
 * 동작
 *   1) 주소에 ?mlt=티켓 이 있으면 포털에 검증을 요청하고, 통과하면 이용 종료 시각을 저장한다.
 *      (티켓은 곧바로 주소에서 지운다 — 공유·기록에 남지 않게)
 *   2) 티켓이 없으면 저장된 이용 종료 시각을 본다. 아직 남아 있으면 그대로 연다.
 *   3) 둘 다 없거나 기간이 지났으면 잠금 화면을 띄우고 미래 AI 랩으로 안내한다.
 *
 * ⚠️ 한계: 이 도구들은 자체 서버가 없는 정적 앱이라 검증이 브라우저에서 이뤄진다.
 *    개발자도구를 쓸 줄 아는 사용자는 우회할 수 있다. 완전한 차단은 도구별 서버(API)에서
 *    데이터를 내려줄 때 권한을 확인해야 가능하다.
 */
;(function () {
  'use strict'

  var PORTAL = 'https://miraeailab.com'
  var VERIFY_URL = PORTAL + '/api/trial'
  var current =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName('script')
      for (var i = s.length - 1; i >= 0; i--) if (s[i].src && s[i].src.indexOf('tool-gate.js') >= 0) return s[i]
      return null
    })()

  var TOOL_ID = (current && current.getAttribute('data-tool')) || ''
  if (!TOOL_ID) {
    console.warn('[mirae-gate] data-tool 이 없어 게이트를 건너뜁니다.')
    return
  }
  var KEY = 'mirae:tool-grant:' + TOOL_ID

  // ── 저장된 이용 권한 ──────────────────────────────────────────────────────
  function readGrant() {
    try {
      var raw = localStorage.getItem(KEY)
      if (!raw) return null
      var g = JSON.parse(raw)
      if (!g || typeof g.until !== 'number') return null
      return g.until > Date.now() ? g : null
    } catch (e) {
      return null
    }
  }
  function writeGrant(untilMs, userId) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ until: untilMs, u: userId || '', at: Date.now() }))
    } catch (e) {
      /* 저장 못 해도 이번 세션은 연다 */
    }
  }
  function clearGrant() {
    try {
      localStorage.removeItem(KEY)
    } catch (e) {}
  }

  // ── 화면 ──────────────────────────────────────────────────────────────────
  var overlay = document.createElement('div')
  overlay.setAttribute('data-mirae-gate', '')
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'z-index:2147483647',
    'display:flex', 'align-items:center', 'justify-content:center',
    'background:#0F1216', 'color:#fff', 'padding:24px',
    'font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif',
    'word-break:keep-all', 'line-height:1.6',
  ].join(';')
  overlay.innerHTML =
    '<div style="text-align:center;max-width:420px">' +
    '<div style="width:34px;height:34px;margin:0 auto;border:3px solid rgba(255,255,255,.25);border-top-color:#D47A4A;border-radius:50%;animation:mirae-spin .8s linear infinite"></div>' +
    '<p style="margin:18px 0 0;font-size:15px;color:#9AA4AF">이용 권한을 확인하고 있습니다…</p>' +
    '</div>' +
    '<style>@keyframes mirae-spin{to{transform:rotate(360deg)}}</style>'

  function mount() {
    var root = document.body || document.documentElement
    if (root && !overlay.parentNode) root.appendChild(overlay)
  }
  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount)

  function allow() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay)
  }

  function deny(reason) {
    var title = '이용 기간이 아닙니다'
    var desc = '미래 AI 랩에서 무료 체험을 시작하면 바로 이용할 수 있습니다.'
    if (reason === 'expired') {
      title = '체험 기간이 종료되었습니다'
      desc = '리뷰·설문으로 기간을 연장하거나, 정식 이용으로 계속 사용할 수 있습니다.'
    } else if (reason === 'bad_ticket') {
      title = '진입 정보가 만료되었습니다'
      desc = '미래 AI 랩 내 도구함에서 다시 열어주세요.'
    } else if (reason === 'network') {
      title = '권한을 확인하지 못했습니다'
      desc = '네트워크 상태를 확인한 뒤 다시 시도해 주세요.'
    }
    mount()
    overlay.innerHTML =
      '<div style="text-align:center;max-width:460px">' +
      '<div style="font-size:34px">🔒</div>' +
      '<h1 style="margin:14px 0 0;font-size:21px;font-weight:800;letter-spacing:-.02em">' + title + '</h1>' +
      '<p style="margin:10px 0 0;font-size:15px;color:#9AA4AF">' + desc + '</p>' +
      '<a href="' + PORTAL + '/my-tools" style="display:inline-flex;align-items:center;justify-content:center;margin-top:22px;min-height:48px;padding:0 22px;border-radius:12px;background:#D47A4A;color:#fff;font-size:15px;font-weight:800;text-decoration:none">미래 AI 랩에서 열기</a>' +
      '<p style="margin:14px 0 0;font-size:13px;color:#6B7680">문의: 미래 AI 랩 고객센터</p>' +
      '</div>'
  }

  // ── 티켓 처리 ─────────────────────────────────────────────────────────────
  function takeTicket() {
    try {
      var u = new URL(window.location.href)
      var t = u.searchParams.get('mlt')
      if (!t) return null
      u.searchParams.delete('mlt') // 주소에 티켓이 남지 않게 즉시 제거
      window.history.replaceState(null, '', u.pathname + (u.search === '?' ? '' : u.search) + u.hash)
      return t
    } catch (e) {
      return null
    }
  }

  var ticket = takeTicket()
  var grant = readGrant()

  if (!ticket) {
    if (grant) allow()
    else deny('not_started')
    return
  }

  fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action: 'verify', ticket: ticket }),
  })
    .then(function (r) {
      return r.json().catch(function () {
        return {}
      })
    })
    .then(function (d) {
      // 다른 도구용 티켓이면 거부
      if (d && d.allowed && d.toolSlug && d.toolSlug !== TOOL_ID) {
        clearGrant()
        deny('bad_ticket')
        return
      }
      if (d && d.allowed && d.expiresAt) {
        writeGrant(new Date(d.expiresAt).getTime(), d.userId)
        allow()
      } else {
        clearGrant()
        deny((d && d.reason) || 'not_started')
      }
    })
    .catch(function () {
      // 확인 실패 — 이미 유효한 권한이 저장돼 있으면 열어주고, 아니면 막는다
      if (grant) allow()
      else deny('network')
    })
})()
