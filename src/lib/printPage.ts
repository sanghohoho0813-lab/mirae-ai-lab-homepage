// 인쇄 · PDF 저장 공통 처리.
//
// window.print() 는 모든 브라우저에서 되는 게 아니다. 특히 카카오톡·네이버·인스타그램 등
// 앱 안에 들어 있는 브라우저(인앱 브라우저)에서는 아무 일도 일어나지 않거나 오류가 난다.
// 그래서 "인쇄가 실제로 시작됐는지"를 확인하고, 안 됐으면 화면에서 안내할 수 있게 알려준다.
//
// 시작 여부는 beforeprint 이벤트로 판단한다. 인쇄창이 뜨는 브라우저는 이 이벤트를 먼저 쏘고,
// 인앱 브라우저처럼 아무것도 안 하는 쪽은 쏘지 않는다.

/** 카카오톡·네이버·인스타그램 등 앱 내장 브라우저인가 (인쇄가 대체로 불가능하다) */
export function isInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /KAKAOTALK|NAVER\(inapp|DaumApps|Instagram|FB_IAB|FBAN|FBAV|Line\/|everytimeApp|kakaostory|band_/i.test(ua)
}

/** 아이폰·아이패드 (공유 → 프린트 경로를 안내해야 한다) */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

/**
 * 인쇄를 시도하고, 실제로 인쇄가 시작됐으면 true 를 돌려준다.
 * false 면 이 환경에서는 인쇄가 안 되는 것이므로 화면에서 다른 방법을 안내해야 한다.
 */
export function runPrint(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof window.print !== 'function') {
      resolve(false)
      return
    }

    let started = false
    let settled = false
    const onBefore = () => {
      started = true
    }
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      window.removeEventListener('beforeprint', onBefore)
      resolve(ok)
    }

    window.addEventListener('beforeprint', onBefore)

    try {
      // 인쇄창이 열리는 브라우저에서는 이 줄에서 멈춰 있다가 창을 닫으면 이어진다
      window.print()
    } catch {
      finish(false)
      return
    }

    // print() 가 조용히 아무 일도 안 한 경우를 잡는다.
    // 인쇄창이 떴다면 그 사이 beforeprint 가 이미 발생했으므로 오탐이 나지 않는다.
    window.setTimeout(() => finish(started), 900)
  })
}
