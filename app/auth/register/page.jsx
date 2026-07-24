import RouteGuard from "@/components/common/route-guard";
import AuthRegister from "@/legacy-pages/auth/register";

export default function Page() {
  return (
    <RouteGuard guestOnly>
      <AuthRegister />
    </RouteGuard>
  );
}
