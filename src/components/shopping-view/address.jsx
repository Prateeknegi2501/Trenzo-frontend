import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";
import { Plus, X } from "lucide-react";

const initialAddressFormData = { address: "", city: "", phone: "", pincode: "", notes: "" };

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      return toast({ title: "Maximum 3 addresses allowed", variant: "destructive" });
    }

    const action = currentEditedId !== null
      ? editaAddress({ userId: user?.id, addressId: currentEditedId, formData })
      : addNewAddress({ ...formData, userId: user?.id });

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
        setShowForm(false);
        toast({ title: currentEditedId ? "Address updated" : "Address added" });
      }
    });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({ title: "Address removed" });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {
    setCurrentEditedId(getCuurentAddress?._id);
    setFormData({
      address: getCuurentAddress?.address,
      city: getCuurentAddress?.city,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
    setShowForm(true);
  }

  function isFormValid() {
    return Object.keys(formData).every((key) => key === "notes" || formData[key].trim() !== "");
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.id));
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Address cards */}
      {addressList?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addressList.map((singleAddressItem) => (
            <AddressCard
              key={singleAddressItem._id}
              selectedId={selectedId}
              handleDeleteAddress={handleDeleteAddress}
              addressInfo={singleAddressItem}
              handleEditAddress={handleEditAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          ))}
        </div>
      )}

      {/* Add new address toggle */}
      {!showForm && addressList?.length < 3 && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 border-2 border-dashed border-[#e8e4de] hover:border-[#c8a96e] text-[#aaa] hover:text-[#c8a96e] transition-colors w-full py-6 justify-center text-sm font-medium tracking-wide"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="border border-[#e8e4de] p-6 bg-[#faf9f7]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#c8a96e] text-xs tracking-[0.3em] uppercase font-medium mb-0.5">
                {currentEditedId ? "Update" : "New"}
              </p>
              <h3 className="text-lg font-black text-[#0a0a0a]">
                {currentEditedId ? "Edit Address" : "Add Address"}
              </h3>
            </div>
            <button
              onClick={() => { setShowForm(false); setCurrentEditedId(null); setFormData(initialAddressFormData); }}
              className="text-[#aaa] hover:text-[#0a0a0a] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId ? "Update Address" : "Save Address"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </div>
      )}
    </div>
  );
}

export default Address;
