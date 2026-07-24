import { StarIcon, X, ShoppingBag, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { toast } = useToast();

  const existingCartItem = cartItems?.items?.find((item) => item.productId === productDetails?._id);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => item.productId === getCurrentProductId);
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({ title: `Only ${getQuantity} quantity can be added`, variant: "destructive" });
          return;
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(addReview({
      productId: productDetails?._id,
      userId: user?.id,
      userName: user?.userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
    })).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({ title: "Review submitted!" });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview = reviews?.length > 0
    ? reviews.reduce((sum, r) => sum + r.reviewValue, 0) / reviews.length
    : 0;

  const hasSale = productDetails?.salePrice > 0;
  const discount = hasSale ? Math.round(((productDetails.price - productDetails.salePrice) / productDetails.price) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[85vw] lg:max-w-[75vw] p-0 overflow-hidden border-[#e8e4de] gap-0">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-[#f5f3ef] aspect-square md:aspect-auto">
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="w-full h-full object-cover"
            />
            {hasSale && (
              <span className="absolute top-4 left-4 bg-[#c8a96e] text-[#0a0a0a] text-xs font-bold px-3 py-1.5 tracking-widest uppercase">
                -{discount}% OFF
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto">
            <div className="p-8 flex-1">
              {/* Brand & Category */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium">
                  {productDetails?.brand}
                </p>
                <p className="text-[#aaa] text-xs tracking-wider uppercase">{productDetails?.category}</p>
              </div>

              <h1 className="text-2xl font-black text-[#0a0a0a] leading-tight mb-4">
                {productDetails?.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  <StarRatingComponent rating={averageReview} />
                </div>
                <span className="text-sm text-[#888]">
                  {averageReview.toFixed(1)} ({reviews?.length || 0} reviews)
                </span>
              </div>

              <p className="text-[#666] text-sm leading-relaxed mb-6">{productDetails?.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                {hasSale ? (
                  <>
                    <span className="text-3xl font-black text-[#0a0a0a]">${productDetails?.salePrice}</span>
                    <span className="text-lg text-[#aaa] line-through">${productDetails?.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-black text-[#0a0a0a]">${productDetails?.price}</span>
                )}
              </div>

              {/* Stock */}
              {productDetails?.totalStock > 0 && productDetails?.totalStock < 10 && (
                <p className="text-red-500 text-xs font-medium mb-4 tracking-wide">
                  ⚡ Only {productDetails?.totalStock} left in stock
                </p>
              )}

              {/* Add to cart */}
              {productDetails?.totalStock === 0 ? (
                <button disabled className="w-full py-4 bg-[#f0ede8] text-[#aaa] text-sm font-bold tracking-widest uppercase cursor-not-allowed">
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                  className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Bag
                </button>
              )}
            </div>

            {/* Reviews */}
            <div className="border-t border-[#e8e4de] p-8">
              <h2 className="text-sm font-black text-[#0a0a0a] tracking-[0.2em] uppercase mb-6">
                Customer Reviews
              </h2>

              <div className="space-y-5 max-h-48 overflow-y-auto mb-6 pr-1">
                {reviews?.length > 0 ? (
                  reviews.map((reviewItem, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 bg-[#0a0a0a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {reviewItem?.userName[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#0a0a0a]">{reviewItem?.userName}</span>
                          <div className="flex gap-0.5">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                        </div>
                        <p className="text-sm text-[#666]">{reviewItem.reviewMessage}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#aaa]">No reviews yet. Be the first!</p>
                )}
              </div>

              {/* Write review */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#0a0a0a] tracking-[0.2em] uppercase">Write a Review</p>
                <div className="flex gap-1">
                  <StarRatingComponent rating={rating} handleRatingChange={setRating} />
                </div>
                <Input
                  value={reviewMsg}
                  onChange={(e) => setReviewMsg(e.target.value)}
                  placeholder="Share your experience..."
                  className="border-[#e8e4de] focus:border-[#c8a96e] focus:ring-0 text-sm"
                />
                <button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  className="w-full py-2.5 bg-[#0a0a0a] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
