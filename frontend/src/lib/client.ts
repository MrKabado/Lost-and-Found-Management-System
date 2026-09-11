import { api } from "@/lib/api"

export interface Category {
  id: number
  name: string
}

export interface Item {
  id: number
  type: "lost" | "found"
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
}

export interface Claim {
  id: number
  claim_reason: string
  proof: string | null
  status: string
  created_at: string
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
  const response = await api.get<Item[]>("/items", { params })
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