"use client";

import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { gsap } from "gsap";

const initialState = { email: "", password: "" };

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    dispatch(loginUser(formData)).then((data) => {
      setLoading(false);
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        setTimeout(() => router.push("/"), 300);
      } else {
        toast({ title: data?.payload?.message, variant: "destructive" });
      }
    });
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-2">Welcome back</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0a0a0a]">Sign In</h1>
        <p className="text-[#888] text-sm mt-1">Access your TRENZO account</p>
      </div>

      <div className="space-y-4">
        <CommonForm
          formControls={loginFormControls}
          buttonText={loading ? "Signing in..." : "Sign In"}
          formData={formData}
          disabled={loading}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#e8e4de]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#faf9f7] px-3 text-[#aaa] uppercase tracking-widest">or</span>
        </div>
      </div>

      <p className="text-center text-sm text-[#666]">
        New to TRENZO?{" "}
        <Link href="/auth/register" className="text-[#0a0a0a] font-semibold hover:text-[#c8a96e] transition-colors underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default AuthLogin;
