"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const video = "/assets/Video.mp4";

function AuthLayout({ children }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(leftRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" })
      .fromTo(rightRef.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.7")
      .fromTo(logoRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.4")
      .fromTo(taglineRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2");
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#0a0a0a]">
      {/* Left — video panel */}
      <div ref={leftRef} className="relative hidden lg:flex items-center justify-center w-1/2 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          autoPlay loop muted playsInline
        >
          <source src={video} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent" />

        {/* Decorative border lines */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#c8a96e]/60" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#c8a96e]/60" />

        <div className="relative z-10 text-center px-12 space-y-6">
          <div ref={logoRef}>
            <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase mb-3 font-light">Premium Fashion</p>
            <h1 className="text-6xl font-black tracking-tight text-white leading-none">
              TRENZO
            </h1>
            <div className="w-16 h-0.5 bg-[#c8a96e] mx-auto mt-4" />
          </div>
          <div ref={taglineRef}>
            <p className="text-white/70 text-lg font-light leading-relaxed max-w-xs mx-auto">
              Curated collections for the discerning individual
            </p>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div
        ref={rightRef}
        className="flex flex-1 items-center justify-center bg-[#faf9f7] px-6 py-12 sm:px-10 lg:px-16"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <h1 className="text-4xl font-black tracking-tight text-[#0a0a0a]">TRENZO</h1>
            <div className="w-10 h-0.5 bg-[#c8a96e] mx-auto mt-2" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
