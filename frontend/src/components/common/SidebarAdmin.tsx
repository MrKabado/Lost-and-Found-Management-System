import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  CircleCheck,
  Grid2X2,
  User,
  LogOut,
} from "lucide-react";

export default function SidebarAdmin() {
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-[#1B2430] px-4 py-[22px] text-[#EDEAE1]">
      {/* Brand */}
      <div className="mb-[18px] flex items-center gap-2.5 border-b border-[#38445466] px-2 pb-[22px]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="shrink-0 text-[#E3963E]"
        >
          <path d="M12 2 L21 11 L11 21 L2 12 Z" />
          <circle cx="7.5" cy="7.5" r="1.6" />
        </svg>

        <div className="font-serif text-[17px] leading-[1.1]">
          Lost&Found
          <span className="mt-0.5 block font-sans text-[10.5px] tracking-wider text-[#9AA3AC]">
            Admin Console
          </span>
        </div>
      </div>

      {/* Overview */}
      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] tracking-wider text-[#9AA3AC]">
        OVERVIEW
      </div>

      <nav className="flex flex-col gap-0.5">
        <a
          href="#"
          className="flex items-center gap-[11px] rounded-r-[7px] border-l-2 border-[#E3963E] bg-[#232E3B] px-2.5 py-[9px] text-sm text-white"
        >
          <LayoutDashboard size={17} />
          Dashboard
        </a>
      </nav>

      {/* Manage */}
      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] tracking-wider text-[#9AA3AC]">
        MANAGE
      </div>

      <nav className="flex flex-col gap-0.5">
        <SidebarLink
          icon={<Heart size={17} />}
          label="Lost Items"
          count="48"
        />

        <SidebarLink
          icon={<ShoppingBag size={17} />}
          label="Found Items"
          count="63"
        />

        <SidebarLink
          icon={<CircleCheck size={17} />}
          label="Claims"
          count="12"
        />

        <SidebarLink icon={<Grid2X2 size={17} />} label="Categories" />

        <SidebarLink icon={<User size={17} />} label="Users" />
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-[#38445466] pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-[#232E3B] px-2.5 py-[9px] text-[12.5px] text-[#C7C1B3]">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#E3963E]" />
          Signed in as Admin
        </div>

        <a
          href="#"
          className="mt-2 flex items-center gap-[11px] rounded-[7px] px-2.5 py-[9px] text-sm text-[#D9D5C9] hover:bg-[#232E3B] hover:text-white"
        >
          <LogOut size={17} />
          Log out
        </a>
      </div>
    </aside>
  );
}

function SidebarLink({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count?: string;
}) {
  return (
    <a
      href="#"
      className="flex items-center gap-[11px] rounded-[7px] border-l-2 border-transparent px-2.5 py-[9px] text-sm text-[#D9D5C9] hover:bg-[#232E3B] hover:text-white"
    >
      {icon}

      {label}

      {count && (
        <span className="ml-auto rounded-full bg-[#313D4C] px-[7px] py-[1px] text-[11px] text-[#C7C1B3]">
          {count}
        </span>
      )}
    </a>
  );
}