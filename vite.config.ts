import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'node:child_process'

// 빌드 메타데이터(배포 커밋 확인용) — HTML dataset 에 주입
function git(cmd: string, fallback: string): string {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || fallback
  } catch {
    return fallback
  }
}
const BUILD_COMMIT = process.env.VERCEL_GIT_COMMIT_SHA || git('git rev-parse --short HEAD', 'unknown')
const BUILD_BRANCH = process.env.VERCEL_GIT_COMMIT_REF || git('git rev-parse --abbrev-ref HEAD', 'unknown')
const BUILD_TIME = new Date().toISOString()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __BUILD_COMMIT__: JSON.stringify(BUILD_COMMIT),
    __BUILD_BRANCH__: JSON.stringify(BUILD_BRANCH),
    __BUILD_TIME__: JSON.stringify(BUILD_TIME),
  },
})
