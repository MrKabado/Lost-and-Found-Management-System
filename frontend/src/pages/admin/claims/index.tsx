import { useEffect, useState } from "react"
import { Check, ExternalLink, Search, X } from "lucide-react"
import { toast } from "sonner"
import { approveClaim, formatDate, getAdminClaims, getApiError, getStorageUrl, rejectClaim, type Claim } from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadClaims = async () => {
    try { setClaims(await getAdminClaims()) } catch (requestError) { setError(getApiError(requestError, "Unable to load claims.")) } finally { setLoading(false) }
  }

  useEffect(() => { void Promise.resolve().then(loadClaims) }, [])

  const updateClaim = async (claim: Claim, action: "approve" | "reject") => {
    try {
      const updated = action === "approve" ? await approveClaim(claim.id) : await rejectClaim(claim.id)
      setClaims((current) => current.map((currentClaim) => currentClaim.id === claim.id ? { ...currentClaim, ...updated } : currentClaim))
      toast.success(action === "approve" ? "Claim approved." : "Claim rejected.")
    } catch (requestError) { toast.error(getApiError(requestError, "Unable to update claim.")) }
  }

  const visibleClaims = claims.filter((claim) => `${claim.user?.name ?? ""} ${claim.found_item?.title ?? ""} ${claim.claim_reason}`.toLowerCase().includes(search.toLowerCase()))

  return <AdminPage title="Claims" description="Review ownership claims, proof images, and decide which requests to approve."><div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E2DDD0] bg-white p-4"><Search size={16} className="text-[#83796A]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search claimant or item" className="w-full text-sm outline-none" /></div>{loading ? <AdminState>Loading claims...</AdminState> : error ? <AdminState error>{error}</AdminState> : visibleClaims.length === 0 ? <AdminState>No claims found.</AdminState> : <div className="overflow-x-auto rounded-xl border border-[#E2DDD0] bg-white"><table className="w-full min-w-[1000px] border-collapse text-sm"><thead><tr className="border-b border-[#E2DDD0] text-left text-[11px] uppercase tracking-wide text-[#83796A]"><th className="px-5 py-3">Claimant</th><th className="px-5 py-3">Item</th><th className="px-5 py-3">Reason</th><th className="px-5 py-3">Proof</th><th className="px-5 py-3">Submitted</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{visibleClaims.map((claim) => <tr key={claim.id} className="border-b border-[#E2DDD0] last:border-0"><td className="px-5 py-4"><div className="font-semibold text-[#1B2430]">{claim.user?.name ?? "Unknown"}</div><div className="text-xs text-[#83796A]">{claim.user?.email}</div></td><td className="px-5 py-4 text-[#1B2430]">{claim.found_item?.title ?? "Unknown item"}</td><td className="max-w-xs px-5 py-4 text-xs text-[#5F5A50]">{claim.claim_reason}</td><td className="px-5 py-4">{getStorageUrl(claim.proof) ? <a href={getStorageUrl(claim.proof) ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#C97A28] hover:underline">View proof <ExternalLink size={13} /></a> : <span className="text-xs text-[#9AA3AC]">Not provided</span>}</td><td className="px-5 py-4 text-[#5F5A50]">{formatDate(claim.created_at)}</td><td className="px-5 py-4"><AdminBadge value={claim.status} /></td><td className="px-5 py-4"><div className="flex gap-2">{claim.status === "pending" && <><button type="button" title="Approve claim" onClick={() => void updateClaim(claim, "approve")} className="rounded-md border border-[#E2DDD0] p-2 text-[#3F6C63] hover:border-[#3F6C63]"><Check size={15} /></button><button type="button" title="Reject claim" onClick={() => void updateClaim(claim, "reject")} className="rounded-md border border-[#E2DDD0] p-2 text-[#B6503A] hover:border-[#B6503A]"><X size={15} /></button></>}</div></td></tr>)}</tbody></table></div>}</AdminPage>
}