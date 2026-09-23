import { useEffect, useState } from "react"
import { ExternalLink, Search, X } from "lucide-react"
import Pagination from "@/components/common/Pagination"
import {
  formatDate,
  getAdminClaims,
  getApiError,
  getStorageUrl,
  type Claim,
} from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [selectedReason, setSelectedReason] = useState<Claim | null>(null)
  const claimsPerPage = 10

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

  useEffect(() => {
    setPage(1)
  }, [search, claims.length])

  const visibleClaims = claims.filter((claim) =>
    `${claim.user?.name ?? ""} ${claim.found_item?.title ?? ""} ${claim.claim_reason}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  const pageCount = Math.max(1, Math.ceil(visibleClaims.length / claimsPerPage))
  const paginatedClaims = visibleClaims.slice(
    (page - 1) * claimsPerPage,
    page * claimsPerPage,
  )

  return (
    <AdminPage
      title="Claims"
      description="Review ownership claims, proof images, and claim details."
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
          <table className="w-full min-w-[1100px] whitespace-nowrap border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#D8DCEF] text-left text-[11px] tracking-wide text-[#5B6280] uppercase">
                <th className="px-5 py-3">Claimant</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Found by</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Proof</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClaims.map((claim) => (
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
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedReason(claim)}
                      className="max-w-[220px] truncate text-left text-xs font-semibold text-[#1D4ED8] hover:underline"
                      title="View full claim reason"
                    >
                      {claim.claim_reason}
                    </button>
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
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            pageCount={pageCount}
            total={visibleClaims.length}
            onPageChange={setPage}
          />
        </div>
      )}
      {selectedReason && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#092354]/30 p-4"
          onClick={() => setSelectedReason(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#5B6280]">
                  Claim reason
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#031079]">
                  {selectedReason.found_item?.title ?? "Claim details"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReason(null)}
                aria-label="Close claim reason"
                className="rounded-md p-1 text-[#5B6280] hover:bg-[#F5F6FC]"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[#4A5170]">
              {selectedReason.claim_reason}
            </p>
          </div>
        </div>
      )}
    </AdminPage>
  )
}
