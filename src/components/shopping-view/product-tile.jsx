import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Minus, Plus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCartQuantity,
  addToCart,
  deleteCartItem,
} from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({ product, handleGetProductDetails }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const existingCartItem = cartItems?.items?.find(
    (item) => item.productId === product?._id
  );

  function handleAddFirstTime() {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: product?._id,
        quantity: 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Added to cart!" });
      }
    });
  }

  function handleQtyUpdate(type) {
    const currentQty = existingCartItem?.quantity;

    if (type === "plus" && currentQty + 1 > product?.totalStock) {
      return toast({
        title: `Only ${product?.totalStock} items available`,
        variant: "destructive",
      });
    }

    if (type === "minus" && currentQty === 1) {
      dispatch(
        deleteCartItem({
          userId: user?.id,
          productId: product?._id,
        })
      ).then((res) => {
        if (res?.payload?.success) {
          toast({ title: "Item removed" });
        }
      });
      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: product?._id,
        quantity: type === "plus" ? currentQty + 1 : currentQty - 1,
      })
    ).then((res) => {
      if (res?.payload?.success) {
        toast({ title: "Quantity updated" });
      }
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />

          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Only {product?.totalStock} left
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>
          ) : null}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>

          <div className="flex justify-between text-muted-foreground mb-2">
            <span>{categoryOptionsMap[product?.category]}</span>
            <span>{brandOptionsMap[product?.brand]}</span>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>

            {product?.salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : existingCartItem ? (
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQtyUpdate("minus")}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="text-lg font-bold">
              {existingCartItem.quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => handleQtyUpdate("plus")}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={handleAddFirstTime}>
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
