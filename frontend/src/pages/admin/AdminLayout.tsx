import { Outlet } from "react-router";
import SidebarAdmin from "@/components/common/SidebarAdmin";
import HeaderAdmin from "@/components/common/HeaderAdmin";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#F6F3EC]">
      <SidebarAdmin />

      <div className="min-w-0 flex-1">
        <HeaderAdmin />

        <main className="px-25 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}