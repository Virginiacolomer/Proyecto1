import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { NumericFormat } from "react-number-format";
import { Label } from "../../ui/Label";
import { useFormContext } from "react-hook-form";

interface PriceInputProps {
  name: string;
  label?: string;
  value: number;
  prefix?: string;
  disabled?: boolean;
  className?: string;
  onChange: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void; 
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  maxDigits?: number;
  decimalScale?: number;
}

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ name, label, value, prefix, disabled, className, onChange, onBlur, onKeyDown, maxDigits, decimalScale = 2 }, ref) => {
    const {
      formState: { errors },
    } = useFormContext();

    const internalRef = useRef<HTMLInputElement>(null);


    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "-") {
        e.preventDefault();
        onChange(0);
        return;
      }
      onKeyDown?.(e);
    };

    return (
      <div className={`space-y-1 sm:space-y-2 `}>
        {label && ( 
        <Label htmlFor={name} className="label-base">
          {label}
        </Label>
        )}
        <div className={`relative `}>
          <NumericFormat
            getInputRef={internalRef}
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            value={value}
            name={name}
            thousandSeparator="."
            decimalSeparator=","
            allowedDecimalSeparators={[",", "."]}
            decimalScale={decimalScale}
            disabled={disabled}
            isAllowed={(values) => {
              if (!maxDigits) return true;
              const maxValue = Number("9".repeat(maxDigits)); // ejemplo: 12 → 999999999999
              const currentValue = values.floatValue ?? 0;
              return currentValue <= maxValue;
            }}
            fixedDecimalScale
            allowNegative={false}
            prefix={prefix ? `${prefix} ` : "$"}
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

export default PriceInput;