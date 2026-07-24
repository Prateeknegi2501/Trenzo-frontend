"use client";

import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

const initialState = { userName: "", email: "", password: "" };

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
    );
  }, []);

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    dispatch(registerUser(formData)).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        setTimeout(() => router.push("/auth/login"), 300);
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-2">Join us</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">Create Account</h1>
        <p className="text-[#888] text-sm mt-1">Start your TRENZO journey today</p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        buttonText={loading ? "Creating account..." : "Create Account"}
        disabled={loading}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e8e4de]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#faf9f7] px-3 text-[#aaa] uppercase tracking-widest">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-[#666]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-[#0a0a0a] font-semibold hover:text-[#c8a96e] transition-colors underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default AuthRegister;
