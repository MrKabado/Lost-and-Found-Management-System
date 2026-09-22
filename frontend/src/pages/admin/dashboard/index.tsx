import { useEffect, useState } from "react"
import { Check, Pencil, Plus, RefreshCw, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import Pagination from "@/components/common/Pagination"
import {
  approveClaim,
  formatDate,
  getAdminClaims,
  getAdminStatistics,
  getApiError,
  getCategories,
  rejectClaim,
  getStorageUrl,
  updateFoundStatus,
  type Category,
  type Claim,
  type AdminStatistics,
} from "@/lib/client"

const emptyStatistics: AdminStatistics = {
  total_users: 0,
  total_lost_items: 0,
  total_found_items: 0,
  pending_claims: 0,
  returned_items: 0,
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(emptyStatistics)
  const [claims, setClaims] = useState<Claim[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionId, setActionId] = useState<number | null>(null)
  const [claimsPage, setClaimsPage] = useState(1)
  const claimsPerPage = 10

  const loadDashboard = async () => {
    try {
      setError("")
      setLoading(true)
      const [nextStatistics, nextClaims, nextCategories] = await Promise.all([
        getAdminStatistics(),
        getAdminClaims(),
        getCategories(),
      ])
      setStatistics(nextStatistics)
      setClaims(nextClaims)
      setCategories(nextCategories)
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load the admin dashboard."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadDashboard)
  }, [])

  const updateClaim = async (id: number, action: "approve" | "reject") => {
    try {
      setActionId(id)
      if (action === "approve") await approveClaim(id)
      else await rejectClaim(id)
      toast.success(
        action === "approve" ? "Claim approved." : "Claim rejected."
      )
      await loadDashboard()
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to update this claim.")
      toast.error(message)
      setError(message)
    } finally {
      setActionId(null)
    }
  }

  const markClaimItemReturned = async (claim: Claim) => {
    const foundItem = claim.found_item ?? claim.foundItem
    if (!foundItem) return

    try {
      setActionId(claim.id)
      await updateFoundStatus(foundItem.id, "returned")
      toast.success("Item marked as returned.")
      await loadDashboard()
    } catch (requestError) {
      const message = getApiError(
        requestError,
        "Unable to mark this item as returned."
      )
      toast.error(message)
      setError(message)
    } finally {
      setActionId(null)
    }
  }

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Delete this category?")) return
    try {
      await api.delete(`/categories/${id}`)
      setCategories((current) =>
        current.filter((category) => category.id !== id)
      )
      toast.success("Category deleted.")
    } catch (requestError) {
      const message = getApiError(
        requestError,
        "Unable to delete this category."
      )
      toast.error(message)
      setError(message)
    }
  }

  const stats = [
    {
      label: "Total users",
      value: statistics.total_users,
      delta: "Registered accounts",
    },
    {
      label: "Lost items logged",
      value: statistics.total_lost_items,
      delta: `${statistics.total_lost_items - statistics.returned_items} active reports`,
    },
    {
      label: "Found items logged",
      value: statistics.total_found_items,
      delta: "Items submitted",
    },
    {
      label: "Items returned",
      value: statistics.returned_items,
      delta: `${statistics.pending_claims} claims pending`,
      down: statistics.pending_claims > 0,
    },
  ]
  const pendingClaims = claims.filter((claim) => {
    const item = claim.found_item ?? claim.foundItem
    return claim.status === "pending" || item?.status === "awaiting_pickup"
  })
  const claimsPageCount = Math.max(1, Math.ceil(pendingClaims.length / claimsPerPage))
  const paginatedClaims = pendingClaims.slice(
    (claimsPage - 1) * claimsPerPage,
    claimsPage * claimsPerPage,
  )
  const hasActions = pendingClaims.some((claim) => {
    const item = claim.found_item ?? claim.foundItem
    return claim.status === "pending" || item?.status === "awaiting_pickup"
  })

  useEffect(() => {
    setClaimsPage((currentPage) => Math.min(currentPage, claimsPageCount))
  }, [claimsPageCount])

  return (
    <main className="min-w-0 flex-1 bg-[#F5F6FC]">
      <div className="px-7 pt-[26px] pb-[60px]">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-[26px] grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-[#D8DCEF] bg-white px-[18px] pt-[18px] pb-4"
            >
              <div className="absolute top-0 right-0 h-[34px] w-[34px] rounded-bl-xl bg-[#F5F6FC]" />
              <div className="text-xs tracking-wide text-[#5B6280]">
                {stat.label}
              </div>
              <div className="mt-1.5 font-sans text-[30px] text-[#031079]">
                {loading ? "-" : stat.value}
              </div>
              <div
                className={`mt-2 text-[11.5px] ${stat.down ? "text-[#B6503A]" : "text-[#031079]"}`}
              >
                {stat.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="font-sans text-lg font-semibold text-[#031079]">
            Pending claims
          </h2>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            title="Refresh dashboard data"
            className="inline-flex items-center gap-2 rounded-lg border border-[#C7D2FE] bg-white px-3 py-2 text-xs font-semibold text-[#1D4ED8] shadow-sm transition hover:border-[#1D4ED8] hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </div>
        <div className="mb-[30px] overflow-x-auto rounded-xl border border-[#D8DCEF] bg-white">
          <table className={`w-full ${hasActions ? "min-w-[760px]" : "min-w-[650px]"} border-collapse text-[13.5px]`}>
            <thead>
              <tr className="border-b border-[#D8DCEF]">
                {[
                  "Claimant",
                  "Item",
                  "Category",
                  "Submitted",
                  "Status",
                  ...(hasActions ? ["Action"] : []),
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-[18px] py-3 text-left text-[11px] font-semibold tracking-wide text-[#5B6280]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan={hasActions ? 6 : 5}
                    className="px-5 py-10 text-center text-sm text-[#5B6280]"
                  >
                    No claims found.
                  </td>
                </tr>
              ) : (
                paginatedClaims.map((claim) => {
                  const name = claim.user?.name ?? "Unknown claimant"
                  const initials = name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                  const foundItem = claim.found_item ?? claim.foundItem
                  const itemStatus = foundItem?.status.toLowerCase()
                  const status =
                    claim.status === "approved" && itemStatus
                      ? itemStatus.toUpperCase()
                      : claim.status.toUpperCase()
                  return (
                    <tr
                      key={claim.id}
                      className="border-b border-[#D8DCEF] last:border-b-0 hover:bg-[#F8F9FF]"
                    >
                      <td className="px-[18px] py-[13px]">
                        <div className="flex items-center gap-[9px]">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D8DCEF] bg-[#F5F6FC] font-sans text-[11px] text-[#041690]">
                            {claim.user?.student_profile?.profile_image ? (
                              <img
                                src={getStorageUrl(claim.user.student_profile.profile_image) ?? undefined}
                                alt={`${name}'s profile`}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : initials}
                          </div>
                          {name}
                        </div>
                      </td>
                      <td className="px-[18px] py-[13px]">
                        {(claim.found_item ?? claim.foundItem)?.title ?? "Found item"}
                      </td>
                      <td className="px-[18px] py-[13px]">
                        {(claim.found_item ?? claim.foundItem)?.category?.name ?? "Uncategorized"}
                      </td>
                      <td className="px-[18px] py-[13px]">
                        {formatDate(claim.created_at)}
                      </td>
                      <td className="px-[18px] py-[13px]">
                        <StatusBadge status={status} />
                      </td>
                      {hasActions && (status === "PENDING" || itemStatus === "awaiting_pickup") && <td className="px-[18px] py-[13px]">
                        <div className="flex justify-end gap-2">
                          {status === "PENDING" ? (
                            <>
                              <button
                                type="button"
                                disabled={actionId === claim.id}
                                onClick={() =>
                                  void updateClaim(claim.id, "approve")
                                }
                                title="Approve claim"
                                className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#D8DCEF] text-[#5B6280] hover:border-[#031079] hover:text-[#031079] disabled:opacity-50"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                disabled={actionId === claim.id}
                                onClick={() =>
                                  void updateClaim(claim.id, "reject")
                                }
                                title="Reject claim"
                                className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#D8DCEF] text-[#5B6280] hover:border-[#B6503A] hover:text-[#B6503A] disabled:opacity-50"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : itemStatus === "awaiting_pickup" ? (
                            <button
                              type="button"
                              disabled={actionId === claim.id}
                              title="Mark item as returned"
                              onClick={() => void markClaimItemReturned(claim)}
                              className="flex h-[30px] items-center justify-center rounded-[7px] border border-[#BBE7D0] bg-[#ECFDF3] px-2 text-[11px] font-semibold text-[#16704A] hover:border-[#16704A] disabled:opacity-50"
                            >
                              <Check size={14} className="mr-1" />
                              Mark returned
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Refresh claim status"
                              onClick={() => void loadDashboard()}
                              className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#D8DCEF] text-[#5B6280] hover:border-[#D4A80D] hover:text-[#D4A80D]"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
                      </td>}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          <Pagination
            page={claimsPage}
            pageCount={claimsPageCount}
            total={pendingClaims.length}
            onPageChange={setClaimsPage}
          />
        </div>

        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="font-sans text-lg font-semibold text-[#031079]">
            Categories
          </h2>
          <button
            type="button"
            onClick={() =>
              toast.info(
                "Category creation will be available in category management."
              )
            }
            className="flex items-center gap-2 rounded-lg bg-[#F5C518] px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#D4A80D]"
          >
            <Plus size={13} /> Add category
          </button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center gap-[9px] rounded-[9px] border border-[#D8DCEF] bg-white px-[13px] py-[9px] text-[13px]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: [
                    "#031079",
                    "#F5C518",
                    "#B6503A",
                    "#5B6280",
                    "#031079",
                    "#8B92B0",
                  ][index % 6],
                }}
              />
              {category.name}
              <button
                type="button"
                onClick={() => void deleteCategory(category.id)}
                title={`Delete ${category.name}`}
                className="ml-1 text-[#8B92B0] hover:text-[#B6503A]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
    APPROVED: "border border-[#BBE7D0] bg-[#ECFDF3] text-[#16704A]",
    VERIFIED: "border border-[#BBE7D0] bg-[#ECFDF3] text-[#16704A]",
    AVAILABLE: "border border-[#BBE7D0] bg-[#ECFDF3] text-[#16704A]",
    AWAITING_PICKUP: "border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]",
    RETURNED: "border border-[#BBE7D0] bg-[#ECFDF3] text-[#16704A]",
    REJECTED: "border border-[#F3C1C1] bg-[#FFF1F2] text-[#B42318]",
  }
  return (
    <span
      className={`rounded-full px-[9px] py-[3px] text-[10.5px] font-bold tracking-wide ${styles[status] ?? "border border-[#E5E7EB] bg-[#F9FAFB] text-[#4B5563]"}`}
    >
      {status}
    </span>
  )
}
