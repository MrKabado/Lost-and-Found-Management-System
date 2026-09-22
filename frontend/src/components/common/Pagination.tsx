import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  page,
  pageCount,
  total,
  onPageChange,
}: PaginationProps) {
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-between border-t border-[#D8DCEF] bg-[#FAFBFF] px-5 py-3 text-xs text-[#5B6280]">
      <span>
        Page {page} of {pageCount} ({total} records)
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="rounded-md border border-[#D8DCEF] bg-white p-1.5 text-[#031079] hover:border-[#031079] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className="rounded-md border border-[#D8DCEF] bg-white p-1.5 text-[#031079] hover:border-[#031079] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}
