import { Minus, Plus, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems.items || [];
      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex((item) => item.productId === getCartItem?.productId);
        const getCurrentProductIndex = productList.findIndex((product) => product._id === getCartItem?.productId);
        const getTotalStock = productList[getCurrentProductIndex]?.totalStock;
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            return toast({ title: `Only ${getQuantity} available`, variant: "destructive" });
          }
        }
      }
    }
    dispatch(updateCartQuantity({
      userId: user?.id,
      productId: getCartItem?.productId,
      quantity: typeOfAction === "plus" ? getCartItem?.quantity + 1 : getCartItem?.quantity - 1,
    })).then((data) => {
      if (data?.payload?.success) toast({ title: "Cart updated" });
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })).then((data) => {
      if (data?.payload?.success) toast({ title: "Item removed" });
    });
  }

  const itemPrice = (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity;

  return (
    <div className="flex items-center gap-4 py-3 border-b border-[#f0ede8] last:border-0">
      <div className="w-16 h-16 bg-[#f5f3ef] flex-shrink-0 overflow-hidden">
        <img src={cartItem?.image} alt={cartItem?.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-[#0a0a0a] leading-snug line-clamp-1">{cartItem?.title}</h3>
        <p className="text-xs text-[#aaa] mt-0.5">${cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price} each</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            disabled={cartItem?.quantity === 1}
            className="w-6 h-6 border border-[#e8e4de] flex items-center justify-center text-[#666] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-bold text-[#0a0a0a] w-5 text-center">{cartItem?.quantity}</span>
          <button
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
            className="w-6 h-6 border border-[#e8e4de] flex items-center justify-center text-[#666] hover:border-[#c8a96e] hover:text-[#c8a96e] transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-black text-[#0a0a0a]">${itemPrice.toFixed(2)}</span>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-[#ccc] hover:text-red-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
