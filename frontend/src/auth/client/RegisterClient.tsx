import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/auth/useAuth"
import { api } from "@/lib/api"
import { getApiError } from "@/lib/client"
import { toast } from "sonner"
import AuthBrandClient from "./AuthBrandClient"
import AuthLayoutClient from "./AuthLayoutClient"

export default function RegisterClient() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    agree: false,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.otp.trim()) {
      toast.error("Please complete all required fields.")
      return
    }

    if (!form.password || !form.confirmPassword) {
      toast.error("Please enter and confirm your password.")
      return
    }

    if (!form.agree) {
      toast.error("Please agree to the verification process before continuing.")
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    setIsSubmitting(true)

    try {
      await api.post("/verify-otp", { email: form.email, otp: form.otp })
      const currentUser = await register(
        `${form.firstName} ${form.lastName}`.trim(),
        form.email,
        form.password,
        form.confirmPassword,
      )
      toast.success("Account created successfully.")
      navigate(currentUser.role === "admin" ? "/admin" : "/client")
    } catch (err) {
      const message = getApiError(err, "Unable to create your account right now. Please try again.")
      toast.error(message)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendOtp = async () => {
    if (!form.email.trim()) {
      toast.error("Enter your email address first.")
      return
    }

    setIsSendingOtp(true)

    try {
      const response = await api.post<{ message: string }>("/register/send-otp", { email: form.email })
      toast.success(response.data.message)
    } catch (err) {
      toast.error(getApiError(err, "Unable to send the verification code."))
    } finally {
      setIsSendingOtp(false)
    }
  }

  return (
    <AuthLayoutClient>
      <div>
        <AuthBrandClient />

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#031079]">
          Create your account
        </h2>

        <div className="mb-[26px] text-[13.5px] text-[#5B6280]">
          Create your CPC account to report, search, and safely return items.
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="firstName" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                required
                className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Dela Cruz"
                required
                className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
              Email address
            </label>

            <div className="flex gap-2">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="juan.delacruz@email.com"
                required
                className="min-w-0 flex-1 rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="rounded-lg bg-[#D4A80D] px-3 text-[12px] font-bold text-[#031079] transition hover:bg-[#F5C518] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSendingOtp ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="otp" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
              Verification code
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter the 6-digit code"
              required
              className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] tracking-[0.2em] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
            />
            <p className="mt-1.5 text-[11.5px] text-[#777F9C]">The code expires in 5 minutes.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15"
              />
            </div>
          </div>

          <div className="mb-5 flex items-start gap-2.5 text-[12.5px] text-[#5B6280]">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 accent-[#F5C518]"
            />

            <label htmlFor="agree">
              I agree to the item verification process and understand false claims may be rejected.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#031079] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#041690] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying and creating..." : "Verify and create account"}
          </button>
        </form>

        <div className="mt-[22px] text-center text-[13px] text-[#5B6280]">
          Already registered? <Link to="/login" className="font-bold text-[#D4A80D]">Sign in</Link>
        </div>
      </div>
    </AuthLayoutClient>
  )
}