"use client";

import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { gsap } from "gsap";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];
  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      queryParams.push(`${key}=${encodeURIComponent(value.join(","))}`);
    }
  }
  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const gridRef = useRef(null);

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
    setShowSortMenu(false);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption] };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          return toast({ title: `Only ${getQuantity} available`, variant: "destructive" });
        }
      }
    }
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({ title: "Added to your bag" });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      router.replace(`${pathname}?${createSearchParamsHelper(filters)}`);
    }
  }, [filters, pathname, router]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
    }
  }, [dispatch, filters, sort]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (gridRef.current && productList?.length) {
      gsap.fromTo(
        gridRef.current.querySelectorAll(".product-item"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [productList]);

  const currentSortLabel = sortOptions.find((s) => s.id === sort)?.label || "Sort by";

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Page header */}
      <div className="bg-[#0a0a0a] py-10 px-6">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-[#c8a96e] text-xs tracking-[0.4em] uppercase font-medium mb-2">Explore</p>
          <h1 className="text-3xl font-black text-white tracking-tight">All Products</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          {/* Filter sidebar */}
          <ProductFilter filters={filters} handleFilter={handleFilter} />

          {/* Products */}
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8e4de]">
              <p className="text-sm text-[#888]">
                <span className="font-bold text-[#0a0a0a]">{productList?.length || 0}</span> products
              </p>

              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 border border-[#e8e4de] bg-white px-4 py-2 text-xs font-medium text-[#0a0a0a] hover:border-[#c8a96e] transition-colors"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#c8a96e]" />
                  {currentSortLabel}
                </button>

                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-[#e8e4de] shadow-lg z-20 min-w-[180px]">
                    {sortOptions.map((sortItem) => (
                      <button
                        key={sortItem.id}
                        onClick={() => handleSort(sortItem.id)}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[#faf9f7] transition-colors ${
                          sort === sortItem.id ? "text-[#c8a96e] font-bold" : "text-[#555]"
                        }`}
                      >
                        {sortItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {productList?.length > 0 ? (
                productList.map((productItem) => (
                  <div key={productItem._id} className="product-item">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-[#aaa] text-sm">No products found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
