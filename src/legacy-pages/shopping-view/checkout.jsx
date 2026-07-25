"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Truck, RotateCcw, Lock, MapPin } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const items = cartItems?.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + (item?.salePrice > 0 ? item?.salePrice : item?.price) * item?.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAddress");
    if (stored) setSelectedAddress(JSON.parse(stored));
    else router.replace("/shop/cart");
  }, []);

  useEffect(() => {
    if (approvalURL) window.location.href = approvalURL;
  }, [approvalURL]);

  function handleInitiatePaypalPayment() {
    console.log("payment initiated")
    if (!items.length) return toast({ title: "Your cart is empty", variant: "destructive" });
    if (!selectedAddress) return toast({ title: "No address found", variant: "destructive" });

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: {
        addressId: selectedAddress?._id,
        address: selectedAddress?.address,
        city: selectedAddress?.city,
        pincode: selectedAddress?.pincode,
        phone: selectedAddress?.phone,
        notes: selectedAddress?.notes,
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

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div>
            <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Step 2</p>
            <h1 className="text-3xl font-black text-white tracking-tight">Order Preview</h1>
          </div>
          <button
            onClick={() => router.push("/shop/cart")}
            className="text-xs text-[#aaa] hover:text-[#c8a96e] transition-colors tracking-widest uppercase"
          >
            ← Edit Cart
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Left — read-only address + trust badges */}
          <div className="space-y-8">

            {/* Delivery address — read only */}
            <div className="bg-white border border-[#e8e4de] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 bg-[#c8a96e] text-[#0a0a0a] text-xs font-black flex items-center justify-center">1</div>
                <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">Delivering To</h2>
              </div>
              {selectedAddress && (
                <div className="flex items-start gap-3 p-4 border border-[#c8a96e] bg-[#fdf8f0]">
                  <MapPin className="w-4 h-4 text-[#c8a96e] mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-[#0a0a0a]">{selectedAddress?.address}</p>
                    <p className="text-xs text-[#666]">{selectedAddress?.city} — {selectedAddress?.pincode}</p>
                    <p className="text-xs text-[#888]">{selectedAddress?.phone}</p>
                    {selectedAddress?.notes && (
                      <p className="text-xs text-[#aaa] italic">"{selectedAddress?.notes}"</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Items — read only */}
            <div className="bg-white border border-[#e8e4de]">
              <div className="px-6 py-4 border-b border-[#e8e4de] flex items-center gap-3">
                <div className="w-7 h-7 bg-[#c8a96e] text-[#0a0a0a] text-xs font-black flex items-center justify-center">2</div>
                <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">Order Items</h2>
              </div>
              <div className="divide-y divide-[#f0ede8]">
                {items.map((item) => {
                  const price = item?.salePrice > 0 ? item?.salePrice : item?.price;
                  return (
                    <div key={item.productId} className="flex gap-4 p-5">
                      <div className="w-16 h-16 bg-[#f5f3ef] flex-shrink-0 overflow-hidden">
                        <img src={item?.image} alt={item?.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#0a0a0a] leading-snug">{item?.title}</p>
                        <p className="text-xs text-[#aaa] mt-0.5">Qty: {item.quantity} × ${price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-black text-[#0a0a0a] flex-shrink-0">
                        ${(price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4">
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

          {/* Right — totals + pay */}
          <div className="space-y-4">
            <div className="bg-white border border-[#e8e4de] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#c8a96e] text-[#0a0a0a] text-xs font-black flex items-center justify-center">3</div>
                <h2 className="text-lg font-black text-[#0a0a0a] tracking-wide uppercase">Total</h2>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-[#666]">
                  <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0a0a0a] pt-3 border-t border-[#e8e4de]">
                  <span>Total</span><span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

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
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
