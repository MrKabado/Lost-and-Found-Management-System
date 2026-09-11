import { Check, X, Pencil, Plus } from "lucide-react";

const stats = [
  {
    label: "Total users",
    value: "312",
    delta: "+14 this month",
  },
  {
    label: "Lost items logged",
    value: "48",
    delta: "6 still unmatched",
    down: true,
  },
  {
    label: "Found items logged",
    value: "63",
    delta: "15 awaiting owner",
  },
  {
    label: "Items returned",
    value: "128",
    delta: "This month",
  },
];

const claims = [
  {
    initials: "MR",
    name: "Maria Reyes",
    item: "USB flash drive, 32GB",
    category: "Electronics",
    submitted: "Sep 9, 2026",
    status: "PENDING",
  },
  {
    initials: "JT",
    name: "Jomari Torres",
    item: "Black backpack",
    category: "Bags",
    submitted: "Sep 9, 2026",
    status: "PENDING",
  },
  {
    initials: "KS",
    name: "Kim Santos",
    item: "School ID + wallet",
    category: "Documents",
    submitted: "Sep 7, 2026",
    status: "VERIFIED",
  },
  {
    initials: "AP",
    name: "Angelo Pineda",
    item: "Silver house keys",
    category: "Personal accessories",
    submitted: "Sep 5, 2026",
    status: "REJECTED",
  },
];

const categories = [
  { name: "Electronics", color: "#3F6C63" },
  { name: "School items", color: "#E3963E" },
  { name: "Bags", color: "#B6503A" },
  { name: "Documents", color: "#7A7568" },
  { name: "Personal accessories", color: "#1B2430" },
  { name: "Other", color: "#9AA3AC" },
];

export default function AdminDashboard() {
  return (
    <main className="min-w-0 flex-1 bg-[#F6F3EC]">
      <div className="px-7 pb-[60px] pt-[26px]">
        {/* Statistics */}
        <div className="mb-[26px] grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-xl border border-[#E2DDD0] bg-white px-[18px] pb-4 pt-[18px]"
            >
              <div className="absolute right-0 top-0 h-[34px] w-[34px] rounded-bl-xl bg-[#F6F3EC]" />

              <div className="text-xs tracking-wide text-[#83796A]">
                {stat.label}
              </div>

              <div className="mt-1.5 font-serif text-[30px] text-[#1B2430]">
                {stat.value}
              </div>

              <div
                className={`mt-2 text-[11.5px] ${
                  stat.down ? "text-[#B6503A]" : "text-[#3F6C63]"
                }`}
              >
                {stat.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Pending Claims */}
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#1B2430]">
            Pending claims
          </h2>

          <a
            href="#"
            className="border-b border-dotted border-[#83796A] text-[12.5px] text-[#83796A]"
          >
            View all claims
          </a>
        </div>

        <div className="mb-[30px] overflow-hidden rounded-xl border border-[#E2DDD0] bg-white">
          <table className="w-full border-collapse text-[13.5px]">
            <thead>
              <tr className="border-b border-[#E2DDD0]">
                {[
                  "Claimant",
                  "Item",
                  "Category",
                  "Submitted",
                  "Status",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-[18px] py-3 text-left text-[11px] font-semibold tracking-wide text-[#83796A]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr
                  key={claim.name}
                  className="border-b border-[#E2DDD0] last:border-b-0 hover:bg-[#FBFAF6]"
                >
                  <td className="px-[18px] py-[13px]">
                    <div className="flex items-center gap-[9px]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2DDD0] bg-[#F6F3EC] font-serif text-[11px] text-[#26313F]">
                        {claim.initials}
                      </div>

                      {claim.name}
                    </div>
                  </td>

                  <td className="px-[18px] py-[13px]">{claim.item}</td>

                  <td className="px-[18px] py-[13px]">
                    {claim.category}
                  </td>

                  <td className="px-[18px] py-[13px]">
                    {claim.submitted}
                  </td>

                  <td className="px-[18px] py-[13px]">
                    <StatusBadge status={claim.status} />
                  </td>

                  <td className="px-[18px] py-[13px]">
                    <div className="flex justify-end gap-2">
                      {claim.status === "PENDING" ? (
                        <>
                          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#3F6C63] hover:text-[#3F6C63]">
                            <Check size={14} />
                          </button>

                          <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#B6503A] hover:text-[#B6503A]">
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <button className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#E2DDD0] text-[#83796A] hover:border-[#C97A28] hover:text-[#C97A28]">
                          <Pencil size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Categories */}
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-semibold text-[#1B2430]">
            Categories
          </h2>

          <button className="flex items-center gap-2 rounded-lg bg-[#E3963E] px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-[#C97A28]">
            <Plus size={13} />
            Add category
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center gap-[9px] rounded-[9px] border border-[#E2DDD0] bg-white px-[13px] py-[9px] text-[13px]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />

              {category.name}

              <button className="ml-1 text-[#9AA3AC] hover:text-[#B6503A]">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-[#FCEFD8] text-[#C97A28]",
    VERIFIED: "bg-[#E7EEEC] text-[#3F6C63]",
    REJECTED: "bg-[#F5E7E3] text-[#B6503A]",
  };

  return (
    <span
      className={`rounded-full px-[9px] py-[3px] text-[10.5px] font-bold tracking-wide ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}