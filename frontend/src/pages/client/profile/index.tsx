import { useEffect, useState, type FormEvent } from "react"
import { CheckCircle2, FileCheck2, UserRound } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/auth/useAuth"
import {
  getApiError,
  getCourses,
  getStorageUrl,
  getStudentProfile,
  getVerificationRequest,
  saveStudentProfile,
  submitVerificationRequest,
  type Course,
  type StudentProfile,
  type VerificationRequest,
} from "@/lib/client"
import ClientPage from "@/pages/client/ClientPage"

export default function ClientProfile() {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [verification, setVerification] = useState<VerificationRequest | null>(
    null
  )
  const [form, setForm] = useState({
    school_id: "",
    course_id: "",
    contact_number: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [schoolIdImage, setSchoolIdImage] = useState<File | null>(null)
  const [supportingDocument, setSupportingDocument] = useState<File | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const initials =
    user?.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U"
  const profileIsComplete = Boolean(
    (form.school_id ?? "").trim() &&
      form.course_id &&
      (form.contact_number ?? "").trim()
  )

  useEffect(() => {
    Promise.all([getStudentProfile(), getCourses(), getVerificationRequest()])
      .then(([loadedProfile, loadedCourses, loadedVerification]) => {
        setProfile(loadedProfile)
        setCourses(loadedCourses)
        setVerification(loadedVerification)
        if (loadedProfile) {
          setForm({
            school_id: loadedProfile.school_id ?? "",
            course_id:
              loadedProfile.course_id == null
                ? ""
                : String(loadedProfile.course_id),
            contact_number: loadedProfile.contact_number ?? "",
          })
        }
      })
      .catch((requestError) =>
        setError(getApiError(requestError, "Unable to load your profile."))
      )
      .finally(() => setLoading(false))
  }, [])

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    try {
      const saved = await saveStudentProfile(
        { ...form, course_id: Number(form.course_id) },
        profileImage
      )
      setProfile(saved)
      setProfileImage(null)
      toast.success("Student profile saved.")
    } catch (requestError) {
      const message = getApiError(requestError, "Unable to save your profile.")
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const submitVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!schoolIdImage) return
    setSubmitting(true)
    setError("")
    try {
      const submitted = await submitVerificationRequest(
        schoolIdImage,
        supportingDocument
      )
      setVerification(submitted)
      setSchoolIdImage(null)
      setSupportingDocument(null)
      await refreshUser()
      toast.success("Verification request submitted.")
    } catch (requestError) {
      const message = getApiError(
        requestError,
        "Unable to submit verification request."
      )
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ClientPage
      title="Profile"
      description="Complete your student profile and request account verification."
    >
      <div className="grid max-w-4xl gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-xl border border-[#D8DCEF] bg-white p-6">
          <div className="flex items-center gap-4 border-b border-[#D8DCEF] pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#031079] text-lg font-semibold text-white">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#031079]">
                {user?.name ?? "Loading profile"}
              </h3>
              <p className="text-sm text-[#5B6280]">Client account</p>
            </div>
          </div>
          {error && (
            <p className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="grid gap-5 pt-6 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#5B6280] uppercase">
                Full name
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-[#031079]">
                <UserRound size={15} />
                {user?.name ?? "Not available"}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#5B6280] uppercase">
                Email address
              </div>
              <div className="mt-1 text-sm text-[#031079]">
                {user?.email ?? "Not available"}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-[#5B6280] uppercase">
                Verification
              </div>
              <div className="mt-1 text-sm font-semibold text-[#031079]">
                {user?.is_verified ? "Verified account" : "Unverified account"}
              </div>
            </div>
          </div>
          <form
            onSubmit={saveProfile}
            className="mt-7 border-t border-[#D8DCEF] pt-6"
          >
            <h3 className="text-lg font-semibold text-[#031079]">
              Student profile
            </h3>
            {loading ? (
              <p className="mt-4 text-sm text-[#5B6280]">Loading profile...</p>
            ) : (
              <>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold text-[#041690]">
                    School ID
                    <input
                      required
                      value={form.school_id}
                      onChange={(event) =>
                        setForm({ ...form, school_id: event.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#041690]">
                    Course
                    <select
                      required
                      value={form.course_id}
                      onChange={(event) =>
                        setForm({ ...form, course_id: event.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-[#D8DCEF] bg-white px-3 py-2.5 font-normal"
                    >
                      <option value="">Choose a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-[#041690]">
                    Contact number
                    <input
                      maxLength={11}
                      required
                      value={form.contact_number}
                      onChange={(event) =>
                        setForm({ ...form, contact_number: event.target.value })
                      }
                      className="mt-2 w-full rounded-lg border border-[#D8DCEF] px-3 py-2.5 font-normal"
                    />
                  </label>
                  <label className="text-sm font-semibold text-[#041690]">
                    Profile image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) =>
                        setProfileImage(event.target.files?.[0] ?? null)
                      }
                      className="mt-2 block w-full text-xs font-normal"
                    />
                  </label>
                </div>
                <button
                  disabled={saving}
                  className="mt-5 rounded-lg bg-[#031079] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : profileIsComplete
                      ? "Update profile"
                      : "Create profile"}
                </button>
              </>
            )}
          </form>
        </div>
        <div className="rounded-xl border border-[#D8DCEF] bg-white p-6">
          <div className="flex items-center gap-2">
            <FileCheck2 size={19} className="text-[#031079]" />
            <h3 className="text-lg font-semibold text-[#031079]">
              Account verification
            </h3>
          </div>
          <p className="mt-2 text-sm text-[#5B6280]">
            A verified account is required to report items and submit claims.
          </p>
          {user?.is_verified ? (
            <div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="mr-2 inline" size={16} />
              Your account is verified.
            </div>
          ) : !profileIsComplete ? (
            <p className="mt-5 rounded-lg bg-[#F5F6FC] px-4 py-3 text-sm text-[#5B6280]">
              Complete your student profile first.
            </p>
          ) : verification?.status === "pending" ? (
            <div className="mt-5 rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              Your request is pending review.
            </div>
          ) : (
            <form onSubmit={submitVerification} className="mt-5 space-y-4">
              {verification?.status === "rejected" && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  <strong>Request rejected.</strong>{" "}
                  {verification.rejection_reason}
                </div>
              )}
              <label className="block text-sm font-semibold text-[#041690]">
                School ID image
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(event) =>
                    setSchoolIdImage(event.target.files?.[0] ?? null)
                  }
                  className="mt-2 block w-full text-xs font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-[#041690]">
                Supporting document{" "}
                <span className="font-normal text-[#5B6280]">(optional)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(event) =>
                    setSupportingDocument(event.target.files?.[0] ?? null)
                  }
                  className="mt-2 block w-full text-xs font-normal"
                />
              </label>
              <button
                disabled={submitting}
                className="rounded-lg bg-[#F5C518] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : verification?.status === "rejected"
                    ? "Resubmit request"
                    : "Submit for verification"}
              </button>
            </form>
          )}
          {profile?.profile_image && (
            <img
              src={getStorageUrl(profile.profile_image) ?? undefined}
              alt="Student profile"
              className="mt-6 h-24 w-24 rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </ClientPage>
  )
}
