import { Outlet } from "react-router";
import SidebarClient from "@/components/common/SidebarClient";
import HeaderClient from "@/components/common/HeaderClient";

export default function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-[#F6F3EC]">
      <SidebarClient />

      <div className="min-w-0 flex-1">
        <HeaderClient />

        <main className="px-7 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}