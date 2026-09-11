import { Navigate, Outlet } from "react-router"
import { getStoredUser, isAuthenticated } from "@/lib/auth"

export default function AdminOnlyRoute({ redirectTo = "/login" }: { redirectTo?: string }) {
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />
  }

  const user = getStoredUser()

  if (!user || user.role !== "admin") {
    return <Navigate to="/client" replace />
  }

  return <Outlet />
}
