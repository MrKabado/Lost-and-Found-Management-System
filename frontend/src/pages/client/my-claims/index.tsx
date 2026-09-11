import { useEffect, useState } from "react"
import { CalendarDays, PackageCheck } from "lucide-react"
import { formatDate, getApiError, getClaims, type Claim } from "@/lib/client"
import ClientPage, { EmptyState, ErrorState, LoadingState, StatusBadge } from "@/pages/client/ClientPage"

export default function MyClaims() {
	const [claims, setClaims] = useState<Claim[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		getClaims().then(setClaims).catch((requestError) => setError(getApiError(requestError, "Unable to load your claims."))).finally(() => setLoading(false))
	}, [])

	return <ClientPage title="My claims" description="Follow the review status of your claims.">{loading ? <LoadingState /> : error ? <ErrorState message={error} /> : claims.length === 0 ? <EmptyState message="You have not submitted any claims yet." /> : <div className="space-y-4">{claims.map((claim) => <div key={claim.id} className="rounded-xl border border-[#E2DDD0] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7EEEC] text-[#3F6C63]"><PackageCheck size={20} /></div><div><h3 className="font-semibold text-[#1B2430]">{claim.foundItem?.title ?? "Found item"}</h3><p className="mt-1 text-xs text-[#83796A]">{claim.foundItem?.category?.name ?? "Uncategorized"}</p></div></div><StatusBadge status={claim.status} /></div><p className="mt-4 text-sm text-[#5F5A50]">{claim.claim_reason}</p><div className="mt-4 flex items-center gap-2 text-xs text-[#83796A]"><CalendarDays size={14} /> Submitted {formatDate(claim.created_at)}</div></div>)}</div>}</ClientPage>
}
