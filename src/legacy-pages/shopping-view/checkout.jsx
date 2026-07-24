"use client";

import Address from "@/components/shopping-view/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const totalCartAmount = cartItems?.items?.length > 0
    ? cartItems.items.reduce((sum, item) => sum + (item?.salePrice > 0 ? item?.salePrice : item?.price) * item?.quantity, 0)
    : 0;

  const shipping = totalCartAmount > 100 ? 0 : 9.99;
  const tax = totalCartAmount * 0.08;
  const orderTotal = totalCartAmount + shipping + tax;

  function handleInitiatePaypalPayment() {
    if (!cartItems?.items?.length) {
      return toast({ title: "Your cart is empty", variant: "destructive" });
    }
    if (!currentSelectedAddress) {
      return toast({ title: "Please select a delivery address", variant: "destructive" });
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: orderTotal,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      setIsPaymentStart(data?.payload?.success || false);
    });
  }

  useEffect(() => {
    if (approvalURL) window.location.href = approvalURL;
  }, [approvalURL]);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Page header */}
      <div className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Secure Checkout</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Complete Your Order</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

          {/* Left — Address */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#c8a96e] text-[#0a0a0a] text-xs font-black flex items-center justify-center">1</div>
                <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">Delivery Address</h2>
              </div>
              <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#e8e4de]">
              {[
                { icon: Truck, label: "Free Shipping", sub: "Orders over $100" },
                { icon: RotateCcw, label: "Free Returns", sub: "30-day policy" },
                { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit SSL" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2 p-4 bg-white border border-[#e8e4de]">
                  <Icon className="w-5 h-5 text-[#c8a96e]" />
                  <p className="text-xs font-bold text-[#0a0a0a] uppercase tracking-wide">{label}</p>
                  <p className="text-[10px] text-[#aaa]">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e4de] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#c8a96e] text-[#0a0a0a] text-xs font-black flex items-center justify-center">2</div>
                <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">Order Summary</h2>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-1">
                {cartItems?.items?.map((item) => (
                  <UserCartItemsContent key={item.productId} cartItem={item} />
                ))}
              </div>

              <div className="border-t border-[#e8e4de] pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Subtotal</span>
                  <span>${totalCartAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
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

            {/* Payment button */}
            <button
              onClick={handleInitiatePaypalPayment}
              disabled={isPaymentStart}
              className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {isPaymentStart ? "Redirecting to PayPal..." : "Pay with PayPal"}
            </button>

            <p className="text-center text-xs text-[#aaa] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c8a96e]" />
              Your payment is secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
