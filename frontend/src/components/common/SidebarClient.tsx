import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  CircleCheck,
  Search,
  User,
  LogOut,
  Diamond,
} from "lucide-react";
import { NavLink } from "react-router";

export default function SidebarClient() {
  const navItems = [
    {
      label: "Dashboard",
      to: "/client",
      icon: LayoutDashboard,
    },
    {
      label: "My Lost Reports",
      to: "/client/lost-reports",
      icon: Heart,
      count: 4,
    },
    {
      label: "My Found Reports",
      to: "/client/found-reports",
      icon: ShoppingBag,
      count: 2,
    },
    {
      label: "My Claims",
      to: "/client/claims",
      icon: CircleCheck,
      count: 1,
    },
    {
      label: "Browse Items",
      to: "/client/items",
      icon: Search,
    },
    {
      label: "Profile",
      to: "/client/profile",
      icon: User,
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-59 shrink-0 flex-col bg-[#1B2430] px-4 py-[22px] text-[#EDEAE1]">
      {/* Brand */}
      <div className="mb-[18px] flex items-center gap-2.5 border-b border-[#38445466] px-2 pb-[22px]">
        <Diamond
          size={24}
          strokeWidth={1.6}
          className="text-[#E3963E]"
        />

        <div className="font-serif text-[17px] leading-tight">
          Lost&Found

          <span className="mt-0.5 block font-sans text-[10.5px] tracking-wider text-[#9AA3AC]">
            Client Portal
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] tracking-widest text-[#9AA3AC]">
        MENU
      </div>

      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/client"}
              className={({ isActive }) =>
                `flex items-center gap-[11px] rounded-md border-l-2 px-2.5 py-[9px] text-sm ${
                  isActive
                    ? "border-[#E3963E] bg-[#232E3B] text-white"
                    : "border-transparent text-[#D9D5C9] hover:bg-[#232E3B] hover:text-white"
                }`
              }
            >
              <Icon size={17} strokeWidth={1.8} />

              {item.label}

              {item.count !== undefined && (
                <span className="ml-auto rounded-full bg-[#313D4C] px-[7px] py-0.5 text-[11px] text-[#C7C1B3]">
                  {item.count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-[#38445466] pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-[#232E3B] px-2.5 py-[9px] text-xs text-[#C7C1B3]">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#3F6C63]" />
          Signed in as Client
        </div>

        <NavLink
          to="/login"
          className="mt-2 flex items-center gap-[11px] rounded-md px-2.5 py-[9px] text-sm text-[#D9D5C9] hover:bg-[#232E3B] hover:text-white"
        >
          <LogOut size={17} strokeWidth={1.8} />
          Log out
        </NavLink>
      </div>
    </aside>
  );
}