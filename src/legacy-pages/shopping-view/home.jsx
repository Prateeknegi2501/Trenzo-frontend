"use client";

const nike = "/assets/brands/nike.png";
const adidas = "/assets/brands/adidas.png";
const puma = "/assets/brands/puma.jpg";
const levi = "/assets/brands/levis.png";
const zara = "/assets/brands/zara.jpg";
const hm = "/assets/brands/hm.png";
const men = "/assets/categories/man.jpg";
const women = "/assets/categories/women.jpg";
const kids = "/assets/categories/kids.jpg";
const accessories = "/assets/categories/accessories.jpg";
const footwear = "/assets/categories/footwear.jpg";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useRouter } from "next/navigation";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categoriesWithIcon = [
  { id: "men", label: "Men", image: men },
  { id: "women", label: "Women", image: women },
  { id: "kids", label: "Kids", image: kids },
  { id: "accessories", label: "Accessories", image: accessories },
  { id: "footwear", label: "Footwear", image: footwear },
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", image: nike },
  { id: "adidas", label: "Adidas", image: adidas },
  { id: "puma", label: "Puma", image: puma },
  { id: "levi", label: "Levi's", image: levi },
  { id: "zara", label: "Zara", image: zara },
  { id: "h&m", label: "H&M", image: hm },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const categoriesRef = useRef(null);
  const brandsRef = useRef(null);
  const productsRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero entrance
    const tl = gsap.timeline();
    tl.fromTo(heroTextRef.current?.children || [],
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.3 }
    );

    // Categories scroll animation
    if (categoriesRef.current) {
      gsap.fromTo(
        categoriesRef.current.querySelectorAll(".category-card"),
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out",
          scrollTrigger: { trigger: categoriesRef.current, start: "top 80%" }
        }
      );
    }

    // Brands scroll animation
    if (brandsRef.current) {
      gsap.fromTo(
        brandsRef.current.querySelectorAll(".brand-card"),
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.4)",
          scrollTrigger: { trigger: brandsRef.current, start: "top 80%" }
        }
      );
    }

    // Products scroll animation
    if (productsRef.current) {
      gsap.fromTo(
        productsRef.current.querySelectorAll(".product-card"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out",
          scrollTrigger: { trigger: productsRef.current, start: "top 80%" }
        }
      );
    }

    // Stats counter animation
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll(".stat-item"),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" }
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    sessionStorage.setItem("filters", JSON.stringify({ [section]: [getCurrentItem.id] }));
    router.push("/shop/listing");
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to your bag" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (!featureImageList?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + (featureImageList?.length || 1)) % (featureImageList?.length || 1));
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % (featureImageList?.length || 1));

  return (
    <div className="flex flex-col min-h-screen bg-[#faf9f7]">

      {/* ── Hero Slider ── */}
      <section ref={heroRef} className="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-[#0a0a0a]">
        {featureImageList?.length > 0 ? (
          featureImageList.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
            >
              <img src={slide?.image} className="w-full h-full object-cover opacity-70" alt="" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a]" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Hero text */}
        <div ref={heroTextRef} className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 max-w-3xl">
          <p className="text-[#c8a96e] text-xs tracking-[0.5em] uppercase font-medium mb-4">New Collection 2024</p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
            Dress to<br />
            <span className="text-[#c8a96e]">Impress</span>
          </h1>
          <p className="text-white/70 text-lg font-light mb-8 max-w-md">
            Discover premium fashion curated for the modern individual.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/shop/listing")}
              className="group flex items-center gap-2 bg-[#c8a96e] text-[#0a0a0a] px-8 py-3.5 text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors duration-300"
            >
              Shop Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/shop/listing")}
              className="flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 text-sm font-medium tracking-wider uppercase hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors duration-300"
            >
              Explore
            </button>
          </div>
        </div>

        {/* Slider controls */}
        {featureImageList?.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-[#c8a96e] hover:border-[#c8a96e] transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-[#c8a96e] hover:border-[#c8a96e] transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {featureImageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 ${idx === currentSlide ? "w-8 h-1 bg-[#c8a96e]" : "w-2 h-1 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Stats Bar ── */}
      <section ref={statsRef} className="bg-[#0a0a0a] py-8">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "50K+", label: "Happy Customers" },
            { value: "1000+", label: "Premium Products" },
            { value: "50+", label: "Top Brands" },
            { value: "Free", label: "Returns & Exchanges" },
          ].map((stat) => (
            <div key={stat.label} className="stat-item">
              <p className="text-[#c8a96e] text-2xl font-black">{stat.value}</p>
              <p className="text-white/50 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section ref={categoriesRef} className="py-20 max-w-[1400px] mx-auto px-6 w-full">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Browse</p>
            <h2 className="text-4xl font-black text-[#0a0a0a] tracking-tight">Shop by Category</h2>
          </div>
          <button
            onClick={() => router.push("/shop/listing")}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-[#0a0a0a] hover:text-[#c8a96e] transition-colors group"
          >
            View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesWithIcon.map((category) => (
            <div
              key={category.id}
              onClick={() => handleNavigateToListingPage(category, "category")}
              className="category-card group cursor-pointer relative overflow-hidden aspect-[3/4] bg-[#f0ede8]"
            >
              <img
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-lg tracking-wide">{category.label}</p>
                <p className="text-[#c8a96e] text-xs tracking-widest uppercase mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Shop now →
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="bg-[#0a0a0a] py-20 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-3">Limited Time</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Up to <span className="text-[#c8a96e]">40% Off</span><br />
              Selected Items
            </h2>
          </div>
          <button
            onClick={() => router.push("/shop/listing")}
            className="group flex items-center gap-3 border border-[#c8a96e] text-[#c8a96e] px-10 py-4 text-sm font-bold tracking-wider uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-all duration-300 whitespace-nowrap"
          >
            Shop the Sale
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── Top Brands ── */}
      <section ref={brandsRef} className="py-20 max-w-[1400px] mx-auto px-6 w-full">
        <div className="text-center mb-12">
          <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Partners</p>
          <h2 className="text-4xl font-black text-[#0a0a0a] tracking-tight">Top Brands</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {brandsWithIcon.map((brand) => (
            <div
              key={brand.id}
              onClick={() => handleNavigateToListingPage(brand, "brand")}
              className="brand-card group cursor-pointer flex flex-col items-center justify-center p-6 bg-white border border-[#e8e4de] hover:border-[#c8a96e] hover:shadow-lg transition-all duration-300"
            >
              <img
                src={brand.image}
                alt={brand.label}
                className="w-14 h-14 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="text-xs font-semibold text-[#666] group-hover:text-[#0a0a0a] mt-3 tracking-wide uppercase transition-colors">
                {brand.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-20 bg-[#f5f3ef]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Handpicked</p>
              <h2 className="text-4xl font-black text-[#0a0a0a] tracking-tight">Featured Products</h2>
            </div>
            <button
              onClick={() => router.push("/shop/listing")}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-[#0a0a0a] hover:text-[#c8a96e] transition-colors group"
            >
              View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList?.slice(0, 8).map((product) => (
              <div key={product._id} className="product-card">
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={product}
                  handleAddtoCart={handleAddtoCart}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-[#0a0a0a] px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-3">Stay Updated</p>
          <h2 className="text-3xl font-black text-white mb-4">Join the TRENZO Circle</h2>
          <p className="text-white/50 text-sm mb-8">Get early access to new arrivals, exclusive offers, and style inspiration.</p>
          <div className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-[#c8a96e] transition-colors"
            />
            <button className="bg-[#c8a96e] text-[#0a0a0a] px-6 py-3 text-sm font-bold tracking-wider uppercase hover:bg-white transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
