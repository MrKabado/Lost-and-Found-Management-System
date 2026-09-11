import { Search, ArrowLeftRight } from "lucide-react";
import { Link } from "react-router";

export default function HeaderClient() {
  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#E2DDD0] bg-white px-7">
      <div>
        <h1 className="font-serif text-[19px] font-semibold text-[#1B2430]">
          Welcome back, Juan
        </h1>

        <div className="mt-0.5 text-[12.5px] text-[#83796A]">
          Here's what's happening with your reports and claims.
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex w-60 items-center gap-2 rounded-lg border border-[#E2DDD0] bg-[#F6F3EC] px-3 py-2">
          <Search size={15} className="shrink-0 text-[#83796A]" />

          <input
            type="text"
            placeholder="Search items..."
            className="w-full bg-transparent text-[13px] text-[#1B2430] outline-none placeholder:text-[#83796A]"
          />
        </div>

        {/* Switch */}
        <Link
          to="/admin"
          className="flex items-center gap-2 rounded-lg border border-[#E2DDD0] bg-white px-3.5 py-2 text-[12.5px] font-semibold text-[#26313F] transition hover:border-[#E3963E] hover:text-[#C97A28]"
        >
          <ArrowLeftRight size={14} />
          Switch to Admin
        </Link>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-[#3F6C63] to-[#2C4D46] font-serif text-sm text-white">
          JD
        </div>
      </div>
    </header>
  );
}