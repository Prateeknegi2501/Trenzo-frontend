"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BrandedLoader } from "./root-redirect";

export default function RouteGuard({
  children,
  requireAuth = false,
  guestOnly = false,
  requiredRole,
  redirectAuthenticatedTo,
  redirectUnauthorizedTo = "/unauth-page",
  redirectUnauthenticatedTo = "/auth/login",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoading) return;

    // Logged-in user hitting a guest-only page (login / register)
    if (guestOnly && isAuthenticated) {
      router.replace(
        redirectAuthenticatedTo ||
          (user?.role === "admin" ? "/admin/dashboard" : "/shop/home")
      );
      return;
    }

    // Unauthenticated user hitting a protected page
    if (requireAuth && !isAuthenticated) {
      router.replace(redirectUnauthenticatedTo);
      return;
    }

    // Wrong role
    if (requireAuth && requiredRole && isAuthenticated && user?.role !== requiredRole) {
      router.replace(redirectUnauthorizedTo);
      return;
    }

    // Admin trying to access shop pages
    if (requireAuth && pathname?.startsWith("/shop") && isAuthenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [
    guestOnly, isAuthenticated, isLoading, pathname,
    redirectAuthenticatedTo, redirectUnauthenticatedTo,
    redirectUnauthorizedTo, requiredRole, requireAuth,
    router, user?.role,
  ]);

  // ── Block rendering until auth is resolved ──────────────────────────────
  // isLoading  → checkAuth still in-flight, show loader
  if (isLoading) return <BrandedLoader />;

  // Auth resolved but redirect hasn't fired yet — keep loader so the
  // login form / protected page never flashes before navigation completes
  if (guestOnly && isAuthenticated) return <BrandedLoader />;
  if (requireAuth && !isAuthenticated) return <BrandedLoader />;
  if (requireAuth && requiredRole && user?.role !== requiredRole) return <BrandedLoader />;
  if (requireAuth && pathname?.startsWith("/shop") && user?.role === "admin") return <BrandedLoader />;

  return children;
}
