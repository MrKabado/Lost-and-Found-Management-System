import { Search, ArrowUpRight } from "lucide-react";

export default function HeaderAdmin() {
  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#E2DDD0] bg-white px-7">
      <div>
        <h1 className="font-serif text-[19px] font-semibold tracking-[0.01em] text-[#1B2430]">
          Admin overview
        </h1>

        <p className="mt-0.5 text-[12.5px] text-[#83796A]">
          Monitor reports, review claims and keep records tidy.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex w-60 items-center gap-2 rounded-lg border border-[#E2DDD0] bg-[#F6F3EC] px-3 py-2 text-[#83796A]">
          <Search size={15} />

          <input
            type="text"
            placeholder="Search records…"
            className="w-full bg-transparent text-[13px] text-[#1B2430] outline-none placeholder:text-[#83796A]"
          />
        </div>

        {/* Switch */}
        <button className="flex items-center gap-[7px] rounded-lg border border-[#E2DDD0] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#26313F] hover:border-[#E3963E] hover:text-[#C97A28]">
          <ArrowUpRight size={14} />
          Switch to Client
        </button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#E3963E] to-[#C97A28] font-serif text-sm text-white">
          AD
        </div>
      </div>
    </header>
  );
}