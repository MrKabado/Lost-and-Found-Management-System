import { useCallback, useEffect, useState } from "react"
import { Search, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { formatDate, getAdminFoundItems, getAdminLostItems, getApiError, updateFoundStatus, updateLostStatus, type OwnedItem } from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminItems({ type }: { type: "lost" | "found" }) {
  const [items, setItems] = useState<OwnedItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadItems = useCallback(async () => {
    try {
      setError("")
      setItems(type === "lost" ? await getAdminLostItems() : await getAdminFoundItems())
    } catch (requestError) {
      setError(getApiError(requestError, `Unable to load ${type} items.`))
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => { void Promise.resolve().then(loadItems) }, [loadItems])

  const changeStatus = async (item: OwnedItem, status: string) => {
    try {
      const updated = type === "lost" ? await updateLostStatus(item.id, status) : await updateFoundStatus(item.id, status)
      setItems((current) => current.map((currentItem) => currentItem.id === item.id ? updated : currentItem))
      toast.success("Item status updated.")
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to update item status."))
    }
  }

  const deleteItem = async (id: number) => {
    if (!window.confirm("Delete this item?")) return
    try {
      await api.delete(`/admin/${type}-items/${id}`)
      setItems((current) => current.filter((item) => item.id !== id))
      toast.success("Item deleted.")
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to delete this item."))
    }
  }

  const visibleItems = items.filter((item) => `${item.title} ${item.description} ${item.user?.name ?? ""}`.toLowerCase().includes(search.toLowerCase()))
  const statusOptions = type === "lost" ? ["lost", "found", "rejected", "closed"] : ["found", "claimed", "rejected", "closed"]

  return <AdminPage title={`${type === "lost" ? "Lost" : "Found"} items`} description={`Review and manage all ${type} item reports.`}><div className="mb-5 flex items-center gap-2 rounded-xl border border-[#E2DDD0] bg-white p-4"><Search size={16} className="text-[#83796A]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, description, or reporter" className="w-full text-sm outline-none" /></div>{loading ? <AdminState>Loading items...</AdminState> : error ? <AdminState error>{error}</AdminState> : visibleItems.length === 0 ? <AdminState>No items found.</AdminState> : <div className="overflow-x-auto rounded-xl border border-[#E2DDD0] bg-white"><table className="w-full min-w-[900px] border-collapse text-sm"><thead><tr className="border-b border-[#E2DDD0] text-left text-[11px] uppercase tracking-wide text-[#83796A]"><th className="px-5 py-3">Item</th><th className="px-5 py-3">Reporter</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody>{visibleItems.map((item) => <tr key={item.id} className="border-b border-[#E2DDD0] last:border-0"><td className="px-5 py-4"><div className="font-semibold text-[#1B2430]">{item.title}</div><div className="mt-1 text-xs text-[#83796A]">{item.category?.name ?? "Uncategorized"}</div></td><td className="px-5 py-4"><div className="text-[#1B2430]">{item.user?.name ?? "Unknown"}</div><div className="text-xs text-[#83796A]">{item.user?.email}</div></td><td className="px-5 py-4 text-[#5F5A50]">{item.location_lost ?? item.location_found}</td><td className="px-5 py-4 text-[#5F5A50]">{formatDate(item.date_lost ?? item.date_found)}</td><td className="px-5 py-4"><AdminBadge value={item.status} /></td><td className="px-5 py-4"><div className="flex items-center gap-2"><select value={item.status} onChange={(event) => void changeStatus(item, event.target.value)} className="rounded-md border border-[#E2DDD0] bg-white px-2 py-1.5 text-xs"><option value={item.status}>{item.status}</option>{statusOptions.filter((status) => status !== item.status).map((status) => <option key={status} value={status}>{status}</option>)}</select><button type="button" title="Delete item" onClick={() => void deleteItem(item.id)} className="rounded-md border border-[#E2DDD0] p-2 text-[#B6503A] hover:border-[#B6503A]"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div>}</AdminPage>
}