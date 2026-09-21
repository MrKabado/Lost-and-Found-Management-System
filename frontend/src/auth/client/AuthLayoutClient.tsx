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
  const coverImageUrl = `${(import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "")}/images/cpc-cover.jpg`;

  return (
    <div className="flex min-h-screen bg-[#092354]">
      <div className="relative hidden flex-1 flex-col justify-center overflow-hidden bg-[#092354] px-8 py-12 text-white lg:flex">
        <img
          src={coverImageUrl}
          alt="CPC campus and community collage"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,35,84,.96)_0%,rgba(9,35,84,.8)_48%,rgba(9,35,84,.38)_100%)]" />

        <div className="relative max-w-[430px]">
          <div className="mb-10 flex items-center gap-3">
            <img src="/school/logo.png" alt="Cordova Public College" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <div className="font-sans text-[22px] font-semibold">
                CPC Item Desk
              </div>
              <div className="text-[11px] tracking-[0.12em] text-[#D5D0C8] uppercase">
                Cordova Public College
              </div>
            </div>
          </div>

          {tagline && (
            <div className="font-sans text-4xl leading-tight tracking-tight">
              {tagline}
            </div>
          )}

          {ticketContent && (
            <div className="mt-10 rounded-2xl border border-[#29467D] bg-[#123064] p-5 text-sm text-[#E4ECF8] shadow-lg shadow-black/10">
              {ticketContent}
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F9FC] px-6 py-10 sm:px-10">
        <div className="w-full max-w-[380px]">{children}</div>
      </div>
    </div>
  );
}
