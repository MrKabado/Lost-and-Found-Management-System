import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { ArrowLeft, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { getApiError } from "@/lib/client"
import AuthBrandClient from "./AuthBrandClient"
import AuthLayoutClient from "./AuthLayoutClient"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" })
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError("")
  }

  const handleSendOtp = async () => {
    if (!form.email.trim()) {
      toast.error("Enter your email address first.")
      return
    }

    setIsSendingOtp(true)

    try {
      const response = await api.post<{ message: string }>("/forgot-password/send-otp", { email: form.email })
      toast.success(response.data.message)
    } catch (err) {
      toast.error(getApiError(err, "Unable to send the verification code."))
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsResetting(true)

    try {
      await api.post("/forgot-password/reset", {
        email: form.email,
        otp: form.otp,
        password: form.password,
        password_confirmation: form.confirmPassword,
      })
      toast.success("Password reset successfully. You can sign in now.")
      navigate("/login")
    } catch (err) {
      const message = getApiError(err, "Unable to reset your password right now.")
      setError(message)
      toast.error(message)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <AuthLayoutClient
      tagline={<>A secure return starts with the right account.</>}
      ticketContent={
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#F5C518]" size={20} />
          <p>Use the one-time code sent to your CPC email address to create a new password.</p>
        </div>
      }
    >
      <div>
        <AuthBrandClient />

        <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#D4A80D]">
          <ArrowLeft size={15} /> Back to sign in
        </Link>

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#031079]">Reset your password</h2>
        <p className="mb-[26px] text-[13.5px] text-[#5B6280]">Verify your email, then choose a new password for your CPC account.</p>

        {error ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">Email address</label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93AE]" size={16} />
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="juan.delacruz@email.com" required className="w-full rounded-lg border border-[#D8DCEF] bg-white py-[11px] pl-9 pr-[13px] text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15" />
              </div>
              <button type="button" onClick={handleSendOtp} disabled={isSendingOtp} className="rounded-lg bg-[#D4A80D] px-3 text-[12px] font-bold text-[#031079] transition hover:bg-[#F5C518] disabled:cursor-not-allowed disabled:opacity-60">{isSendingOtp ? "Sending..." : "Send OTP"}</button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="otp" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">Verification code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93AE]" size={16} />
              <input id="otp" name="otp" type="text" inputMode="numeric" maxLength={6} value={form.otp} onChange={handleChange} placeholder="Enter the 6-digit code" required className="w-full rounded-lg border border-[#D8DCEF] bg-white py-[11px] pl-9 pr-[13px] text-[13.5px] tracking-[0.2em] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15" />
            </div>
            <p className="mt-1.5 text-[11.5px] text-[#777F9C]">The code expires in 5 minutes.</p>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">New password</label>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="At least 8 characters" minLength={8} required className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] pr-10 text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15" />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#777F9C] transition hover:bg-[#F7F9FC] hover:text-[#031079]">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[12.5px] font-semibold text-[#041690]">Confirm password</label>
              <div className="relative">
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required className="w-full rounded-lg border border-[#D8DCEF] bg-white px-[13px] py-[11px] pr-10 text-[13.5px] text-[#031079] outline-none focus:border-[#F5C518] focus:ring-4 focus:ring-[#F5C518]/15" />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} title={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#777F9C] transition hover:bg-[#F7F9FC] hover:text-[#031079]">
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isResetting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#031079] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#041690] disabled:cursor-not-allowed disabled:opacity-70">{isResetting ? "Resetting password..." : "Reset password"}</button>
        </form>
      </div>
    </AuthLayoutClient>
  )
}
