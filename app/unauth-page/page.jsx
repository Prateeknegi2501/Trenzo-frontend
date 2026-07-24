import RouteGuard from "@/components/common/route-guard";
import UnauthPage from "@/legacy-pages/unauth-page";

export default function Page() {
  return (
    <RouteGuard requireAuth>
      <UnauthPage />
    </RouteGuard>
  );
}
