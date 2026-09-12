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