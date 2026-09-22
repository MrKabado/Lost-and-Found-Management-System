import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/auth/useAuth"
import { getApiError } from "@/lib/client"
import { toast } from "sonner"
import AuthBrandClient from "./AuthBrandClient"
import AuthLayoutClient from "./AuthLayoutClient"

export default function LoginClient() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const currentUser = await login(email, password)

      if (rememberMe) {
        localStorage.setItem("auth_remember_me", "true")
      } else {
        localStorage.removeItem("auth_remember_me")
      }

      toast.success("Welcome back!")
      navigate(currentUser.role === "admin" ? "/admin" : "/client")
    } catch (requestError) {
      const message = getApiError(
        requestError,
        "Unable to sign in. Please check your credentials."
      )
      toast.error(message)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayoutClient>
      <div>
        <AuthBrandClient />

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#031079]">
          Welcome back
        </h2>

        <p className="mb-[26px] text-[13.5px] text-[#5B6280]">
          Sign in to report an item or follow a claim at Cordova Public College.
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
              className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]"
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
              className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] pr-10 text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#777F9C] transition hover:bg-[#F7F9FC] hover:text-[#031079]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between text-[12.5px] text-[#5B6280]">
            <label className="flex items-center gap-[7px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-[#F5C518]"
              />
              Keep me signed in
            </label>

            <a href="/forgot-password" className="font-semibold text-[#D4A80D]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#031079] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#041690] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-[22px] text-center text-[13px] text-[#5B6280]">
          New here? <Link to="/register" className="font-bold text-[#D4A80D]">Create an account</Link>
        </div>
      </div>
    </AuthLayoutClient>
  )
}
