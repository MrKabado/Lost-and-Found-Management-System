import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  tagline?: ReactNode;
  ticketContent?: ReactNode;
}

export default function AuthLayoutClient({
  children,
  tagline,
  ticketContent,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#1B2430]">
      <div className="hidden flex-1 flex-col justify-center bg-[#1B2430] px-8 py-12 text-[#F6F3EC] lg:flex">
        <div className="max-w-[430px]">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E3963E] text-lg font-bold text-[#1B2430]">
              L
            </div>
            <div>
              <div className="font-sans text-[22px] font-semibold">
                Lost&Found
              </div>
              <div className="text-[11px] tracking-[0.12em] text-[#D5D0C8] uppercase">
                Recovery system
              </div>
            </div>
          </div>

          {tagline && (
            <div className="font-sans text-4xl leading-tight tracking-tight">
              {tagline}
            </div>
          )}

          {ticketContent && (
            <div className="mt-10 rounded-2xl border border-[#313C49] bg-[#1E2A35] p-5 text-sm text-[#EDEAE1] shadow-lg shadow-black/10">
              {ticketContent}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F6F3EC] px-6 py-10 sm:px-10">
        <div className="w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
}
