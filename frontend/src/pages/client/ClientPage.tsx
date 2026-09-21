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

export function StatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toUpperCase()
  const tone = ["APPROVED", "FOUND", "VERIFIED", "RETURNED"].includes(
    normalizedStatus
  )
    ? "bg-[#F4F4F4] text-[#171717]"
    : normalizedStatus === "REJECTED"
      ? "bg-[#F5E7E3] text-[#B6503A]"
      : "bg-[#F4F4F4] text-[#171717]"

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide ${tone}`}
    >
      {normalizedStatus}
    </span>
  )
}
