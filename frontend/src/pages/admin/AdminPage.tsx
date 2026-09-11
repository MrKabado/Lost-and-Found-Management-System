import type { ReactNode } from "react"

export default function AdminPage({ title, description, action, children }: { title: string; description: string; action?: ReactNode; children: ReactNode }) {
  return <div className="min-w-0 pb-16"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-sans text-2xl font-semibold text-[#1B2430]">{title}</h1><p className="mt-1 text-[13px] text-[#83796A]">{description}</p></div>{action}</div>{children}</div>
}

export function AdminState({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return <div className={`rounded-xl border p-5 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-[#E2DDD0] bg-white text-[#83796A]"}`}>{children}</div>
}

export function AdminBadge({ value }: { value: string }) {
  const status = value.toUpperCase()
  const tone = ["FOUND", "VERIFIED", "RETURNED", "APPROVED", "ADMIN"].includes(status) ? "bg-[#E7EEEC] text-[#3F6C63]" : ["REJECTED", "CLOSED"].includes(status) ? "bg-[#F5E7E3] text-[#B6503A]" : "bg-[#FCEFD8] text-[#C97A28]"
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${tone}`}>{status}</span>
}