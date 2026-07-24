"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

function PaymentSuccessPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const checkRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(checkRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" })
      .fromTo(
        containerRef.current.querySelectorAll(".animate-in"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-6">
      <div ref={containerRef} className="max-w-md w-full text-center">
        {/* Check icon */}
        <div ref={checkRef} className="w-20 h-20 bg-[#0a0a0a] mx-auto flex items-center justify-center mb-8">
          <CheckCircle className="w-10 h-10 text-[#c8a96e]" />
        </div>

        <p className="animate-in text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-3">
          Order Confirmed
        </p>
        <h1 className="animate-in text-4xl font-black text-[#0a0a0a] tracking-tight mb-4">
          Payment Successful!
        </h1>
        <p className="animate-in text-[#888] text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly. You'll receive a confirmation email soon.
        </p>

        <div className="animate-in flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/shop/account")}
            className="flex items-center justify-center gap-2 bg-[#0a0a0a] text-white px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300"
          >
            <Package className="w-4 h-4" /> Track Order
          </button>
          <button
            onClick={() => router.push("/shop/home")}
            className="flex items-center justify-center gap-2 border border-[#e8e4de] text-[#0a0a0a] px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors duration-300"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
