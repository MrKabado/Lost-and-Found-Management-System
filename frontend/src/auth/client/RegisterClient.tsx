import { useState } from "react";
import AuthBrandClient from "./AuthBrandClient";
import AuthLayoutClient from "./AuthLayoutClient";

export default function RegisterClient() {
  const [form, setForm] = useState({
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(form);
  };

  return (
    <AuthLayoutClient
      tagline={
        <>
          Report it once.
          <br />
          We&apos;ll help it find
          <br />
          its way{" "}
          <em className="not-italic text-[#E3963E]">back</em>.
        </>
      }
      ticketContent={
        <div>
          <div className="flex justify-between border-b border-[#313C49] py-[5px] text-xs text-[#A8A296]">
            <span>This week</span>
            <b className="font-semibold text-[#EDEAE1]">
              34 items reported
            </b>
          </div>

          <div className="flex justify-between border-b border-[#313C49] py-[5px] text-xs text-[#A8A296]">
            <span>Matched to owners</span>
            <b className="font-semibold text-[#EDEAE1]">
              21 returned
            </b>
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

        <h2 className="mb-1.5 font-[Georgia,serif] text-2xl font-semibold tracking-[0.01em] text-[#1B2430]">
          Create your account
        </h2>

        <div className="mb-[26px] text-[13.5px] text-[#83796A]">
          Report lost or found items and follow every claim in one place.
        </div>

        <form onSubmit={handleSubmit}>
          {/* First / Last name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
              >
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className="
                  w-full rounded-lg border border-[#E2DDD0] bg-white
                  px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                  outline-none
                  focus:border-[#E3963E]
                  focus:ring-4 focus:ring-[#E3963E]/15
                "
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
              >
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Dela Cruz"
                className="
                  w-full rounded-lg border border-[#E2DDD0] bg-white
                  px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                  outline-none
                  focus:border-[#E3963E]
                  focus:ring-4 focus:ring-[#E3963E]/15
                "
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="juan.delacruz@email.com"
              className="
                w-full rounded-lg border border-[#E2DDD0] bg-white
                px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                outline-none
                focus:border-[#E3963E]
                focus:ring-4 focus:ring-[#E3963E]/15
              "
            />
          </div>

          {/* Contact */}
          <div className="mb-4">
            <label
              htmlFor="contact"
              className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
            >
              Contact number
            </label>

            <input
              id="contact"
              name="contact"
              type="text"
              value={form.contact}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              className="
                w-full rounded-lg border border-[#E2DDD0] bg-white
                px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                outline-none
                focus:border-[#E3963E]
                focus:ring-4 focus:ring-[#E3963E]/15
              "
            />
          </div>

          {/* Password / Confirm password */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full rounded-lg border border-[#E2DDD0] bg-white
                  px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                  outline-none
                  focus:border-[#E3963E]
                  focus:ring-4 focus:ring-[#E3963E]/15
                "
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-[12.5px] font-semibold text-[#26313F]"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full rounded-lg border border-[#E2DDD0] bg-white
                  px-[13px] py-[11px] text-[13.5px] text-[#1B2430]
                  outline-none
                  focus:border-[#E3963E]
                  focus:ring-4 focus:ring-[#E3963E]/15
                "
              />
            </div>
          </div>

          {/* Agreement */}
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
              I agree to the item verification process and understand false
              claims may be rejected.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              inline-flex w-full items-center justify-center gap-2
              rounded-lg bg-[#1B2430] px-[18px] py-2.5
              text-[13.5px] font-semibold text-white
              transition hover:bg-[#26313F]
            "
          >
            Create account
          </button>
        </form>

        {/* Login */}
        <div className="mt-[22px] text-center text-[13px] text-[#83796A]">
          Already registered?{" "}
          <a
            href="/login"
            className="font-bold text-[#C97A28]"
          >
            Sign in
          </a>
        </div>
      </div>
    </AuthLayoutClient>
  );
}