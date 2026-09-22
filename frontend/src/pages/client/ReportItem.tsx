import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { getApiError, getCategories, type Category } from "@/lib/client"
import ClientPage, { ErrorState } from "@/pages/client/ClientPage"
import { useAuth } from "@/auth/useAuth"

export default function ReportItem({ type }: { type: "lost" | "found" }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [form, setForm] = useState(() => ({
    category_id: "",
    title: searchParams.get("title") ?? "",
    description: "",
    location: "",
    date: "",
  }))
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load categories."))
      )
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("category_id", String(Number(form.category_id)))
      formData.append("title", form.title)
      formData.append("description", form.description)
      formData.append(
        type === "lost" ? "location_lost" : "location_found",
        form.location,
      )
      formData.append(
        type === "lost" ? "date_lost" : "date_found",
        form.date,
      )
      if (image) formData.append("image", image)

      await api.post(`/${type}-items`, formData)
      toast.success(
        `${type === "lost" ? "Lost" : "Found"} item report submitted.`
      )
      navigate(
        type === "lost" ? "/client/lost-reports" : "/client/found-reports"
      )
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to submit this report.")
      toast.error(message)
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <ClientPage
      title={`Report a ${type} item`}
      description="Give enough detail to help the community identify it."
      action={
        <Link
          to="/client"
          className="flex items-center gap-2 text-sm font-semibold text-[#D4A80D]"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </Link>
      }
    >
      {!user?.is_verified ? (
        <div className="max-w-2xl rounded-xl border border-[#E8D38A] bg-[#FFF9E8] p-6 text-sm text-[#705B00]">
          <h2 className="font-semibold">Your account must be verified before using this feature.</h2>
          <p className="mt-2">Complete your student profile and submit your verification request from your profile.</p>
          <Link to="/client/profile" className="mt-4 inline-flex rounded-lg bg-[#031079] px-4 py-2.5 font-semibold text-white">Open profile</Link>
        </div>
      ) : (
        <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-[#D8DCEF] bg-white p-6"
      >
        {error && (
          <div className="mb-5">
            <ErrorState message={error} />
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#041690]">
            Title
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal outline-none focus:border-[#F5C518]"
              placeholder="e.g. Black backpack"
            />
          </label>
          <label className="text-sm font-semibold text-[#041690]">
            Category
            <select
              required
              value={form.category_id}
              onChange={(event) =>
                setForm({ ...form, category_id: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#D8DCEF] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#F5C518]"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-[#041690]">
            Location
            <input
              required
              value={form.location}
              onChange={(event) =>
                setForm({ ...form, location: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal outline-none focus:border-[#F5C518]"
              placeholder="Where was it seen?"
            />
          </label>
          <label className="text-sm font-semibold text-[#041690]">
            Date
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm({ ...form, date: event.target.value })
              }
              className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal outline-none focus:border-[#F5C518]"
            />
          </label>
        </div>
        <label className="mt-5 block text-sm font-semibold text-[#041690]">
          Description
          <textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            rows={5}
            className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal outline-none focus:border-[#F5C518]"
            placeholder="Add color, brand, identifying marks, and other useful details."
          />
        </label>
        <label className="mt-5 block text-sm font-semibold text-[#041690]">
          Item image <span className="font-normal text-[#5B6280]">(optional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-xs font-normal"
          />
        </label>
        <button
          disabled={saving}
          type="submit"
          className="mt-6 flex items-center gap-2 rounded-lg bg-[#031079] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#041690] disabled:opacity-60"
        >
          {saving ? (
            "Submitting..."
          ) : (
            <>
              <CheckCircle2 size={16} /> Submit report
            </>
          )}
        </button>
        </form>
      )}
    </ClientPage>
  )
}
