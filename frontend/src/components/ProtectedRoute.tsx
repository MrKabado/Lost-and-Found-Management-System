import { Navigate, Outlet, useLocation } from "react-router"
import { getStoredUser, isAuthenticated } from "@/lib/auth"

export default function ProtectedRoute({
  redirectTo = "/login",
}: {
  redirectTo?: string
}) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  if (getStoredUser()?.role === "admin") {
    return <Navigate to="/admin" replace />
  }

  return <Outlet />
}
