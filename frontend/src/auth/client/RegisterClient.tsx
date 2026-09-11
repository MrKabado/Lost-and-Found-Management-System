import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "@/auth/useAuth"
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
    password: "",
    confirmPassword: "",
    agree: false,
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!form.agree) {
      setError("Please agree to the verification process before continuing.")
      return
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const currentUser = await register(
        `${form.firstName} ${form.lastName}`.trim(),
        form.email,
        form.password,
        form.confirmPassword,
      )
      toast.success("Account created successfully.")
      navigate(currentUser.role === "admin" ? "/admin" : "/client")
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create your account right now. Please try again."
      toast.error(message)
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayoutClient
      tagline={
        <>
          Report it once.
          <br />
          We&apos;ll help it find
          <br />
          its way <em className="not-italic text-[#E3963E]">back</em>.
        </>
      }
      ticketContent={
        <div>
          <div className="flex justify-between border-b border-[#313C49] py-[5px] text-xs text-[#A8A296]">
            <span>This week</span>
            <b className="font-semibold text-[#EDEAE1]">34 items reported</b>
          </div>

          <div className="flex justify-between border-b border-[#313C49] py-[5px] text-xs text-[#A8A296]">
            <span>Matched to owners</span>
            <b className="font-semibold text-[#EDEAE1]">21 returned</b>
          </div>

          <div className="flex justify-between py-[5px] text-xs text-[#A8A296]">
            <span>Avg. time to match</span>
            <b className="font-semibold text-[#EDEAE1]">2.4 days</b>
          </div>
        </div>
      }
    >
      <div>
        <AuthBrandClient />

        <h2 className="mb-1.5 font-sans text-2xl font-semibold tracking-[0.01em] text-[#1B2430]">
          Create your account
        </h2>

        <div className="mb-[26px] text-[13.5px] text-[#83796A]">
          Report lost or found items and follow every claim in one place.
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="firstName" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
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
                className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
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
                className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juan.delacruz@email.com"
              required
              className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]">
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
                className="w-full rounded-lg border border-[#E2DDD0] bg-white px-[13px] py-[11px] text-[13.5px] text-[#1B2430] outline-none focus:border-[#E3963E] focus:ring-4 focus:ring-[#E3963E]/15"
              />
            </div>
          </div>

          <div className="mb-5 flex items-start gap-2.5 text-[12.5px] text-[#83796A]">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 accent-[#E3963E]"
            />

            <label htmlFor="agree">
              I agree to the item verification process and understand false claims may be rejected.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B2430] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#26313F] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="mt-[22px] text-center text-[13px] text-[#83796A]">
          Already registered? <Link to="/login" className="font-bold text-[#C97A28]">Sign in</Link>
        </div>
      </div>
    </AuthLayoutClient>
  )
}