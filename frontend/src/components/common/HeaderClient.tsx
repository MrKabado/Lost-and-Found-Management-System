import { useAuth } from "@/auth/useAuth";
import { getStorageUrl } from "@/lib/client";

export default function HeaderClient() {
  const { user } = useAuth();
  const initials = user?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-10 flex h-[68px] items-center justify-between border-b border-[#DCE4F0] bg-white px-7">
      <div>
        <h1 className="font-sans text-[19px] font-semibold text-[#092354]">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}
        </h1>

        <div className="mt-0.5 text-[12.5px] text-[#61708A]">
          Keep track of your campus reports and claim updates.
        </div>
      </div>

      <div className="flex items-center gap-3">

        {/* Avatar */}
        <div className="h-9 w-9 overflow-hidden rounded-full bg-[#0B2A6F] font-sans text-sm text-white">
          {user?.student_profile?.profile_image ? (
            <img
              src={getStorageUrl(user.student_profile.profile_image) ?? undefined}
              alt={`${user.name}'s profile`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}