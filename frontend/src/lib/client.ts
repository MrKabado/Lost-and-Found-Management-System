import { api } from "@/lib/api"

export interface Category {
  id: number
  name: string
}

export interface Item {
  id: number
  type: "lost" | "found"
  user_id: number
  title: string
  description: string
  location: string
  date: string
  image: string | null
  status: string
  category?: Category | null
  created_at: string
}

export interface OwnedItem {
  id: number
  title: string
  description: string
  location_lost?: string
  location_found?: string
  date_lost?: string
  date_found?: string
  image: string | null
  status: string
  category?: Category | null
  created_at: string
  user?: { id: number; name: string; email: string } | null
}

export interface AdminUser {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  created_at: string
}

export interface Claim {
  id: number
  claim_reason: string
  proof: string | null
  status: string
  created_at: string
  found_item?: OwnedItem | null
  foundItem?: OwnedItem | null
  user?: { id: number; name: string; email: string } | null
}

export interface AdminStatistics {
  total_users: number
  total_lost_items: number
  total_found_items: number
  pending_claims: number
  returned_items: number
}

export function formatDate(value?: string): string {
  if (!value) return "No date"

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function getApiError(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }

  return error instanceof Error ? error.message : fallback
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories")
  return response.data
}

export async function getItems(params?: Record<string, string>): Promise<Item[]> {
  const filteredParams = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, value]) => value.trim() !== ""),
      )
    : undefined
  const response = await api.get<Item[]>("/items", { params: filteredParams })
  return response.data
}

export async function getLostItems(): Promise<OwnedItem[]> {
  const response = await api.get<OwnedItem[]>("/lost-items")
  return response.data
}

export async function getFoundItems(): Promise<OwnedItem[]> {
  const response = await api.get<OwnedItem[]>("/found-items")
  return response.data
}

export async function getClaims(): Promise<Claim[]> {
  const response = await api.get<Claim[]>("/claims")
  return response.data
}

export async function getAdminLostItems(): Promise<OwnedItem[]> {
  const response = await api.get<OwnedItem[]>("/admin/lost-items")
  return response.data
}

export async function getAdminFoundItems(): Promise<OwnedItem[]> {
  const response = await api.get<OwnedItem[]>("/admin/found-items")
  return response.data
}

export async function getAdminClaims(): Promise<Claim[]> {
  const response = await api.get<Claim[]>("/admin/claims")
  return response.data
}

export async function getAdminStatistics(): Promise<AdminStatistics> {
  const response = await api.get<AdminStatistics>("/admin/dashboard/statistics")
  return response.data
}

export async function approveClaim(id: number): Promise<Claim> {
  const response = await api.post<Claim>(`/admin/claims/${id}/approve`)
  return response.data
}

export async function rejectClaim(id: number): Promise<Claim> {
  const response = await api.post<Claim>(`/admin/claims/${id}/reject`)
  return response.data
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<AdminUser[]>("/admin/users")
  return response.data
}

export async function updateLostStatus(id: number, status: string): Promise<OwnedItem> {
  const response = await api.patch<OwnedItem>(`/admin/lost-items/${id}/status`, { status })
  return response.data
}

export async function updateFoundStatus(id: number, status: string): Promise<OwnedItem> {
  const response = await api.patch<OwnedItem>(`/admin/found-items/${id}/status`, { status })
  return response.data
}

export async function deleteAdminLostItem(id: number): Promise<void> {
  await api.delete(`/admin/lost-items/${id}`)
}

export async function deleteAdminFoundItem(id: number): Promise<void> {
  await api.delete(`/admin/found-items/${id}`)
}

export async function createCategory(name: string): Promise<Category> {
  const response = await api.post<Category>("/categories", { name })
  return response.data
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const response = await api.put<Category>(`/categories/${id}`, { name })
  return response.data
}

export function getStorageUrl(path?: string | null): string | null {
  if (!path) return null

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
  return `${apiUrl.replace(/\/api\/?$/, "")}/storage/${path}`
}

export function getApiRetryAfter(error: unknown): number {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { retry_after?: number } } }).response
    if (typeof response?.data?.retry_after === "number") return response.data.retry_after
  }

  const message = getApiError(error, "")
  const match = message.match(/wait (\d+) seconds?/i)

  return match ? Number(match[1]) : 0
}

const otpCooldownStoragePrefix = "otp_cooldown:"

export function getOtpCooldown(email: string): number {
  const key = `${otpCooldownStoragePrefix}${email.trim().toLowerCase()}`
  const deadline = Number(localStorage.getItem(key) || 0)
  const remaining = Math.max(Math.ceil((deadline - Date.now()) / 1000), 0)

  if (remaining === 0) localStorage.removeItem(key)

  return remaining
}

export function setOtpCooldown(email: string, seconds: number): void {
  const key = `${otpCooldownStoragePrefix}${email.trim().toLowerCase()}`

  if (seconds <= 0) {
    localStorage.removeItem(key)
    return
  }

  localStorage.setItem(key, String(Date.now() + seconds * 1000))
}

export interface Course {
  id: number
  name: string
}

export interface StudentProfile {
  id: number
  user_id: number
  school_id: string
  course_id: number
  contact_number: string
  profile_image: string | null
  course?: Course | null
}

export interface VerificationRequest {
  id: number
  user_id: number
  school_id_image: string
  supporting_document: string | null
  status: "pending" | "approved" | "rejected"
  rejection_reason: string | null
  reviewed_by: number | null
  reviewed_at: string | null
  created_at: string
  user?: AdminUser & { student_profile?: StudentProfile | null }
}

export async function getCourses(): Promise<Course[]> {
  const response = await api.get<Course[]>('/courses')
  return response.data
}

export async function getStudentProfile(): Promise<StudentProfile | null> {
  const response = await api.get<StudentProfile | null>('/profile')
  return response.data
}

export async function saveStudentProfile(
  values: { school_id: string; course_id: number; contact_number: string },
  profileImage?: File | null,
  updating = false,
): Promise<StudentProfile> {
  const formData = new FormData()
  formData.append('school_id', values.school_id)
  formData.append('course_id', String(values.course_id))
  formData.append('contact_number', values.contact_number)
  if (profileImage) formData.append('profile_image', profileImage)

  const response = await api.request<StudentProfile>({
    method: updating ? 'PATCH' : 'POST',
    url: '/profile',
    data: formData,
  })
  return response.data
}

export async function getVerificationRequest(): Promise<VerificationRequest | null> {
  const response = await api.get<VerificationRequest | null>('/verification-requests')
  return response.data
}

export async function submitVerificationRequest(
  schoolIdImage: File,
  supportingDocument?: File | null,
): Promise<VerificationRequest> {
  const formData = new FormData()
  formData.append('school_id_image', schoolIdImage)
  if (supportingDocument) formData.append('supporting_document', supportingDocument)

  const response = await api.post<VerificationRequest>('/verification-requests', formData)
  return response.data
}

export async function getAdminVerificationRequests(status?: string): Promise<VerificationRequest[]> {
  const response = await api.get<VerificationRequest[]>('/admin/verification-requests', {
    params: status ? { status } : undefined,
  })
  return response.data
}

export async function approveVerificationRequest(id: number): Promise<VerificationRequest> {
  const response = await api.post<VerificationRequest>(`/admin/verification-requests/${id}/approve`)
  return response.data
}

export async function rejectVerificationRequest(id: number, rejection_reason: string): Promise<VerificationRequest> {
  const response = await api.post<VerificationRequest>(`/admin/verification-requests/${id}/reject`, { rejection_reason })
  return response.data
}