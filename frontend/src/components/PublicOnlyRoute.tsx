import { Navigate, Outlet } from "react-router"
import { getStoredUser, isAuthenticated } from "@/lib/auth"

export default function PublicOnlyRoute({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string
}) {
  if (isAuthenticated()) {
    return <Navigate to={getStoredUser()?.role === "admin" ? "/admin" : redirectTo} replace />
  }

  return <Outlet />
}
