import React from "react";
import { NumericFormat } from "react-number-format";
import { Label } from "../../ui/Label";

interface PorcentajeInputProps {
  name: string;
  label: string;
  value: number;
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  error?: string; // 🔹 opcional: si querés mostrar un error desde afuera
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
  error,
}) => {
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

  return (
    <div className="space-y-1 sm:space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-white block mb-1">
        {label}
      </Label>
      <div className="relative">
        <NumericFormat
          getInputRef={inputRef}
          onKeyDown={onKeyDown}
          value={value}
          name={name}
          suffix=" %"
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          disabled={disabled}
          onValueChange={(values) => {
            onChange(values.floatValue ?? 0);
          }}
          onFocus={handleFocus}
          className={
            className || disabled
              ? `w-20 text-right p-2 border border-gray-300 rounded-md text-black ${className}`
              : "w-20 text-right p-2 border border-gray-300 bg-white rounded-md text-black"
          }
        />
        {error && <small className="text-red-500">{error}</small>}
      </div>
    </div>
  );
};

export default PorcentajeInput;
