import {
  LayoutDashboard,
  Heart,
  ShoppingBag,
  CircleCheck,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "@/auth/useAuth";
import { useEffect, useState } from "react";
import { getClaims, getFoundItems, getLostItems } from "@/lib/client";
import { toast } from "sonner";

export default function SidebarClient() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [counts, setCounts] = useState({ lost: 0, found: 0, claims: 0 });

  useEffect(() => {
    Promise.all([getLostItems(), getFoundItems(), getClaims()]).then(([lost, found, claims]) => {
      setCounts({ lost: lost.length, found: found.length, claims: claims.length });
    }).catch(() => undefined);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("You have been logged out.");
    navigate("/login", { replace: true });
  };

  const navItems = [
    { label: "Dashboard", to: "/client", icon: LayoutDashboard },
    { label: "My Lost Reports", to: "/client/lost-reports", icon: Heart, count: counts.lost },
    { label: "My Found Reports", to: "/client/found-reports", icon: ShoppingBag, count: counts.found },
    { label: "My Claims", to: "/client/claims", icon: CircleCheck, count: counts.claims },
    { label: "Browse Items", to: "/client/items", icon: Search },
    { label: "Profile", to: "/client/profile", icon: User },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-59 shrink-0 flex-col bg-[#092354] px-4 py-[22px] text-[#F5F8FC]">
      {/* Brand */}
      <div className="mb-[18px] flex items-center gap-2.5 border-b border-[#FFFFFF26] px-2 pb-[18px]">
        <img src="/school/logo.png" alt="Cordova Public College" className="h-10 w-10 rounded-full object-cover" />

        <div className="font-sans text-[17px] leading-tight">
          CPC Item Desk

          <span className="mt-0.5 block font-sans text-[10.5px] tracking-wider text-[#9AA3AC]">
            Cordova Public College
          </span>
        </div>
      </div>

      {/* Menu */}
      <div className="px-2.5 pb-1.5 pt-3.5 text-[10.5px] tracking-widest text-[#AFC0D9]">
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
                    ? "border-[#D9B85A] bg-[#15366F] text-white"
                    : "border-transparent text-[#D6E0EF] hover:bg-[#15366F] hover:text-white"
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
      <div className="mt-auto border-t border-[#FFFFFF26] pt-4">
        <div className="flex items-center gap-2 rounded-lg bg-[#15366F] px-2.5 py-[9px] text-xs text-[#D6E0EF]">
          <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#D9B85A]" />
          Signed in as {user?.name ?? "Client"}
        </div>

        <button
          type="button"
          onClick={() => void handleLogout()}
          className="mt-2 w-full flex items-center gap-[11px] rounded-md px-2.5 py-[9px] text-sm text-[#D6E0EF] hover:bg-[#15366F] hover:text-white"
        >
          <LogOut size={17} strokeWidth={1.8} />
          Log out
        </button>
      </div>
    </aside>
  );
}