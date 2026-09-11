import { useEffect, useState } from "react"
import { Link } from "react-router"
import { CalendarDays, MapPin, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { formatDate, getApiError, getLostItems, type OwnedItem } from "@/lib/client"
import ClientPage, { EmptyState, ErrorState, LoadingState, StatusBadge } from "@/pages/client/ClientPage"

export default function MyLostReports() {
	const [items, setItems] = useState<OwnedItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		getLostItems().then(setItems).catch((requestError) => setError(getApiError(requestError, "Unable to load your lost reports."))).finally(() => setLoading(false))
	}, [])

	const deleteItem = async (id: number) => {
		if (!window.confirm("Delete this lost report?")) return
		try {
			await api.delete(`/lost-items/${id}`)
			setItems((current) => current.filter((item) => item.id !== id))
			toast.success("Lost report deleted.")
		} catch (requestError) {
			toast.error(getApiError(requestError, "Unable to delete this report."))
		}
	}

	return <ClientPage title="My lost reports" description="Track items you reported missing." action={<Link to="/client/report-lost" className="flex items-center gap-2 rounded-lg bg-[#E3963E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C97A28]"><Plus size={15} /> Report lost item</Link>}>{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : items.length === 0 ? <EmptyState message="You have not reported a lost item yet." /> : <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-xl border border-[#E2DDD0] bg-white p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[#1B2430]">{item.title}</h3><p className="mt-1 text-xs text-[#83796A]">{item.category?.name ?? "Uncategorized"}</p></div><StatusBadge status={item.status} /></div><p className="mt-4 text-sm text-[#5F5A50]">{item.description}</p><div className="mt-4 flex flex-col gap-2 text-xs text-[#83796A]"><span className="flex items-center gap-2"><MapPin size={14} />{item.location_lost}</span><span className="flex items-center gap-2"><CalendarDays size={14} />{formatDate(item.date_lost)}</span></div><button type="button" onClick={() => void deleteItem(item.id)} className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#B6503A] hover:text-[#8C3D2C]"><Trash2 size={14} /> Delete report</button></div>)}</div>}</ClientPage>
}
