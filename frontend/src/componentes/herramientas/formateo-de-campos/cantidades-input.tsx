import React from "react";
import { NumericFormat } from "react-number-format";
import { Label } from "../../ui/Label";
import { useFormContext } from "react-hook-form";

interface CantidadesInputProps {
  name: string;
  label: string;
  value: number;
  disabled?: boolean;
  className?: string;
  maxDigits?: number; // ✅ Nueva prop opcional
  onChange: (value: number) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

const CantidadesInput: React.FC<CantidadesInputProps> = ({
  name,
  label,
  value,
  disabled,
  className,
  maxDigits = 5, // ✅ Valor por defecto si no se pasa
  onChange,
  onKeyDown,
  inputRef,
}) => {
  const {
    formState: { errors },
  } = useFormContext(); // Accede al contexto

  return (
    <div className="space-y-1 sm:space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 block mb-1">
        {label}
      </Label>
      <div className="relative">
        <NumericFormat
          thousandSeparator="."
          getInputRef={inputRef}
          onKeyDown={onKeyDown}
          value={value}
          decimalSeparator=","
          decimalScale={0}
          disabled={disabled}
          allowNegative={false}
          onValueChange={(values) => {
            onChange(values.floatValue ?? 0);
          }}
          isAllowed={({ floatValue }) => {
            // ✅ Limitar la cantidad de dígitos
            if (floatValue === undefined) return true;
            return floatValue.toString().length <= maxDigits;
          }}
          className={
            className || disabled
              ? `w-full text-right p-2 border border-gray-300 rounded-md text-black max-w-[100px] ${className}`
              : "w-full text-right p-2 border border-gray-300 bg-white rounded-md text-black max-w-[100px]"
          }
        />
      </div>
      {errors[name] && <small className="text-red-500">{errors[name]?.message as string}</small>}
    </div>
  );
};

export default CantidadesInput;
