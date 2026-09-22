import { useEffect, useState } from "react"
import { Check, ExternalLink, Search, X } from "lucide-react"
import { toast } from "sonner"
import {
  approveClaim,
  formatDate,
  getAdminClaims,
  getApiError,
  getStorageUrl,
  rejectClaim,
  type Claim,
} from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadClaims = async () => {
    try {
      setClaims(await getAdminClaims())
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load claims."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadClaims)
  }, [])

  const updateClaim = async (claim: Claim, action: "approve" | "reject") => {
    try {
      const updated =
        action === "approve"
          ? await approveClaim(claim.id)
          : await rejectClaim(claim.id)
      setClaims((current) =>
        current.map((currentClaim) =>
          currentClaim.id === claim.id
            ? { ...currentClaim, ...updated }
            : currentClaim
        )
      )
      toast.success(
        action === "approve" ? "Claim approved." : "Claim rejected."
      )
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to update claim."))
    }
  }

  const visibleClaims = claims.filter((claim) =>
    `${claim.user?.name ?? ""} ${claim.found_item?.title ?? ""} ${claim.claim_reason}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <AdminPage
      title="Claims"
      description="Review ownership claims, proof images, and decide which requests to approve."
    >
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-[#D8DCEF] bg-white p-4">
        <Search size={16} className="text-[#5B6280]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search claimant or item"
          className="w-full bg-white text-sm text-[#031079] outline-none placeholder:text-[#8B92B0]"
        />
      </div>
      {loading ? (
        <AdminState>Loading claims...</AdminState>
      ) : error ? (
        <AdminState error>{error}</AdminState>
      ) : visibleClaims.length === 0 ? (
        <AdminState>No claims found.</AdminState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#D8DCEF] bg-white">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D8DCEF] text-left text-[11px] tracking-wide text-[#5B6280] uppercase">
                <th className="px-5 py-3">Claimant</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Found by</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Proof</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleClaims.map((claim) => (
                <tr
                  key={claim.id}
                  className="border-b border-[#D8DCEF] last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#031079]">
                      {claim.user?.name ?? "Unknown"}
                    </div>
                    <div className="text-xs text-[#5B6280]">
                      {claim.user?.email}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#031079]">
                    {getStorageUrl(claim.found_item?.image) && (
                      <a href={getStorageUrl(claim.found_item?.image) ?? "#"} target="_blank" rel="noreferrer" className="mb-1 block text-xs font-semibold text-[#D4A80D] hover:underline">
                        View item image
                      </a>
                    )}
                    {claim.found_item?.title ?? "Unknown item"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-[#031079]">{claim.found_item?.user?.name ?? "Unknown"}</div>
                    <div className="text-xs text-[#5B6280]">{claim.found_item?.user?.email}</div>
                  </td>
                  <td className="max-w-xs px-5 py-4 text-xs text-[#4A5170]">
                    {claim.claim_reason}
                  </td>
                  <td className="px-5 py-4">
                    {getStorageUrl(claim.proof) ? (
                      <a
                        href={getStorageUrl(claim.proof) ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4A80D] hover:underline"
                      >
                        View proof <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="text-xs text-[#8B92B0]">
                        Not provided
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#4A5170]">
                    {formatDate(claim.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <AdminBadge value={claim.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {claim.status === "pending" && (
                        <>
                          <button
                            type="button"
                            title="Approve claim"
                            onClick={() => void updateClaim(claim, "approve")}
                            className="rounded-md border border-[#D8DCEF] p-2 text-[#031079] hover:border-[#031079]"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            type="button"
                            title="Reject claim"
                            onClick={() => void updateClaim(claim, "reject")}
                            className="rounded-md border border-[#D8DCEF] p-2 text-[#B6503A] hover:border-[#B6503A]"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                    </div>
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
