/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// 빌드 메타데이터(vite define 주입) — 배포 커밋 확인용
declare const __BUILD_COMMIT__: string
declare const __BUILD_BRANCH__: string
declare const __BUILD_TIME__: string
