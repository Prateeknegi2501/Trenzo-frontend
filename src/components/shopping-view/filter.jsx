import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { SlidersHorizontal } from "lucide-react";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white border border-[#e8e4de] h-fit sticky top-24">
      <div className="px-5 py-4 border-b border-[#e8e4de] flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-[#c8a96e]" />
        <h2 className="text-xs font-black text-[#0a0a0a] tracking-[0.2em] uppercase">Filters</h2>
      </div>

      <div className="p-5 space-y-6">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-[10px] font-black text-[#0a0a0a] tracking-[0.25em] uppercase mb-3">
                {keyItem}
              </h3>
              <div className="space-y-2.5">
                {filterOptions[keyItem].map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={filters?.[keyItem]?.indexOf(option.id) > -1}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                      className="border-[#e8e4de] data-[state=checked]:bg-[#0a0a0a] data-[state=checked]:border-[#0a0a0a] rounded-none w-4 h-4"
                    />
                    <span className="text-sm text-[#555] group-hover:text-[#0a0a0a] transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="h-px bg-[#f0ede8]" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
