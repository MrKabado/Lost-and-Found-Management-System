import type { ReactNode } from "react"

export default function AdminPage({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <div className="min-w-0 pb-16"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-sans text-2xl font-semibold text-[#171717]">{title}</h1><p className="mt-1 text-[13px] text-[#6B6B6B]">{description}</p></div>{action}</div>{children}</div>
}

export function AdminState({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`rounded-xl border p-5 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-[#E6E6E6] bg-white text-[#6B6B6B]"}`}>{children}</div>
}

export function AdminBadge({ value }: { value: string }) {
  const status = value.toUpperCase()
  const tone = ["FOUND", "VERIFIED", "RETURNED", "APPROVED", "ADMIN"].includes(status) ? "bg-[#F4F4F4] text-[#171717]" : ["REJECTED", "CLOSED"].includes(status) ? "bg-[#F5E7E3] text-[#B6503A]" : "bg-[#F4F4F4] text-[#171717]"
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${tone}`}>{status}</span>
}