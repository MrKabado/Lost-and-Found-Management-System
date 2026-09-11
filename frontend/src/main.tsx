import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Toaster } from "sonner"

import { AuthProvider } from "@/auth/AuthContext"
import LoginClient from "@/auth/client/LoginClient.tsx"
import RegisterClient from "@/auth/client/RegisterClient.tsx"
import AdminLogin from "@/auth/admin/LoginAdmin.tsx"
import ProtectedRoute from "@/components/ProtectedRoute"
import PublicOnlyRoute from "@/components/PublicOnlyRoute"
import AdminOnlyRoute from "@/components/AdminOnlyRoute"

import AdminLayout from "@/pages/admin/AdminLayout.tsx"
import AdminDashboard from "@/pages/admin/dashboard"

import ClientLayout from "@/pages/client/ClientLayout.tsx"
import ClientDashboard from "@/pages/client/dashboard"
import MyLostReports from "@/pages/client/my-lost-report/index.tsx"
import MyFoundReports from "@/pages/client/my-found-reports/index.tsx"
import MyClaims from "@/pages/client/my-claims/index.tsx"
import BrowseItems from "@/pages/client/browse-items/index.tsx"
import ClientProfile from "@/pages/client/profile/index.tsx"
import ReportItem from "@/pages/client/ReportItem.tsx"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          <Route element={<PublicOnlyRoute redirectTo="/dashboard" />}>
            <Route path="/login" element={<LoginClient />} />
            <Route path="/register" element={<RegisterClient />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/dashboard" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
            </Route>

            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<ClientDashboard />} />
              <Route path="lost-reports" element={<MyLostReports />} />
              <Route path="found-reports" element={<MyFoundReports />} />
              <Route path="claims" element={<MyClaims />} />
              <Route path="items" element={<BrowseItems />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="report-lost" element={<ReportItem type="lost" />} />
              <Route path="report-found" element={<ReportItem type="found" />} />
            </Route>

            <Route path="/" element={<Navigate to="/client" replace />} />
          </Route>

          <Route element={<AdminOnlyRoute redirectTo="/admin/login" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/client" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
)
