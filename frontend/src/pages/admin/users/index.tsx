import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import {
  getAdminUsers,
  getApiError,
  formatDate,
  getStorageUrl,
  type AdminUser,
} from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load users."))
      )
      .finally(() => setLoading(false))
  }, [])

  const visibleUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <AdminPage
      title="Users"
      description="Review registered accounts and administrator access."
    >
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#D8DCEF] bg-white p-4">
        <Search size={16} className="text-[#5B6280]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, or role"
          className="w-full text-sm outline-none"
        />
      </div>
      {loading ? (
        <AdminState>Loading users...</AdminState>
      ) : error ? (
        <AdminState error>{error}</AdminState>
      ) : visibleUsers.length === 0 ? (
        <AdminState>No users found.</AdminState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#D8DCEF] bg-white">
          <table className="w-full min-w-[650px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D8DCEF] text-left text-[11px] tracking-wide text-[#5B6280] uppercase">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#D8DCEF] last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 overflow-hidden rounded-full bg-[#031079] text-xs font-semibold text-white">
                        {user.student_profile?.profile_image ? (
                          <img
                            src={getStorageUrl(user.student_profile.profile_image) ?? undefined}
                            alt={`${user.name}'s profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            {user.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-[#031079]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#4A5170]">{user.email}</td>
                  <td className="px-5 py-4">
                    <AdminBadge value={user.role} />
                  </td>
                  <td className="px-5 py-4 text-[#5B6280]">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  )
}
