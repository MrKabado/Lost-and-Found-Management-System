import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import Pagination from "@/components/common/Pagination"
import {
  deactivateAdminUser,
  getAdminUsers,
  getApiError,
  formatDate,
  getStorageUrl,
  reactivateAdminUser,
  type AdminUser,
} from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [verificationStatus, setVerificationStatus] = useState("")
  const [activityStatus, setActivityStatus] = useState("")
  const [accountStatus, setAccountStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    getAdminUsers({
      search: search || undefined,
      verification_status: verificationStatus as "verified" | "unverified" || undefined,
      activity_status: activityStatus as "active" | "inactive" || undefined,
      account_status: accountStatus as "active" | "deactivated" || undefined,
    })
      .then(setUsers)
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load users."))
      )
      .finally(() => setLoading(false))
  }, [accountStatus, activityStatus, search, verificationStatus])

  useEffect(() => {
    setPage(1)
  }, [accountStatus, activityStatus, search, verificationStatus, users.length])

  const updateAccountStatus = async (user: AdminUser) => {
    try {
      const updated = user.account_status === "active"
        ? await deactivateAdminUser(user.id)
        : await reactivateAdminUser(user.id)
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) => currentUser.id === updated.id ? updated : currentUser)
      )
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to update account status."))
    }
  }

  const pageCount = Math.max(1, Math.ceil(users.length / usersPerPage))
  const paginatedUsers = users.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage,
  )

  return (
    <AdminPage
      title="Users"
      description="Review registered accounts and administrator access."
    >
      <div className="mb-5 grid gap-3 rounded-xl border border-[#D8DCEF] bg-white p-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-2">
        <Search size={16} className="text-[#5B6280]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, or role"
          className="w-full bg-white text-sm text-[#031079] outline-none placeholder:text-[#8B92B0]"
        />
        </div>
        <select value={verificationStatus} onChange={(event) => setVerificationStatus(event.target.value)} className="rounded-lg border border-[#D8DCEF] px-3 py-2 text-sm text-[#031079]">
          <option value="">All verification</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <select value={activityStatus} onChange={(event) => setActivityStatus(event.target.value)} className="rounded-lg border border-[#D8DCEF] px-3 py-2 text-sm text-[#031079]">
          <option value="">All activity</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={accountStatus} onChange={(event) => setAccountStatus(event.target.value)} className="rounded-lg border border-[#D8DCEF] px-3 py-2 text-sm text-[#031079]">
          <option value="">All accounts</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>
      {loading ? (
        <AdminState>Loading users...</AdminState>
      ) : error ? (
        <AdminState error>{error}</AdminState>
      ) : users.length === 0 ? (
        <AdminState>No users found.</AdminState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#D8DCEF] bg-white">
          <table className="w-full min-w-[650px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D8DCEF] text-left text-[11px] tracking-wide text-[#5B6280] uppercase">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Verification</th>
                <th className="px-5 py-3">Activity</th>
                <th className="px-5 py-3">Account</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
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
                  <td className="px-5 py-4"><AdminBadge value={user.is_verified ? "verified" : "unverified"} /></td>
                  <td className="px-5 py-4"><AdminBadge value={user.activity_status} /></td>
                  <td className="px-5 py-4"><AdminBadge value={user.account_status} /></td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => void updateAccountStatus(user)} className="text-xs font-semibold text-[#031079] underline">
                      {user.account_status === "active" ? "Deactivate" : "Reactivate"}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-[#5B6280]">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            pageCount={pageCount}
            total={users.length}
            onPageChange={setPage}
          />
        </div>
      )}
    </AdminPage>
  )
}
