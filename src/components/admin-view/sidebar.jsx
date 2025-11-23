import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket size={20} />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck size={20} />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="mt-8 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen && setOpen(false);
            }}
            className={`flex cursor-pointer items-center gap-5 rounded-xl px-4 py-3 my-1 text-[16px] transition-all 
              ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <span
              className={`transition ${
                isActive ? "text-white" : "text-muted-foreground"
              }`}
            >
              {menuItem.icon}
            </span>
            <span className="font-medium">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0 border-r flex flex-col">
          <SheetHeader className="border-b px-6 py-5 bg-muted/50">
            <SheetTitle className="flex items-center gap-3">
              <ChartNoAxesCombined size={32} className="text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
            </SheetTitle>
          </SheetHeader>

          <div className="px-4">
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-background py-6 px-6 shadow-sm">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-6"
        >
          <ChartNoAxesCombined size={32} className="text-primary" />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Admin Panel
          </h1>
        </div>

        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
