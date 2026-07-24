import AdminLayout from "@/components/admin-view/layout";
import RouteGuard from "@/components/common/route-guard";

export default function Layout({ children }) {
  return (
    <RouteGuard requireAuth requiredRole="admin">
      <AdminLayout>{children}</AdminLayout>
    </RouteGuard>
  );
}
