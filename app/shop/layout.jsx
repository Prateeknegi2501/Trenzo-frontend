import RouteGuard from "@/components/common/route-guard";
import ShoppingLayout from "@/components/shopping-view/layout";

export default function Layout({ children }) {
  return (
    <RouteGuard requireAuth>
      <ShoppingLayout>{children}</ShoppingLayout>
    </RouteGuard>
  );
}
