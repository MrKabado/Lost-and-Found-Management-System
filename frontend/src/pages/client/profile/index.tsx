import { UserRound } from "lucide-react"
import { useAuth } from "@/auth/useAuth"
import ClientPage from "@/pages/client/ClientPage"

export default function ClientProfile() {
  const { user } = useAuth()
  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U"

  return (
    <ClientPage
      title="Profile"
      description="Your account details and portal access."
    >
      <div className="max-w-2xl rounded-xl border border-[#D8DCEF] bg-white p-6">
        <div className="flex items-center gap-4 border-b border-[#D8DCEF] pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#031079] text-lg font-semibold text-white">
            {initials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#031079]">
              {user?.name ?? "Loading profile"}
            </h3>
            <p className="text-sm text-[#5B6280]">Client account</p>
          </div>
        </div>
        <div className="grid gap-5 pt-6 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#5B6280] uppercase">
              Full name
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-[#031079]">
              <UserRound size={15} />
              {user?.name ?? "Not available"}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide text-[#5B6280] uppercase">
              Email address
            </div>
            <div className="mt-1 text-sm text-[#031079]">
              {user?.email ?? "Not available"}
            </div>
          </div>
        </div>
      </div>
    </ClientPage>
  )
}
