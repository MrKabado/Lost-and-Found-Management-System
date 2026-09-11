import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/auth/useAuth"
import AuthLayout from "./AuthLayoutAdmin"

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)

      const currentUser = JSON.parse(localStorage.getItem("auth_user") || "null")

      if (!currentUser || currentUser.role !== "admin") {
        throw new Error("This account does not have admin privileges.")
      }

      if (rememberMe) {
        localStorage.setItem("auth_remember_me", "true")
      } else {
        localStorage.removeItem("auth_remember_me")
      }

      navigate("/admin")
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className="flex items-center gap-2.5 pb-[26px]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C97A28" strokeWidth="1.6">
            <path d="M12 2 L21 11 L11 21 L2 12 Z" />
            <circle cx="7.5" cy="7.5" r="1.6" />
          </svg>

          <div className="font-sans text-[17px] leading-[1.1] text-[#1B2430]">
            Lost&Found
            <span className="mt-0.5 block font-sans text-[10.5px] tracking-[0.06em] text-[#83796A]">
              Admin Console
            </span>
          </div>
        </div>

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#1B2430]">
          Administrator sign in
        </h2>

        <p className="mb-[26px] text-[13.5px] text-[#83796A]">
          Restricted access. Manage categories, claims and item records.
        </p>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="admin-email" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
              Admin email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lostfound.edu"
              required
              className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="admin-password" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
            />
          </div>

          <div className="mb-5 flex items-center justify-between text-[12.5px] text-[#83796A]">
            <label className="flex items-center gap-[7px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#E3963E]"
              />
              Keep me signed in
            </label>

            <Link to="/login" className="font-semibold text-[#C97A28]">
              User login
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#E3963E] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#C97A28] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in to console"}
          </button>
        </form>

        <div className="mt-[26px] text-center text-[13px] leading-[1.5] text-[#83796A]">
          Access is granted by the system owner —
          <br />
          no self-registration for admin accounts.
        </div>
      </div>
    </AuthLayout>
  )
}