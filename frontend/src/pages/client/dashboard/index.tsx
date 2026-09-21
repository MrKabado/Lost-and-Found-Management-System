import { useEffect, useState } from "react"
import { CalendarDays, MapPin, Plus } from "lucide-react"
import { Link } from "react-router"
import {
  getApiError,
  getClaims,
  getFoundItems,
  getItems,
  getLostItems,
  formatDate,
  type Item,
} from "@/lib/client"
import ClientPage, {
  ErrorState,
  LoadingState,
  StatusBadge,
} from "@/pages/client/ClientPage"

export default function ClientDashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [counts, setCounts] = useState({ lost: 0, found: 0, claims: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([getItems(), getLostItems(), getFoundItems(), getClaims()])
      .then(([nearbyItems, lost, found, claims]) => {
        setItems(nearbyItems.slice(0, 6))
        setCounts({
          lost: lost.length,
          found: found.length,
          claims: claims.filter((claim) => claim.status === "pending").length,
        })
      })
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load your dashboard."))
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <ClientPage
      title="Dashboard"
      description="See your reports, claims, and latest item reports."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Items reported"
          number={counts.lost + counts.found}
          description={`${counts.lost} lost · ${counts.found} found`}
        />
        <StatCard
          label="Active claims"
          number={counts.claims}
          description="Awaiting review"
        />
        <StatCard
          label="Latest reports"
          number={items.length}
          description="Newest item reports"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          to="/client/report-lost"
          className="flex items-center gap-2 rounded-lg bg-[#F5C518] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A80D]"
        >
          <Plus size={15} /> Report a lost item
        </Link>
        <Link
          to="/client/report-found"
          className="flex items-center gap-2 rounded-lg border border-[#D8DCEF] bg-white px-4 py-2.5 text-sm font-semibold text-[#031079] hover:border-[#031079]"
        >
          <Plus size={15} /> Report a found item
        </Link>
      </div>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-sans text-lg font-semibold text-[#031079]">
              Latest item reports
            </h2>
            <Link
              to="/client/items"
              className="text-xs font-semibold text-[#D4A80D]"
            >
              See all items
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="rounded-xl border border-[#D8DCEF] bg-white p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#031079]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#5B6280]">
                      {item.category?.name ?? "Uncategorized"} · {item.type}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-4 space-y-2 text-xs text-[#5B6280]">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} />
                    {formatDate(item.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </ClientPage>
  )
}

function StatCard({
  label,
  number,
  description,
}: {
  label: string
  number: number
  description: string
}) {
  return (
    <div className="rounded-xl border border-[#D8DCEF] bg-white px-5 py-4">
      <div className="text-xs tracking-wide text-[#5B6280]">{label}</div>
      <div className="mt-1 font-sans text-3xl text-[#031079]">{number}</div>
      <div className="mt-2 text-xs text-[#031079]">{description}</div>
    </div>
  )
}
