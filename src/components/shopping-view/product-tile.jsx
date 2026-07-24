import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Minus, Plus, ShoppingBag, Eye } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartQuantity, addToCart, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const existingCartItem = cartItems?.items?.find((item) => item.productId === product?._id);

  function handleAddFirstTime() {
    dispatch(addToCart({ userId: user?.id, productId: product?._id, quantity: 1 })).then((res) => {
      if (res?.payload?.success) toast({ title: "Added to your bag" });
    });
  }

  function handleQtyUpdate(type) {
    const currentQty = existingCartItem?.quantity;
    if (type === "plus" && currentQty + 1 > product?.totalStock) {
      return toast({ title: `Only ${product?.totalStock} items available`, variant: "destructive" });
    }
    if (type === "minus" && currentQty === 1) {
      dispatch(deleteCartItem({ userId: user?.id, productId: product?._id })).then((res) => {
        if (res?.payload?.success) toast({ title: "Item removed" });
      });
      return;
    }
    dispatch(updateCartQuantity({ userId: user?.id, productId: product?._id, quantity: type === "plus" ? currentQty + 1 : currentQty - 1 })).then((res) => {
      if (res?.payload?.success) toast({ title: "Quantity updated" });
    });
  }

  const isOutOfStock = product?.totalStock === 0;
  const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;
  const hasSale = product?.salePrice > 0;
  const discount = hasSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <div className="group bg-white border border-[#e8e4de] hover:border-[#c8a96e] hover:shadow-xl transition-all duration-400 flex flex-col">
      {/* Image */}
      <div
        className="relative overflow-hidden aspect-[3/4] bg-[#f5f3ef] cursor-pointer"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="bg-[#0a0a0a] text-white text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">
              Sold Out
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">
              Only {product?.totalStock} left
            </span>
          )}
          {!isOutOfStock && hasSale && (
            <span className="bg-[#c8a96e] text-[#0a0a0a] text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-white text-[#0a0a0a] flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wider uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#c8a96e]">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] text-[#c8a96e] tracking-[0.2em] uppercase font-medium">
            {brandOptionsMap[product?.brand]}
          </p>
          <p className="text-[10px] text-[#aaa] tracking-wider uppercase">
            {categoryOptionsMap[product?.category]}
          </p>
        </div>

        <h3
          className="font-semibold text-[#0a0a0a] text-sm leading-snug mb-3 cursor-pointer hover:text-[#c8a96e] transition-colors line-clamp-2"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          {product?.title}
        </h3>

        <div className="flex items-center gap-2 mb-4 mt-auto">
          {hasSale ? (
            <>
              <span className="text-lg font-black text-[#0a0a0a]">${product?.salePrice}</span>
              <span className="text-sm text-[#aaa] line-through">${product?.price}</span>
            </>
          ) : (
            <span className="text-lg font-black text-[#0a0a0a]">${product?.price}</span>
          )}
        </div>

        {/* Cart action */}
        {isOutOfStock ? (
          <button disabled className="w-full py-2.5 text-xs font-bold tracking-widest uppercase bg-[#f0ede8] text-[#aaa] cursor-not-allowed">
            Out of Stock
          </button>
        ) : existingCartItem ? (
          <div className="flex items-center justify-between border border-[#e8e4de] px-3 py-1.5">
            <button onClick={() => handleQtyUpdate("minus")} className="text-[#0a0a0a] hover:text-[#c8a96e] transition-colors p-1">
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold text-[#0a0a0a]">{existingCartItem.quantity}</span>
            <button onClick={() => handleQtyUpdate("plus")} className="text-[#0a0a0a] hover:text-[#c8a96e] transition-colors p-1">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddFirstTime}
            className="w-full py-2.5 text-xs font-bold tracking-widest uppercase bg-[#0a0a0a] text-white hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
          </button>
        )}
      </div>
    </div>
  );
}

export default ShoppingProductTile;
