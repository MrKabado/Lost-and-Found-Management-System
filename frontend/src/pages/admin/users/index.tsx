import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { getAdminUsers, getApiError, formatDate, type AdminUser } from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAdminUsers().then(setUsers).catch((requestError) => setError(getApiError(requestError, "Unable to load users."))).finally(() => setLoading(false))
  }, [])

  const visibleUsers = users.filter((user) => `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(search.toLowerCase()))

  return <AdminPage title="Users" description="Review registered accounts and administrator access."><div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E2DDD0] bg-white p-4"><Search size={16} className="text-[#83796A]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or role" className="w-full text-sm outline-none" /></div>{loading ? <AdminState>Loading users...</AdminState> : error ? <AdminState error>{error}</AdminState> : visibleUsers.length === 0 ? <AdminState>No users found.</AdminState> : <div className="overflow-x-auto rounded-xl border border-[#E2DDD0] bg-white"><table className="w-full min-w-[650px] border-collapse text-sm"><thead><tr className="border-b border-[#E2DDD0] text-left text-[11px] uppercase tracking-wide text-[#83796A]"><th className="px-5 py-3">User</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Joined</th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id} className="border-b border-[#E2DDD0] last:border-0"><td className="px-5 py-4 font-semibold text-[#1B2430]">{user.name}</td><td className="px-5 py-4 text-[#5F5A50]">{user.email}</td><td className="px-5 py-4"><AdminBadge value={user.role} /></td><td className="px-5 py-4 text-[#83796A]">{formatDate(user.created_at)}</td></tr>)}</tbody></table></div>}</AdminPage>
}