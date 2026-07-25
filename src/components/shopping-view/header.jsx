"use client";

import { LogOut, Menu, Search, ShoppingBag, UserCog, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { useEffect, useState, useRef } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MenuItems({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    if (pathname.includes("listing") && currentFilter !== null) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", getCurrentMenuItem.id);
      router.push(`/shop/listing?${params.toString()}`);
    } else {
      router.push(getCurrentMenuItem.path);
    }
    onClose?.();
  }

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-0">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <button
          key={menuItem.id}
          onClick={() => handleNavigate(menuItem)}
          className="relative px-4 py-2 text-sm font-medium tracking-wide text-[#1a1a1a] hover:text-[#c8a96e] transition-colors duration-200 group"
        >
          {menuItem.label}
          <span className="absolute bottom-0 left-4 right-4 h-px bg-[#c8a96e] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </button>
      ))}
    </nav>
  );
}

function HeaderRightContent({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const router = useRouter();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const cartCount = cartItems?.items?.length || 0;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => { router.push("/shop/search"); onClose?.(); }}
        className="p-2 text-[#1a1a1a] hover:text-[#c8a96e] transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>

      <button
        onClick={() => { router.push("/shop/cart"); onClose?.(); }}
        className="relative p-2 text-[#1a1a1a] hover:text-[#c8a96e] transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#c8a96e] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-8 h-8 rounded-full bg-[#0a0a0a] text-white text-xs font-bold flex items-center justify-center hover:bg-[#c8a96e] transition-colors">
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" className="w-56 mt-2 border-[#e8e4de]">
          <DropdownMenuLabel className="text-xs text-[#888] uppercase tracking-wider font-normal">
            {user?.userName}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/shop/account")} className="cursor-pointer">
            <UserCog className="mr-2 h-4 w-4" /> My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const headerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[#e8e4de]"
          : "bg-white border-b border-[#e8e4de]"
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-[#0a0a0a] text-white text-center py-2 text-xs tracking-[0.2em] uppercase font-light">
        Free shipping on orders over $100 · New arrivals weekly
      </div>

      <div className="flex h-16 items-center justify-between px-6 md:px-10 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link href="/shop/home" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#0a0a0a] flex items-center justify-center">
            <span className="text-[#c8a96e] text-xs font-black">T</span>
          </div>
          <span className="text-xl font-black tracking-[0.15em] text-[#0a0a0a] group-hover:text-[#c8a96e] transition-colors">
            TRENZO
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex">
          <HeaderRightContent />
        </div>

        {/* Mobile menu */}
        <div className="flex lg:hidden items-center gap-2">
          <HeaderRightContent onClose={() => setMobileOpen(false)} />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#0a0a0a]">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-white border-r border-[#e8e4de] pt-16">
              <div className="mb-8">
                <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-1">Navigation</p>
                <div className="w-8 h-px bg-[#c8a96e]" />
              </div>
              <MenuItems onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
