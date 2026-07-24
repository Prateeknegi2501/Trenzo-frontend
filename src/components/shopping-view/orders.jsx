import { useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Package, ChevronRight } from "lucide-react";

const statusStyles = {
  confirmed: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  delivered: "bg-blue-50 text-blue-700 border-blue-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  "in-process": "bg-purple-50 text-purple-700 border-purple-200",
};

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  if (!orderList?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="w-12 h-12 text-[#e8e4de] mb-4" />
        <p className="text-sm font-semibold text-[#0a0a0a] mb-1">No orders yet</p>
        <p className="text-xs text-[#aaa]">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orderList.map((orderItem) => {
        const statusClass = statusStyles[orderItem?.orderStatus] || "bg-gray-50 text-gray-700 border-gray-200";
        return (
          <div
            key={orderItem?._id}
            className="flex items-center justify-between p-5 border border-[#e8e4de] bg-[#faf9f7] hover:border-[#c8a96e] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#f0ede8] flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#c8a96e]" />
              </div>
              <div>
                <p className="text-xs text-[#aaa] font-mono mb-0.5">#{orderItem?._id?.slice(-8).toUpperCase()}</p>
                <p className="text-sm font-semibold text-[#0a0a0a]">
                  {new Date(orderItem?.orderDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className={`text-[10px] font-bold px-2.5 py-1 border tracking-widest uppercase ${statusClass}`}>
                {orderItem?.orderStatus}
              </span>
              <span className="text-sm font-black text-[#0a0a0a]">${orderItem?.totalAmount?.toFixed(2)}</span>

              <Dialog
                open={openDetailsDialog}
                onOpenChange={() => { setOpenDetailsDialog(false); dispatch(resetOrderDetails()); }}
              >
                <button
                  onClick={() => handleFetchOrderDetails(orderItem?._id)}
                  className="flex items-center gap-1 text-xs text-[#888] hover:text-[#c8a96e] transition-colors font-medium group-hover:text-[#c8a96e]"
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <ShoppingOrderDetailsView orderDetails={orderDetails} />
              </Dialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ShoppingOrders;
