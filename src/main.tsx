import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './lib/auth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MyToolsPage from './pages/MyToolsPage'
import AdminPage from './pages/AdminPage'
import BusinessServicesPage from './pages/BusinessServicesPage'
import GatewayPage from './pages/GatewayPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GatewayPage />} />
          <Route path="/consultants" element={<App />} />
          <Route path="/for-consultants" element={<Navigate to="/consultants" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-tools" element={<MyToolsPage />} />
          <Route path="/dashboard" element={<Navigate to="/my-tools" replace />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/business-services" element={<BusinessServicesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
