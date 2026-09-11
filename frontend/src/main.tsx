import { createRoot } from "react-dom/client"
import "./styles/index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"

import AdminLayout from "@/pages/admin/AdminLayout.tsx"
import AdminDashboard from "@/pages/admin/dashboard/index.tsx"

import ClientLayout from "@/pages/client/ClientLayout.tsx"
import ClientDashboard from "@/pages/client/dashboard/index.tsx"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="dashboard" element={<ClientDashboard />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
)
