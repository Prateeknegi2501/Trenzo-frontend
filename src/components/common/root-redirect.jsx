"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function RootRedirect() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    router.replace(user?.role === "admin" ? "/admin/dashboard" : "/shop/home");
  }, [isAuthenticated, isLoading, router, user?.role]);

  return <BrandedLoader />;
}

export function BrandedLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-[#c8a96e] flex items-center justify-center">
          <span className="text-[#0a0a0a] text-lg font-black">T</span>
        </div>
        <span className="text-white text-2xl font-black tracking-[0.2em]">TRENZO</span>
      </div>
      <div className="w-40 h-0.5 bg-white/10 overflow-hidden">
        <div className="h-full w-1/2 bg-[#c8a96e] animate-[slideBar_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
