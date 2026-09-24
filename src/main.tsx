import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'

// 빌드 메타데이터를 <html> dataset 에 기록(배포 커밋 확인용, 비노출)
try {
  const el = document.documentElement
  el.dataset.buildCommit = __BUILD_COMMIT__
  el.dataset.buildBranch = __BUILD_BRANCH__
  el.dataset.buildTime = __BUILD_TIME__
} catch {
  /* noop */
}
import { AuthProvider } from './lib/auth'
import AuthGuard from './components/auth/AuthGuard'
import GuestOnly from './components/auth/GuestOnly'
import ScrollToTop from './components/ScrollToTop'
import CanonicalLink from './components/CanonicalLink'
import AppErrorBoundary from './components/AppErrorBoundary'
import RouteFallback from './components/RouteFallback'
import { lazyPage, reloadOnce } from './lib/chunkRecovery'

// ── 화면별 코드 분할 ─────────────────────────────────────────────────────
// 예전엔 어느 페이지로 들어오든 관리자·결제·마이페이지까지 한 파일(1.48MB)로 받았다.
// 이제 들어온 화면의 코드만 받는다. 배포 직후 파일 이름이 바뀌어 못 받으면 lazyPage 가 한 번 새로고침한다.
const App = lazyPage(() => import('./App.tsx'))
const LoginPage = lazyPage(() => import('./pages/LoginPage'))
const SignupPage = lazyPage(() => import('./pages/SignupPage'))
const MyToolsPage = lazyPage(() => import('./pages/MyToolsPage'))
const ToolPassPage = lazyPage(() => import('./pages/ToolPassPage'))
const AdminPage = lazyPage(() => import('./pages/AdminPage'))
const AdminBusinessLeadsPage = lazyPage(() => import('./pages/AdminBusinessLeadsPage'))
const AdminMembersPage = lazyPage(() => import('./pages/AdminMembersPage'))
const AdminReviewsPage = lazyPage(() => import('./pages/AdminReviewsPage'))
const AdminPaymentsPage = lazyPage(() => import('./pages/AdminPaymentsPage'))
const CheckoutPage = lazyPage(() => import('./pages/CheckoutPage'))
const PaymentCompletePage = lazyPage(() => import('./pages/PaymentCompletePage'))
const MyOrdersPage = lazyPage(() => import('./pages/MyOrdersPage'))
const BusinessDiagnosisPage = lazyPage(() => import('./pages/BusinessDiagnosisPage'))
const BusinessDiagnosisResultsPage = lazyPage(() => import('./pages/BusinessDiagnosisResultsPage'))
const BusinessServicesPage = lazyPage(() => import('./pages/BusinessServicesPage'))
const AxStartPage = lazyPage(() => import('./pages/AxStartPage'))
const VentureMvpPage = lazyPage(() => import('./pages/VentureMvpPage'))
const BusinessAxGuidePage = lazyPage(() => import('./pages/BusinessAxGuidePage'))
const AxIndustryDetailPage = lazyPage(() => import('./pages/AxIndustryDetailPage'))
const BusinessServiceDetailPage = lazyPage(() => import('./pages/BusinessServiceDetailPage'))
const BusinessCatalogPage = lazyPage(() => import('./pages/BusinessCatalogPage'))
const FundingConsultingDetailPage = lazyPage(() => import('./pages/business-details/FundingConsultingDetailPage'))
const GatewayPage = lazyPage(() => import('./pages/GatewayPage'))
const AuthCallbackPage = lazyPage(() => import('./pages/auth/AuthCallbackPage'))
const OnboardingPage = lazyPage(() => import('./pages/auth/OnboardingPage'))
const ForgotPasswordPage = lazyPage(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazyPage(() => import('./pages/auth/ResetPasswordPage'))
const MyPage = lazyPage(() => import('./pages/MyPage'))
const SavedItemsPage = lazyPage(() => import('./pages/SavedItemsPage'))
const TermsPage = lazyPage(() => import('./pages/legal/TermsPage'))
const PrivacyPolicyPage = lazyPage(() => import('./pages/legal/PrivacyPolicyPage'))
const RefundPolicyPage = lazyPage(() => import('./pages/legal/RefundPolicyPage'))
const BusinessInfoPage = lazyPage(() => import('./pages/legal/BusinessInfoPage'))
const MyProjectsPage = lazyPage(() => import('./pages/MyProjectsPage'))
const MyProjectDetailPage = lazyPage(() => import('./pages/MyProjectDetailPage'))

// Vite 가 화면 파일을 미리 받다(preload) 실패한 경우 — 배포 직후 흔하다. 한 번만 새로고침한다.
// 30초 안에 또 실패하면 막지 않고 에러 경계(직접 새로고침 버튼)로 넘긴다.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnce()) event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <CanonicalLink />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<GatewayPage />} />
              <Route path="/consultants" element={<App />} />
              <Route path="/for-consultants" element={<Navigate to="/consultants" replace />} />
              <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
              <Route path="/signup" element={<GuestOnly><SignupPage /></GuestOnly>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/auth/onboarding" element={<OnboardingPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
              <Route path="/welcome" element={<Navigate to="/auth/onboarding" replace />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/account" element={<Navigate to="/mypage" replace />} />
              <Route
                path="/my-tools"
                element={
                  <AuthGuard role="consultant">
                    <MyToolsPage />
                  </AuthGuard>
                }
              />
              <Route path="/dashboard" element={<Navigate to="/my-tools" replace />} />
              {/* 초대 링크 — 로그인 없이 들어오는 자리라 인증 가드를 두지 않는다 */}
              <Route path="/pass/:token" element={<ToolPassPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/business-leads" element={<AdminBusinessLeadsPage />} />
              <Route path="/admin/members" element={<AdminMembersPage />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/checkout/:productSlug" element={<CheckoutPage />} />
              <Route path="/payment/complete" element={<PaymentCompletePage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/my-projects" element={<MyProjectsPage />} />
              <Route path="/my-projects/:linkId" element={<MyProjectDetailPage />} />
              {/* 대표님 2-Track 선택 → ① AX 홈(ax-start) → AX 상세 안내(ax) / ② 기술사업·MVP(venture-mvp) — 모두 :slug 보다 먼저 */}
              <Route path="/business-services" element={<BusinessServicesPage />} />
              <Route path="/business-services/ax-start" element={<AxStartPage />} />
              <Route path="/business-services/venture-mvp" element={<VentureMvpPage />} />
              {/* 스토리 04~12 + Preview·MVP·실제 프로젝트·FAQ */}
              <Route path="/business-services/ax" element={<BusinessAxGuidePage />} />
              <Route path="/ax-industries/:slug" element={<AxIndustryDetailPage />} />
              <Route path="/saved" element={<SavedItemsPage />} />
              <Route path="/business-diagnosis" element={<BusinessDiagnosisPage />} />
              <Route path="/business-diagnosis/results" element={<BusinessDiagnosisResultsPage />} />
              <Route path="/business-diagnosis/results/:resultId" element={<BusinessDiagnosisResultsPage />} />
              <Route path="/business-services/funding-consulting" element={<FundingConsultingDetailPage />} />
              <Route path="/business-services/all" element={<BusinessCatalogPage />} />
              <Route path="/business-services/:slug" element={<BusinessServiceDetailPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/business-info" element={<BusinessInfoPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </AppErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
