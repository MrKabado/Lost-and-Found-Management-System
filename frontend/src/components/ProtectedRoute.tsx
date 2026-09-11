import { Navigate, Outlet, useLocation } from "react-router"
import { isAuthenticated } from "@/lib/auth"

export default function ProtectedRoute({
  redirectTo = "/login",
}: {
  redirectTo?: string
}) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />
  }

  return <Outlet />
}
