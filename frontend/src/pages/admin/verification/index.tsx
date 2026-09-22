import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import {
  approveVerificationRequest,
  getAdminVerificationRequests,
  getApiError,
  getStorageUrl,
  rejectVerificationRequest,
  type VerificationRequest,
} from "@/lib/client"
import AdminPage, { AdminBadge, AdminState } from "@/pages/admin/AdminPage"

export default function AdminVerification() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [status, setStatus] = useState("")
  const [rejectionReason, setRejectionReason] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadRequests = async () => {
    setLoading(true)
    try {
      setRequests(await getAdminVerificationRequests(status))
      setError("")
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to load verification requests."))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void Promise.resolve().then(async () => {
      setLoading(true)
      try {
        setRequests(await getAdminVerificationRequests(status))
        setError("")
      } catch (requestError) {
        setError(getApiError(requestError, "Unable to load verification requests."))
      } finally {
        setLoading(false)
      }
    })
  }, [status])

  const approve = async (id: number) => {
    try {
      await approveVerificationRequest(id)
      toast.success("Account approved and marked as verified.")
      await loadRequests()
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to approve request."))
    }
  }

  const reject = async (id: number) => {
    const reason = rejectionReason[id]?.trim()
    if (!reason) {
      toast.error("A rejection reason is required.")
      return
    }
    try {
      await rejectVerificationRequest(id, reason)
      toast.success("Verification request rejected.")
      await loadRequests()
    } catch (requestError) {
      toast.error(getApiError(requestError, "Unable to reject request."))
    }
  }

  return (
    <AdminPage title="Verification requests" description="Review student profiles and account documents.">
      <div className="mb-5 flex items-center justify-between rounded-xl border border-[#E6E6E6] bg-white p-4">
        <span className="text-sm font-semibold text-[#171717]">Filter requests</span>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#D8DCEF] bg-white px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {loading ? <AdminState>Loading verification requests...</AdminState> : error ? <AdminState error>{error}</AdminState> : requests.length === 0 ? <AdminState>No verification requests found.</AdminState> : <div className="space-y-4">
        {requests.map((request) => {
          const student = request.user?.student_profile
          return <article key={request.id} className="rounded-xl border border-[#E6E6E6] bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-semibold text-[#171717]">{request.user?.name ?? `User #${request.user_id}`}</h2><p className="mt-1 text-sm text-[#6B6B6B]">{request.user?.email}</p></div><AdminBadge value={request.status} />
            </div>
            <div className="mt-5 grid gap-4 text-sm text-[#4A5170] md:grid-cols-3">
              <div><span className="block text-xs font-semibold uppercase text-[#6B6B6B]">School ID</span>{student?.school_id ?? "Not available"}</div>
              <div><span className="block text-xs font-semibold uppercase text-[#6B6B6B]">Course</span>{student?.course?.name ?? "Not available"}</div>
              <div><span className="block text-xs font-semibold uppercase text-[#6B6B6B]">Contact</span>{student?.contact_number ?? "Not available"}</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <DocumentLink label="School ID image" path={request.school_id_image} />
              <DocumentLink label="Supporting document" path={request.supporting_document} />
            </div>
            {request.status === "pending" && <div className="mt-5 border-t border-[#E6E6E6] pt-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void approve(request.id)} className="rounded-lg bg-[#1C7C54] px-4 py-2 text-sm font-semibold text-white">Approve</button><button type="button" onClick={() => void reject(request.id)} className="rounded-lg bg-[#B6503A] px-4 py-2 text-sm font-semibold text-white">Reject</button><input value={rejectionReason[request.id] ?? ""} onChange={(event) => setRejectionReason({ ...rejectionReason, [request.id]: event.target.value })} placeholder="Reason required when rejecting" className="min-w-64 flex-1 rounded-lg border border-[#D8DCEF] px-3 py-2 text-sm" /></div></div>}
            {request.rejection_reason && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{request.rejection_reason}</p>}
          </article>
        })}
      </div>}
    </AdminPage>
  )
}

function DocumentLink({ label, path }: { label: string; path?: string | null }) {
  const url = getStorageUrl(path)
  return url ? <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-[#D8DCEF] px-3 py-2 font-semibold text-[#031079] hover:border-[#F5C518]">{label}<ExternalLink size={13} /></a> : <span className="rounded-lg bg-[#F5F6FC] px-3 py-2 text-[#8B92B0]">{label}: none</span>
}
