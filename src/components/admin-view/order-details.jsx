import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { motion } from "framer-motion";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: data?.payload?.message });
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[650px] p-6 max-h-[80vh] overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid gap-6"
      >
        {/* ORDER META INFO */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 grid gap-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Order ID</p>
              <Label>{orderDetails?._id}</Label>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Order Date</p>
              <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Order Price</p>
              <Label>${orderDetails?.totalAmount}</Label>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Payment Method</p>
              <Label>{orderDetails?.paymentMethod}</Label>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Payment Status</p>
              <Label>{orderDetails?.paymentStatus}</Label>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium">Order Status</p>
              <Badge
                className={`py-1 px-3 text-white rounded-xl shadow-sm capitalize ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ORDER ITEMS */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 grid gap-4">
            <h2 className="text-xl font-semibold">Order Items</h2>
            <Separator />
            <ul className="grid gap-4">
              {orderDetails?.cartItems?.length > 0 ? (
                orderDetails.cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center justify-between bg-muted/40 p-3 rounded-xl text-sm"
                  >
                    <span className="font-medium">{item.title}</span>
                    <span>Qty: {item.quantity}</span>
                    <span className="font-semibold">${item.price}</span>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground">No items found.</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* SHIPPING INFO */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5 grid gap-3">
            <h2 className="text-xl font-semibold">Shipping Information</h2>
            <Separator />
            <div className="grid gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-black">{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </CardContent>
        </Card>

        {/* UPDATE STATUS FORM */}
        <Card className="shadow-md rounded-2xl">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold mb-3">Update Order Status</h2>
            <CommonForm
              formControls={[
                {
                  label: "Order Status",
                  name: "status",
                  componentType: "select",
                  options: [
                    { id: "pending", label: "Pending" },
                    { id: "inProcess", label: "In Process" },
                    { id: "inShipping", label: "In Shipping" },
                    { id: "delivered", label: "Delivered" },
                    { id: "rejected", label: "Rejected" },
                  ],
                },
              ]}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Update Order Status"}
              onSubmit={handleUpdateStatus}
            />
          </CardContent>
        </Card>
      </motion.div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
