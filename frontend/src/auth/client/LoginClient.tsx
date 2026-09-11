import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/auth/useAuth"
import AuthBrandClient from "./AuthBrandClient"
import AuthLayoutClient from "./AuthLayoutClient"

export default function LoginClient() {
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

      if (rememberMe) {
        localStorage.setItem("auth_remember_me", "true")
      } else {
        localStorage.removeItem("auth_remember_me")
      }

      navigate("/dashboard")
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
    <AuthLayoutClient>
      <div>
        <AuthBrandClient />

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#1B2430]">
          Welcome back
        </h2>

        <p className="mb-[26px] text-[13.5px] text-[#83796A]">
          Sign in to report an item or track your claims.
        </p>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@email.com"
              required
              className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
            >
              Password
            </label>

            <input
              id="password"
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

            <a href="/forgot-password" className="font-semibold text-[#C97A28]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#1B2430] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#26313F] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-[22px] text-center text-[13px] text-[#83796A]">
          New here? <Link to="/register" className="font-bold text-[#C97A28]">Create an account</Link>
        </div>
      </div>
    </AuthLayoutClient>
  )
}
