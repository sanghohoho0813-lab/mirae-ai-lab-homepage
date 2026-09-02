import { StrictMode } from 'react'
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
import App from './App.tsx'
import { AuthProvider } from './lib/auth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyToolsPage from './pages/MyToolsPage'
import AdminPage from './pages/AdminPage'
import AdminBusinessLeadsPage from './pages/AdminBusinessLeadsPage'
import AdminMembersPage from './pages/AdminMembersPage'
import AdminReviewsPage from './pages/AdminReviewsPage'
import AdminPaymentsPage from './pages/AdminPaymentsPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentCompletePage from './pages/PaymentCompletePage'
import MyOrdersPage from './pages/MyOrdersPage'
import BusinessDiagnosisPage from './pages/BusinessDiagnosisPage'
import BusinessDiagnosisResultsPage from './pages/BusinessDiagnosisResultsPage'
import BusinessServicesPage from './pages/BusinessServicesPage'
import AxIndustryDetailPage from './pages/AxIndustryDetailPage'
import BusinessServiceDetailPage from './pages/BusinessServiceDetailPage'
import BusinessCatalogPage from './pages/BusinessCatalogPage'
import FundingConsultingDetailPage from './pages/business-details/FundingConsultingDetailPage'
import GatewayPage from './pages/GatewayPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'
import OnboardingPage from './pages/auth/OnboardingPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import MyPage from './pages/MyPage'
import SavedItemsPage from './pages/SavedItemsPage'
import AuthGuard from './components/auth/AuthGuard'
import GuestOnly from './components/auth/GuestOnly'
import ScrollToTop from './components/ScrollToTop'
import CanonicalLink from './components/CanonicalLink'
import TermsPage from './pages/legal/TermsPage'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import RefundPolicyPage from './pages/legal/RefundPolicyPage'
import BusinessInfoPage from './pages/legal/BusinessInfoPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <CanonicalLink />
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
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/business-leads" element={<AdminBusinessLeadsPage />} />
          <Route path="/admin/members" element={<AdminMembersPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/checkout/:productSlug" element={<CheckoutPage />} />
          <Route path="/payment/complete" element={<PaymentCompletePage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/business-services" element={<BusinessServicesPage />} />
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
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
