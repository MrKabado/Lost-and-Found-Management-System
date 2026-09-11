import { useEffect, useState } from "react"
import { Check, Pencil, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import {
  approveClaim,
  formatDate,
  getAdminClaims,
  getAdminStatistics,
  getApiError,
  getCategories,
  rejectClaim,
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

  const loadDashboard = async () => {
    try {
      setError("")
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
      toast.success(action === "approve" ? "Claim approved." : "Claim rejected.")
      await loadDashboard()
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to update this claim.")
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
      setCategories((current) => current.filter((category) => category.id !== id))
      toast.success("Category deleted.")
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to delete this category.")
      toast.error(message)
      setError(message)
    }
  }

  const stats = [
    { label: "Total users", value: statistics.total_users, delta: "Registered accounts" },
    { label: "Lost items logged", value: statistics.total_lost_items, delta: `${statistics.total_lost_items - statistics.returned_items} active reports` },
    { label: "Found items logged", value: statistics.total_found_items, delta: "Items submitted" },
    { label: "Items returned", value: statistics.returned_items, delta: `${statistics.pending_claims} claims pending`, down: statistics.pending_claims > 0 },
  ]

  return (
    <main className="min-w-0 flex-1 bg-[#F6F3EC]">
      <div className="px-7 pb-[60px] pt-[26px]">
        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        <div className="mb-[26px] grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <div key={stat.label} className="relative overflow-hidden rounded-xl border border-[#E2DDD0] bg-white px-[18px] pb-4 pt-[18px]"><div className="absolute right-0 top-0 h-[34px] w-[34px] rounded-bl-xl bg-[#F6F3EC]" /><div className="text-xs tracking-wide text-[#83796A]">{stat.label}</div><div className="mt-1.5 font-sans text-[30px] text-[#1B2430]">{loading ? "-" : stat.value}</div><div className={`mt-2 text-[11.5px] ${stat.down ? "text-[#B6503A]" : "text-[#3F6C63]"}`}>{stat.delta}</div></div>)}
        </div>

        <div className="mb-3.5 flex items-baseline justify-between"><h2 className="font-sans text-lg font-semibold text-[#1B2430]">Pending claims</h2><button type="button" onClick={() => void loadDashboard()} className="border-b border-dotted border-[#83796A] text-[12.5px] text-[#83796A]">Refresh data</button></div>
        <div className="mb-[30px] overflow-x-auto rounded-xl border border-[#E2DDD0] bg-white"><table className="w-full min-w-[760px] border-collapse text-[13.5px]"><thead><tr className="border-b border-[#E2DDD0]">{["Claimant", "Item", "Category", "Submitted", "Status", "Action"].map((heading) => <th key={heading} className="px-[18px] py-3 text-left text-[11px] font-semibold tracking-wide text-[#83796A]">{heading}</th>)}</tr></thead><tbody>{claims.length === 0 ? <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-[#83796A]">No claims found.</td></tr> : claims.map((claim) => { const name = claim.user?.name ?? "Unknown claimant"; const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); const status = claim.status.toUpperCase(); return <tr key={claim.id} className="border-b border-[#E2DDD0] last:border-b-0 hover:bg-[#FBFAF6]"><td className="px-[18px] py-[13px]"><div className="flex items-center gap-[9px]"><div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2DDD0] bg-[#F6F3EC] font-sans text-[11px] text-[#26313F]">{initials}</div>{name}</div></td><td className="px-[18px] py-[13px]">{claim.foundItem?.title ?? "Found item"}</td><td className="px-[18px] py-[13px]">{claim.foundItem?.category?.name ?? "Uncategorized"}</td><td className="px-[18px] py-[13px]">{formatDate(claim.created_at)}</td><td className="px-[18px] py-[13px]"><StatusBadge status={status} /></td><td className="px-[18px] py-[13px]"><div className="flex justify-end gap-2">{status === "PENDING" ? <><button type="button" disabled={actionId === claim.id} onClick={() => void updateClaim(claim.id, "approve")} title="Approve claim" className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#3F6C63] hover:text-[#3F6C63] disabled:opacity-50"><Check size={14} /></button><button type="button" disabled={actionId === claim.id} onClick={() => void updateClaim(claim.id, "reject")} title="Reject claim" className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#B6503A] hover:text-[#B6503A] disabled:opacity-50"><X size={14} /></button></> : <button type="button" title="Refresh claim status" onClick={() => void loadDashboard()} className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#C97A28] hover:text-[#C97A28]"><Pencil size={14} /></button>}</div></td></tr> })}</tbody></table></div>

        <div className="mb-3.5 flex items-baseline justify-between"><h2 className="font-sans text-lg font-semibold text-[#1B2430]">Categories</h2><button type="button" onClick={() => toast.info("Category creation will be available in category management.")} className="flex items-center gap-2 rounded-lg bg-[#E3963E] px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#C97A28]"><Plus size={13} /> Add category</button></div>
        <div className="flex flex-wrap gap-2.5">{categories.map((category, index) => <div key={category.id} className="flex items-center gap-[9px] rounded-[9px] border border-[#E2DDD0] bg-white px-[13px] py-[9px] text-[13px]"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#3F6C63", "#E3963E", "#B6503A", "#7A7568", "#1B2430", "#9AA3AC"][index % 6] }} />{category.name}<button type="button" onClick={() => void deleteCategory(category.id)} title={`Delete ${category.name}`} className="ml-1 text-[#9AA3AC] hover:text-[#B6503A]">×</button></div>)}</div>
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { PENDING: "bg-[#FCEFD8] text-[#C97A28]", APPROVED: "bg-[#E7EEEC] text-[#3F6C63]", VERIFIED: "bg-[#E7EEEC] text-[#3F6C63]", REJECTED: "bg-[#F5E7E3] text-[#B6503A]" }
  return <span className={`rounded-full px-[9px] py-[3px] text-[10.5px] font-bold tracking-wide ${styles[status] ?? "bg-[#E7E4DA] text-[#83796A]"}`}>{status}</span>
}