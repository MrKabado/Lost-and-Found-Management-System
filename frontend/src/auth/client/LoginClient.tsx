import { useState } from "react";
import AuthBrandClient from "./AuthBrandClient";
import AuthLayoutClient from "./AuthLayoutClient";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
      rememberMe,
    });
  };

  return (
    <AuthLayoutClient>
      <div>
        <AuthBrandClient />

        <h2 className="mb-1.5 font-[Georgia,serif] text-2xl font-semibold tracking-[0.01em] text-[#1B2430]">
          Welcome back
        </h2>

        <p className="mb-[26px] text-[13.5px] text-[#83796A]">
          Sign in to report an item or track your claims.
        </p>

        <form onSubmit={handleSubmit}>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@email.com"
              className="
                w-full rounded-lg border border-[#E2DDD0]
                bg-white px-[13px] py-[11px]
                text-[13.5px] text-[#1B2430]
                outline-none
                focus:border-[#E3963E]
                focus:ring-4 focus:ring-[#E3963E]/15
              "
            />
          </div>

          {/* Password */}
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
              className="
                w-full rounded-lg border border-[#E2DDD0]
                bg-white px-[13px] py-[11px]
                text-[13.5px] text-[#1B2430]
                outline-none
                focus:border-[#E3963E]
                focus:ring-4 focus:ring-[#E3963E]/15
              "
            />
          </div>

          {/* Remember me / Forgot password */}
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

            <a
              href="/forgot-password"
              className="font-semibold text-[#C97A28]"
            >
              Forgot password?
            </a>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="
              w-full rounded-lg bg-[#1B2430]
              px-[18px] py-2.5
              text-[13.5px] font-semibold text-white
              transition hover:bg-[#26313F]
            "
          >
            Sign in
          </button>
        </form>

        {/* Register */}
        <div className="mt-[22px] text-center text-[13px] text-[#83796A]">
          New here?{" "}
          <a
            href="/register"
            className="font-bold text-[#C97A28]"
          >
            Create an account
          </a>
        </div>
      </div>
    </AuthLayoutClient>
  );
}
