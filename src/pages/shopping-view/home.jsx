import nike from "@/assets/brands/nike.png";
import adidas from "@/assets/brands/adidas.png";
import puma from "@/assets/brands/puma.jpg";
import levi from "@/assets/brands/levis.png";
import zara from "@/assets/brands/zara.jpg";
import hm from "@/assets/brands/hm.png";
import men from "@/assets/categories/man.jpg";
import women from "@/assets/categories/women.jpg";
import kids from "@/assets/categories/kids.jpg";
import accessories from "@/assets/categories/accessories.jpg";
import footwear from "@/assets/categories/footwear.jpg";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

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
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ------------------ HERO SLIDER ------------------ */}
      <div className="relative w-full h-[600px] overflow-hidden rounded-b-2xl shadow-lg">
        {featureImageList?.length > 0 &&
          featureImageList.map((slide, index) => (
            <img
              key={index}
              src={slide?.image}
              className={`
              absolute inset-0 w-full h-full object-cover 
              transition-opacity duration-1000 ease-in-out
              ${index === currentSlide ? "opacity-100" : "opacity-0"}
            `}
            />
          ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {featureImageList?.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`
              w-3 h-3 rounded-full cursor-pointer transition-all
              ${currentSlide === idx ? "bg-white" : "bg-white/40"}
            `}
            />
          ))}
        </div>
      </div>

      {/* ------------------ SHOP BY CATEGORY ------------------ */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((category) => (
              <Card
                key={category.id}
                onClick={() =>
                  handleNavigateToListingPage(category, "category")
                }
                className="cursor-pointer group hover:shadow-xl transition-all border rounded-2xl bg-white"
              >
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-20 h-20 mb-4 rounded-xl object-cover group-hover:scale-110 transition-transform"
                  />

                  <span className="font-semibold text-lg">
                    {category.label}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------ SHOP BY BRAND ------------------ */}
      {/* ------------------ SHOP BY BRAND ------------------ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-10">Top Brands</h2>

          <div
            className={`
        grid gap-6 
        ${
          brandsWithIcon.length > 6
            ? "grid-flow-col auto-cols-[200px] overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        }
      `}
          >
            {brandsWithIcon
              .slice(0, Math.min(brandsWithIcon.length, 10))
              .map((brand) => (
                <Card
                  key={brand.id}
                  onClick={() => handleNavigateToListingPage(brand, "brand")}
                  className="cursor-pointer group hover:shadow-xl transition-all border rounded-2xl bg-gray-50 snap-start"
                >
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <img
                      src={brand.image}
                      alt={brand.label}
                      className="w-24 h-24 mb-4 rounded-xl object-contain group-hover:scale-110 transition-transform"
                    />
                    <span className="font-semibold text-lg">{brand.label}</span>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Show More */}
          {brandsWithIcon.length > 10 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/shop/listing?show=brands")}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              >
                View All Brands
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList?.map((product) => (
              <ShoppingProductTile
                key={product._id}
                handleGetProductDetails={handleGetProductDetails}
                product={product}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
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
