import type { ReactNode } from "react"

export default function ClientPage({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-semibold text-[#171717]">
            {title}
          </h2>
          <p className="mt-1 text-[13px] text-[#6B6B6B]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

export function LoadingState() {
  return (
    <div className="rounded-xl border border-[#E6E6E6] bg-white p-8 text-center text-sm text-[#6B6B6B]">
      Loading data...
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#E6E6E6] bg-white p-10 text-center text-sm text-[#6B6B6B]">
      {message}
    </div>
  )
}

export function StatusBadge({ status, itemType }: { status: string; itemType?: "lost" | "found" }) {
  const normalizedStatus = status.toUpperCase()
  const tone = ["APPROVED", "AVAILABLE", "RETURNED"].includes(
    normalizedStatus
  )
    ? "border border-[#BBE7D0] bg-[#ECFDF3] text-[#16704A]"
    : ["UNCLAIMED", "ARCHIVED", "REJECTED"].includes(normalizedStatus)
      ? "border border-[#F3C1C1] bg-[#FFF1F2] text-[#B42318]"
      : "border border-[#BFDBFE] bg-[#EFF6FF] text-[#1D4ED8]"

  const label = itemType === "lost" && normalizedStatus === "AVAILABLE"
    ? "ACTIVE REPORT"
    : normalizedStatus

  return (
    <span
      className={`inline-block min-w-[96px] whitespace-nowrap rounded-full px-3 py-1 text-center text-[10px] font-bold tracking-wide ${tone}`}
    >
      {label}
    </span>
  )
}
