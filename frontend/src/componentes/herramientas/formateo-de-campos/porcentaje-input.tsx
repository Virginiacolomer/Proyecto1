import React from "react";
import { NumericFormat } from "react-number-format";
import { Label } from "../../ui/Label";
import { useFormContext } from "react-hook-form";

interface PorcentajeInputProps {
  name: string;
  label: string;
  value: number;
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

const PorcentajeInput: React.FC<PorcentajeInputProps> = ({
  name,
  label,
  value,
  disabled,
  className,
  onChange,
  onKeyDown,
  inputRef,
}) => {
  const {
    formState: { errors },
  } = useFormContext();

  const handleFocus = () => {
    setTimeout(() => {
      if (inputRef && "current" in inputRef && inputRef.current) {
        const input = inputRef.current;
        const valueStr = input.value;
        const commaIndex = valueStr.indexOf(",");

        if (commaIndex !== -1) {
          input.setSelectionRange(commaIndex, commaIndex);
        }
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-") {
      e.preventDefault();
      onChange(0);
      return;
    }
    onKeyDown?.(e);
  };

  return (
    <div className="space-y-1 sm:space-y-2">
      <Label htmlFor={name} className="label-base">
        {label}
      </Label>
      <div className="relative">
        <NumericFormat
          getInputRef={inputRef}
          onKeyDown={handleKeyDown}
          value={value}
          name={name}
          suffix=" %"
          thousandSeparator="."
          decimalSeparator=","
          allowedDecimalSeparators={[",", "."]}
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          disabled={disabled}
          isAllowed={(values) => {
            const current = values.floatValue ?? 0;
            return current <= 999;
          }}
          onValueChange={(values) => {
            onChange(values.floatValue ?? 0);
          }}
          onFocus={handleFocus}
          className={
            className
              ? className
              : disabled
                ? "w-full text-right p-2 border border-gray-300 bg-gray-300 rounded-md text-black"
                : "w-full text-right p-2 border border-gray-300 bg-white rounded-md text-black"
          }
        />
        {errors[name] && <small className="text-red-500">{errors[name]?.message as string}</small>}
      </div>
    </div>
  );
};

export default PorcentajeInput;