"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import { deleteCartItem, fetchCartItems, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import Address from "@/components/shopping-view/address";

function ShoppingCart() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  useEffect(() => {
    if (user?.id) dispatch(fetchCartItems(user.id));
  }, [dispatch, user?.id]);

  const items = cartItems?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item?.salePrice > 0 ? item?.salePrice : item?.price) * item?.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  function handleUpdateQuantity(item, type) {
    if (type === "plus") {
      const stock = productList?.find((p) => p._id === item?.productId)?.totalStock;
      if (stock && item.quantity + 1 > stock) {
        return toast({ title: `Only ${item.quantity} in stock`, variant: "destructive" });
      }
    }
    dispatch(updateCartQuantity({
      userId: user?.id,
      productId: item?.productId,
      quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
    }));
  }

  function handleDelete(item) {
    dispatch(deleteCartItem({ userId: user?.id, productId: item?.productId })).then((data) => {
      if (data?.payload?.success) toast({ title: "Item removed" });
    });
  }

  function handleProceed() {
    if (!items.length) return toast({ title: "Your cart is empty", variant: "destructive" });
    if (!currentSelectedAddress) return toast({ title: "Please select a delivery address", variant: "destructive" });
    sessionStorage.setItem("selectedAddress", JSON.stringify(currentSelectedAddress));
    router.push("/shop/checkout");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Your Cart
          </h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <ShoppingBag className="w-16 h-16 text-[#e8e4de] mb-6" />
            <p className="text-xl font-black text-[#0a0a0a] mb-2">
              Your cart is empty
            </p>
            <p className="text-sm text-[#aaa] mb-8">
              Add some items to get started
            </p>
            <button
              onClick={() => router.push("/shop/listing")}
              className="px-8 py-3 bg-[#0a0a0a] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* Left column — items + address */}
            <div className="space-y-8">
              {/* Cart items */}
              <div className="bg-white border border-[#e8e4de]">
                {/* Delivery address */}
                <div className="bg-white border border-[#e8e4de] p-6">
                  <div className="flex items-center gap-3 mb-6">
                   
                    <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">
                      Delivery Address
                    </h2>
                  </div>
                  <Address
                    selectedId={currentSelectedAddress}
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                  />
                </div>
                <div className="px-6 py-4 border-b border-[#e8e4de]">
                  <h2 className="text-sm font-black text-[#0a0a0a] tracking-[0.2em] uppercase">
                    {items.length} Item{items.length !== 1 ? "s" : ""}
                  </h2>
                </div>
                <div className="divide-y divide-[#f0ede8]">
                  {items.map((item) => {
                    const price =
                      item?.salePrice > 0 ? item?.salePrice : item?.price;
                    return (
                      <div key={item.productId} className="flex gap-5 p-6">
                        <div className="w-24 h-24 bg-[#f5f3ef] flex-shrink-0 overflow-hidden">
                          <img
                            src={item?.image}
                            alt={item?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#0a0a0a] leading-snug mb-1">
                            {item?.title}
                          </h3>
                          <p className="text-xs text-[#aaa] mb-3">
                            ${price.toFixed(2)} each
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(item, "minus")
                              }
                              disabled={item.quantity === 1}
                              className="w-7 h-7 border border-[#e8e4de] flex items-center justify-center text-[#666] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold text-[#0a0a0a] w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item, "plus")}
                              className="w-7 h-7 border border-[#e8e4de] flex items-center justify-center text-[#666] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <span className="text-sm font-black text-[#0a0a0a]">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-[#ccc] hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column — order summary */}
            <div className="space-y-4">
              <div className="bg-white border border-[#e8e4de] p-6">
                <h2 className="text-sm font-black text-[#0a0a0a] tracking-[0.2em] uppercase mb-6">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-6">
                  {items.map((item) => {
                    const price =
                      item?.salePrice > 0 ? item?.salePrice : item?.price;
                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm text-[#666]"
                      >
                        <span className="truncate mr-4">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="flex-shrink-0">
                          ${(price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-[#e8e4de] pt-4 space-y-2.5">
                  <div className="flex justify-between text-sm text-[#666]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666]">
                    <span>Shipping</span>
                    <span
                      className={
                        shipping === 0 ? "text-green-600 font-medium" : ""
                      }
                    >
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666]">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-[#0a0a0a] pt-3 border-t border-[#e8e4de]">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full py-4 bg-[#0a0a0a] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => router.push("/shop/listing")}
                className="w-full py-3 border border-[#e8e4de] text-xs font-medium text-[#666] tracking-widest uppercase hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
