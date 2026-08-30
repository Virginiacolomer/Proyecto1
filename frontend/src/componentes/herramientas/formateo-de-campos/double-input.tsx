import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { Label } from "../../ui/Label";
import { useFormContext } from "react-hook-form";

interface DoubleInputProps {
  name: string;
  label?: string;
  value: number;
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  maxDigits?: number;
}

const DoubleInput = forwardRef<HTMLInputElement, DoubleInputProps>(
  ({ name, label, value, disabled, className, onChange, onBlur,onKeyDown, maxDigits }, ref) => {
    const {
      formState: { errors },
    } = useFormContext();

    const internalRef = useRef<HTMLInputElement>(null);

    // Exponer la ref interna
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    // Establecer el cursor entre el 0 y la coma cuando se hace focus
    const handleFocus = () => {
      setTimeout(() => {
        const input = internalRef.current;
        if (input) {
          const valueStr = input.value;
          const commaIndex = valueStr.indexOf(",");
          if (commaIndex !== -1) {
            input.setSelectionRange(commaIndex, commaIndex);
          }
        }
      }, 0);
    };

    return (
      <div className={`space-y-1 sm:space-y-2 `}>
        {label && ( 
        <Label htmlFor={name} className="text-sm font-medium text-gray-700 block mb-1">
          {label}
        </Label>
        )}
        <div className={`relative `}>
          <NumericFormat
            getInputRef={internalRef}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            value={value}
            name={name}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            disabled={disabled}
            isAllowed={(values) => {
              if (!maxDigits) return true;
              const maxValue = Number("9".repeat(maxDigits)); // ejemplo: 12 → 999999999999
              const currentValue = values.floatValue ?? 0;
              return currentValue <= maxValue;
            }}
            fixedDecimalScale
            allowNegative={false}
            onValueChange={(values) => {
              onChange(values.floatValue ?? 0); // si es undefined, setea 0
            }}
            onFocus={handleFocus}
            className={
              className // se paso className?
                ? className
                : disabled // no
                  ? "w-full text-right p-2 border border-gray-300 bg-gray-300 rounded-md text-black"
                  : "w-full text-right p-2 border border-gray-300 bg-white rounded-md text-black"
            }
          />

          {errors[name] && <small className="text-red-500">{errors[name]?.message as string}</small>}
        </div>
      </div>
    );
  },
);

export default DoubleInput;
