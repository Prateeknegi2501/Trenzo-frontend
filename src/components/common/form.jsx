import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({ formControls, formData, setFormData, onSubmit, buttonText, isBtnDisabled, disabled }) {
  function renderInputsByComponentType(getControlItem) {
    const value = formData[getControlItem.name] || "";
    const baseInputClass = "border-[#e8e4de] focus:border-[#c8a96e] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-white text-[#0a0a0a] placeholder:text-[#bbb] h-11 text-sm";

    switch (getControlItem.componentType) {
      case "select":
        return (
          <Select
            onValueChange={(value) => setFormData({ ...formData, [getControlItem.name]: value })}
            value={value}
          >
            <SelectTrigger className={`${baseInputClass} w-full`}>
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent className="border-[#e8e4de]">
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id} className="text-sm">
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            className={`${baseInputClass} h-auto min-h-[80px] py-3`}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );

      default:
        return (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            maxLength={getControlItem.maxLength}
            className={baseInputClass}
            onChange={(e) => setFormData({ ...formData, [getControlItem.name]: e.target.value })}
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formControls.map((controlItem) => (
        <div key={controlItem.name} className="space-y-1.5">
          <Label className="text-xs font-semibold text-[#0a0a0a] uppercase tracking-[0.1em]">
            {controlItem.label}
          </Label>
          {renderInputsByComponentType(controlItem)}
        </div>
      ))}

      <button
        disabled={isBtnDisabled || disabled}
        type="submit"
        className="w-full py-3.5 bg-[#0a0a0a] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#c8a96e] hover:text-[#0a0a0a] transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
      >
        {buttonText || "Submit"}
      </button>
    </form>
  );
}

export default CommonForm;
