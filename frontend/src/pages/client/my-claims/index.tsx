import { useEffect, useState } from "react"
import { CalendarDays, ExternalLink, PackageCheck } from "lucide-react"
import {
  formatDate,
  getApiError,
  getClaims,
  getStorageUrl,
  type Claim,
} from "@/lib/client"
import ClientPage, {
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from "@/pages/client/ClientPage"

export default function MyClaims() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getClaims()
      .then(setClaims)
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load your claims."))
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <ClientPage
      title="My claims"
      description="Follow the review status of your claims."
    >
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : claims.length === 0 ? (
        <EmptyState message="You have not submitted any claims yet." />
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="rounded-xl border border-[#D8DCEF] bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8EAF8] text-[#031079]">
                    <PackageCheck size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#031079]">
                      {claim.foundItem?.title ?? "Found item"}
                    </h3>
                    <p className="mt-1 text-xs text-[#5B6280]">
                      {(claim.found_item ?? claim.foundItem)?.category?.name ?? "Uncategorized"}
                    </p>
                        <p className="mt-1 text-xs text-[#5B6280]">
                          Found by: {claim.foundItem?.user?.name ?? "Unknown"}
                        </p>
                  </div>
                </div>
                <StatusBadge status={claim.status} />
              </div>
              <p className="mt-4 text-sm text-[#4A5170]">
                {claim.claim_reason}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5B6280]">
                <span className="flex items-center gap-2">
                  <CalendarDays size={14} /> Submitted{" "}
                  {formatDate(claim.created_at)}
                </span>
                {getStorageUrl(claim.foundItem?.image) && (
                  <a href={getStorageUrl(claim.foundItem?.image) ?? "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-[#D4A80D] hover:underline">
                    View found item image <ExternalLink size={13} />
                  </a>
                )}
                {getStorageUrl(claim.proof) && (
                  <a
                    href={getStorageUrl(claim.proof) ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#D4A80D] hover:underline"
                  >
                    View submitted proof <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ClientPage>
  )
}
