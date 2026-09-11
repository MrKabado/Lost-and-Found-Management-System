import type  { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F6F3EC]">
      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  );
}