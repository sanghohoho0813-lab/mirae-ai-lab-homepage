// 사이트 정식 주소 — canonical / sitemap 이 모두 이 값을 기준으로 통일된다.
// 미리보기 배포(*.vercel.app)에서도 canonical 은 항상 운영 도메인을 가리켜야
// 검색엔진이 중복 URL 로 색인하지 않는다.
export const SITE_ORIGIN = 'https://miraeailab.com'

/** 경로(pathname)를 운영 도메인 기준 절대 URL 로 만든다. 쿼리·해시는 제외한다. */
export function canonicalUrl(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  // 루트 외에는 끝 슬래시를 제거해 sitemap 표기와 일치시킨다
  const normalized = path.length > 1 ? path.replace(/\/+$/, '') : '/'
  return `${SITE_ORIGIN}${normalized}`
}
