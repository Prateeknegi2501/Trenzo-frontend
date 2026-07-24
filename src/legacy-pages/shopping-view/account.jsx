"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { Package, MapPin, User, ChevronRight } from "lucide-react";

const tabs = [
  { id: "orders", label: "My Orders", icon: Package, desc: "Track and manage your orders" },
  { id: "addresses", label: "Addresses", icon: MapPin, desc: "Manage delivery addresses" },
  { id: "profile", label: "Profile", icon: User, desc: "Account information" },
];

function ShoppingAccount() {
  const [activeTab, setActiveTab] = useState("orders");
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="bg-[#0a0a0a] py-12 px-6">
        <div className="max-w-[1200px] mx-auto flex items-center gap-6">
          <div className="w-16 h-16 bg-[#c8a96e] text-[#0a0a0a] text-2xl font-black flex items-center justify-center">
            {user?.userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-1">My Account</p>
            <h1 className="text-3xl font-black text-white tracking-tight">{user?.userName}</h1>
            <p className="text-white/50 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

          {/* Sidebar */}
          <aside className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 p-4 text-left transition-all duration-200 border ${
                    isActive
                      ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                      : "bg-white text-[#0a0a0a] border-[#e8e4de] hover:border-[#c8a96e]"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#c8a96e]" : "text-[#aaa]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold tracking-wide ${isActive ? "text-white" : "text-[#0a0a0a]"}`}>
                      {tab.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/50" : "text-[#aaa]"}`}>{tab.desc}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#c8a96e]" : "text-[#ddd]"}`} />
                </button>
              );
            })}
          </aside>

          {/* Content */}
          <main className="bg-white border border-[#e8e4de] p-8 min-h-[500px]">
            {activeTab === "orders" && (
              <div>
                <div className="mb-8">
                  <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-1">History</p>
                  <h2 className="text-2xl font-black text-[#0a0a0a]">My Orders</h2>
                </div>
                <ShoppingOrders />
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <div className="mb-8">
                  <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-1">Saved</p>
                  <h2 className="text-2xl font-black text-[#0a0a0a]">Delivery Addresses</h2>
                  <p className="text-sm text-[#888] mt-1">You can save up to 3 addresses</p>
                </div>
                <Address />
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <div className="mb-8">
                  <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-1">Details</p>
                  <h2 className="text-2xl font-black text-[#0a0a0a]">Profile Information</h2>
                </div>
                <div className="space-y-6 max-w-md">
                  {[
                    { label: "Full Name", value: user?.userName },
                    { label: "Email Address", value: user?.email },
                    { label: "Account Type", value: user?.role === "admin" ? "Administrator" : "Customer" },
                  ].map(({ label, value }) => (
                    <div key={label} className="border-b border-[#e8e4de] pb-4">
                      <p className="text-xs text-[#aaa] uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-sm font-semibold text-[#0a0a0a]">{value || "—"}</p>
                    </div>
                  ))}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-2 bg-[#f5f3ef] border border-[#e8e4de] px-4 py-2 text-xs text-[#888] uppercase tracking-widest">
                      Password changes coming soon
                    </span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
