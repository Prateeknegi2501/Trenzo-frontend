import ShoppingHeader from "./header";

function ShoppingLayout({ children }) {
  return (
    <div className="flex flex-col bg-[#faf9f7] min-h-screen">
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-1">
        {children}
      </main>
      <footer className="bg-[#0a0a0a] text-white py-12 px-6 mt-auto">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-[#c8a96e] flex items-center justify-center">
                <span className="text-[#0a0a0a] text-xs font-black">T</span>
              </div>
              <span className="text-sm font-black tracking-[0.15em]">TRENZO</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">Premium fashion for the modern individual.</p>
          </div>
          {[
            { title: "Shop", links: ["Men", "Women", "Kids", "Accessories", "Footwear"] },
            { title: "Help", links: ["FAQ", "Shipping", "Returns", "Size Guide", "Contact"] },
            { title: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-[#c8a96e] text-[10px] tracking-[0.3em] uppercase font-medium mb-4">{title}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <span className="text-white/40 text-xs hover:text-white/80 transition-colors cursor-pointer">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">© 2026 TRENZO. All rights reserved.</p>
          <p className="text-white/30 text-xs">Designed with ♥ for premium fashion</p>
        </div>
      </footer>
    </div>
  );
}

export default ShoppingLayout;
