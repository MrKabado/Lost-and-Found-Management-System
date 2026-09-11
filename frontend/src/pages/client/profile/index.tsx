import { UserRound } from "lucide-react"
import { useAuth } from "@/auth/useAuth"
import ClientPage from "@/pages/client/ClientPage"

export default function ClientProfile() {
  const { user } = useAuth()
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "U"

  return <ClientPage title="Profile" description="Your account details and portal access."><div className="max-w-2xl rounded-xl border border-[#E2DDD0] bg-white p-6"><div className="flex items-center gap-4 border-b border-[#E2DDD0] pb-6"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3F6C63] text-lg font-semibold text-white">{initials}</div><div><h3 className="text-lg font-semibold text-[#1B2430]">{user?.name ?? "Loading profile"}</h3><p className="text-sm text-[#83796A]">Client account</p></div></div><div className="grid gap-5 pt-6 sm:grid-cols-2"><div><div className="text-xs font-semibold uppercase tracking-wide text-[#83796A]">Full name</div><div className="mt-1 flex items-center gap-2 text-sm text-[#1B2430]"><UserRound size={15} />{user?.name ?? "Not available"}</div></div><div><div className="text-xs font-semibold uppercase tracking-wide text-[#83796A]">Email address</div><div className="mt-1 text-sm text-[#1B2430]">{user?.email ?? "Not available"}</div></div></div></div></ClientPage>
}