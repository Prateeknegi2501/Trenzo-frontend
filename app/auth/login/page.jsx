import RouteGuard from "@/components/common/route-guard";
import AuthLogin from "@/legacy-pages/auth/login";

export default function Page() {
  return (
    <RouteGuard guestOnly>
      <AuthLogin />
    </RouteGuard>
  );
}
