import { Navigate, Outlet } from "react-router"
import { isAuthenticated } from "@/lib/auth"

export default function PublicOnlyRoute({
  redirectTo = "/dashboard",
}: {
  redirectTo?: string
}) {
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
