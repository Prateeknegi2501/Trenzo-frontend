"use client";

import { useRouter } from "next/navigation";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag, ArrowRight } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const router = useRouter();

  const totalCartAmount = cartItems?.length > 0
    ? cartItems.reduce((sum, item) => sum + (item?.salePrice > 0 ? item?.salePrice : item?.price) * item?.quantity, 0)
    : 0;

  return (
    <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-white border-l border-[#e8e4de] p-0">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#e8e4de]">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-[#c8a96e]" />
          <div>
            <h2 className="text-sm font-black text-[#0a0a0a] tracking-[0.2em] uppercase">Your Bag</h2>
            <p className="text-xs text-[#aaa]">{cartItems?.length || 0} item{cartItems?.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {cartItems?.length > 0 ? (
          cartItems.map((item) => (
            <UserCartItemsContent key={item.productId} cartItem={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <ShoppingBag className="w-12 h-12 text-[#e8e4de] mb-4" />
            <p className="text-sm font-semibold text-[#0a0a0a] mb-1">Your bag is empty</p>
            <p className="text-xs text-[#aaa]">Add items to get started</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems?.length > 0 && (
        <div className="px-6 py-5 border-t border-[#e8e4de] space-y-4 bg-[#faf9f7]">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#888] uppercase tracking-widest">Subtotal</span>
            <span className="text-xl font-black text-[#0a0a0a]">${totalCartAmount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-[#aaa] text-center">Shipping & taxes calculated at checkout</p>
          <button
            onClick={() => { router.push("/shop/checkout"); setOpenCartSheet(false); }}
            className="w-full py-4 bg-[#0a0a0a] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
