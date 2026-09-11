import {
  Plus,
  MapPin,
  CalendarDays,
  Backpack,
  KeyRound,
  HardDrive,
  WalletCards,
  Clock3,
  Notebook,
} from "lucide-react";

const items = [
  {
    title: "Black backpack",
    category: "Bags",
    status: "FOUND",
    location: "Rizal Library, 2nd flr",
    date: "Found Sep 8, 2026",
    icon: Backpack,
    gradient: "from-[#3F6C63] to-[#2C4D46]",
    statusClass: "bg-[#E7EEEC] text-[#3F6C63]",
  },
  {
    title: "Silver house keys",
    category: "Personal accessories",
    status: "LOST",
    location: "Engineering Bldg, Rm 204",
    date: "Lost Sep 6, 2026",
    icon: KeyRound,
    gradient: "from-[#B6503A] to-[#8C3D2C]",
    statusClass: "bg-[#F5E7E3] text-[#B6503A]",
  },
  {
    title: "USB flash drive, 32GB",
    category: "Electronics",
    status: "CLAIMED",
    location: "Computer Lab 3",
    date: "Found Sep 4, 2026",
    icon: HardDrive,
    gradient: "from-[#1B2430] to-[#26313F]",
    statusClass: "bg-[#FCEFD8] text-[#C97A28]",
  },
  {
    title: "School ID + wallet",
    category: "Documents",
    status: "VERIFIED",
    location: "Main Gate, Guard House",
    date: "Found Sep 2, 2026",
    icon: WalletCards,
    gradient: "from-[#E3963E] to-[#C97A28]",
    statusClass: "bg-[#E7EEEC] text-[#3F6C63]",
  },
  {
    title: "Analog wristwatch",
    category: "Personal accessories",
    status: "RETURNED",
    location: "Student Lounge",
    date: "Returned Aug 29, 2026",
    icon: Clock3,
    gradient: "from-[#7A7568] to-[#5C584D]",
    statusClass: "bg-[#E7E4DA] text-[#83796A]",
  },
  {
    title: "Blue notebook, physics notes",
    category: "School items",
    status: "FOUND",
    location: "Library Annex",
    date: "Found Aug 27, 2026",
    icon: Notebook,
    gradient: "from-[#3F6C63] to-[#2C4D46]",
    statusClass: "bg-[#E7EEEC] text-[#3F6C63]",
  },
];

export default function ClientDashboard() {
  return (
    <div className="pb-16">
      {/* Stats */}
      <div className="mb-[26px] grid grid-cols-4 gap-4">
        <StatCard
          label="Items I've reported"
          number="6"
          description="2 lost · 4 found"
        />

        <StatCard
          label="Active claims"
          number="1"
          description="Awaiting admin review"
        />

        <StatCard
          label="Items returned to me"
          number="2"
          description="Last: Aug 29"
        />

        <StatCard
          label="Nearby matches"
          number="3"
          description="Check similar items"
          danger
        />
      </div>

      {/* Action buttons */}
      <div className="mb-[22px] flex gap-3">
        <button className="flex items-center justify-center gap-2 rounded-lg bg-[#E3963E] px-[18px] py-2.5 text-[13.5px] font-semibold text-white transition hover:bg-[#C97A28]">
          <Plus size={15} />
          Report a lost item
        </button>

        <button className="flex items-center justify-center gap-2 rounded-lg border border-[#E2DDD0] bg-white px-[18px] py-2.5 text-[13.5px] font-semibold text-[#1B2430] transition hover:border-[#1B2430]">
          <Plus size={15} />
          Report a found item
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 border-b border-[#E2DDD0]">
        {["Recent items", "My lost reports", "My found reports", "My claims"].map(
          (tab, index) => (
            <button
              key={tab}
              className={`border-b-2 px-4 py-2.5 text-[13.5px] font-semibold ${
                index === 0
                  ? "border-[#E3963E] text-[#1B2430]"
                  : "border-transparent text-[#83796A]"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Section heading */}
      <div className="mb-3.5 flex items-baseline justify-between">
        <h2 className="font-serif text-lg font-semibold text-[#1B2430]">
          Recently reported near you
        </h2>

        <button className="border-b border-dotted border-[#83796A] text-[12.5px] text-[#83796A]">
          See all items
        </button>
      </div>

      {/* Items */}
      <div className="grid grid-cols-3 gap-[18px]">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="overflow-hidden rounded-xl border border-[#E2DDD0] bg-white"
            >
              <div
                className={`flex h-[118px] items-center justify-center bg-linear-to-br ${item.gradient} text-white/85`}
              >
                <Icon size={34} strokeWidth={1.5} />
              </div>

              <div className="p-[14px_15px_16px]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[14.5px] font-semibold text-[#1B2430]">
                      {item.title}
                    </div>

                    <div className="mt-0.5 text-[11px] text-[#83796A]">
                      {item.category}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-[9px] py-[3px] text-[10.5px] font-bold tracking-wide ${item.statusClass}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-col gap-1 text-xs text-[#83796A]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {item.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  number,
  description,
  danger = false,
}: {
  label: string;
  number: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#E2DDD0] bg-white px-[18px] pb-4 pt-[18px]">
      <div className="absolute right-0 top-0 h-[34px] w-[34px] rounded-bl-xl bg-[#F6F3EC]" />

      <div className="text-xs tracking-wide text-[#83796A]">
        {label}
      </div>

      <div className="mt-1.5 font-serif text-[30px] text-[#1B2430]">
        {number}
      </div>

      <div
        className={`mt-2 text-[11.5px] ${
          danger ? "text-[#B6503A]" : "text-[#3F6C63]"
        }`}
      >
        {description}
      </div>
    </div>
  );
}