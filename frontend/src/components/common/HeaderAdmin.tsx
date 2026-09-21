import { useAuth } from "@/auth/useAuth";

export default function HeaderAdmin() {
  const { user } = useAuth();
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#DCE4F0] bg-white px-7">
      <div>
        <h1 className="font-sans text-[19px] font-semibold tracking-[0.01em] text-[#092354]">
          {user?.name ?? "Admin overview"}
        </h1>

        <p className="mt-0.5 text-[12.5px] text-[#83796A]">
          Review campus reports and help return belongings to their owners.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B2A6F] font-sans text-sm text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}