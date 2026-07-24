import { MapPin, Pencil, Trash2, Check } from "lucide-react";

function AddressCard({ addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId }) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <div
      onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}
      className={`relative p-5 border-2 transition-all duration-200 ${
        setCurrentSelectedAddress ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-[#c8a96e] bg-[#fdf8f0]"
          : "border-[#e8e4de] bg-white hover:border-[#c8a96e]/50"
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-[#c8a96e] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? "text-[#c8a96e]" : "text-[#aaa]"}`} />
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0a0a0a] leading-snug">{addressInfo?.address}</p>
          <p className="text-xs text-[#666]">{addressInfo?.city} — {addressInfo?.pincode}</p>
          <p className="text-xs text-[#888]">{addressInfo?.phone}</p>
          {addressInfo?.notes && (
            <p className="text-xs text-[#aaa] italic">"{addressInfo?.notes}"</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 border-t border-[#e8e4de] pt-3">
        <button
          onClick={(e) => { e.stopPropagation(); handleEditAddress(addressInfo); }}
          className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#c8a96e] transition-colors font-medium"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <span className="text-[#e8e4de]">|</span>
        <button
          onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addressInfo); }}
          className="flex items-center gap-1.5 text-xs text-[#666] hover:text-red-500 transition-colors font-medium"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </button>
      </div>
    </div>
  );
}

export default AddressCard;
