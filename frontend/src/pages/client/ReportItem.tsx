import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { getApiError, getCategories, type Category } from "@/lib/client"
import ClientPage, { ErrorState } from "@/pages/client/ClientPage"

export default function ReportItem({ type }: { type: "lost" | "found" }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState(() => ({ category_id: "", title: searchParams.get("title") ?? "", description: "", location: "", date: "" }))
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories().then(setCategories).catch((requestError) => setError(getApiError(requestError, "Unable to load categories.")))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      await api.post(`/${type}-items`, {
        category_id: Number(form.category_id),
        title: form.title,
        description: form.description,
        [type === "lost" ? "location_lost" : "location_found"]: form.location,
        [type === "lost" ? "date_lost" : "date_found"]: form.date,
      })
      toast.success(`${type === "lost" ? "Lost" : "Found"} item report submitted.`)
      navigate(type === "lost" ? "/client/lost-reports" : "/client/found-reports")
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to submit this report.")
      toast.error(message)
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return <ClientPage title={`Report a ${type} item`} description="Give enough detail to help the community identify it." action={<Link to="/client" className="flex items-center gap-2 text-sm font-semibold text-[#C97A28]"><ArrowLeft size={15} /> Back to dashboard</Link>}>
    <form onSubmit={handleSubmit} className="max-w-2xl rounded-xl border border-[#E2DDD0] bg-white p-6">
      {error && <div className="mb-5"><ErrorState message={error} /></div>}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-[#26313F]">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-lg border border-[#E2DDD0] px-3 py-2.5 font-normal outline-none focus:border-[#E3963E]" placeholder="e.g. Black backpack" /></label>
        <label className="text-sm font-semibold text-[#26313F]">Category<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })} className="mt-2 w-full rounded-lg border border-[#E2DDD0] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#E3963E]"><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className="text-sm font-semibold text-[#26313F]">Location<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-2 w-full rounded-lg border border-[#E2DDD0] px-3 py-2.5 font-normal outline-none focus:border-[#E3963E]" placeholder="Where was it seen?" /></label>
        <label className="text-sm font-semibold text-[#26313F]">Date<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-2 w-full rounded-lg border border-[#E2DDD0] px-3 py-2.5 font-normal outline-none focus:border-[#E3963E]" /></label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-[#26313F]">Description<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} className="mt-2 w-full rounded-lg border border-[#E2DDD0] px-3 py-2.5 font-normal outline-none focus:border-[#E3963E]" placeholder="Add color, brand, identifying marks, and other useful details." /></label>
      <button disabled={saving} type="submit" className="mt-6 flex items-center gap-2 rounded-lg bg-[#1B2430] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#26313F] disabled:opacity-60">{saving ? "Submitting..." : <><CheckCircle2 size={16} /> Submit report</>}</button>
    </form>
  </ClientPage>
}