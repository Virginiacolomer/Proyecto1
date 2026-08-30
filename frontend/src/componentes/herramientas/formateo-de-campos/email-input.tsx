import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/Input";
import { CheckCircle, XCircle } from "lucide-react";

export interface EmailInputProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

type ValidationState = "idle" | "valid" | "invalid";

export function isValidEmail(value: string): boolean {
  const atIndex = value.indexOf("@");
  if (atIndex <= 0) return false; // necesita al menos un char antes del @
  if (value.indexOf("@", atIndex + 1) !== -1) return false; // exactamente un @
  const domain = value.slice(atIndex + 1);
  const dotIndex = domain.indexOf(".");
  if (dotIndex <= 0) return false; // al menos un char antes del punto en el dominio
  if (dotIndex === domain.length - 1) return false; // al menos un char después del punto
  return true;
}

export function deriveValidationState(value: string): ValidationState {
  if (value === "") return "idle";
  return isValidEmail(value) ? "valid" : "invalid";
}

export default function EmailInput({
  name,
  label,
  placeholder,
  disabled,
  className,
  style,
}: EmailInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={`space-y-1 sm:space-y-2 ${className || ""}`}>
      <Label htmlFor={name} className="label-base">
        {label}
      </Label>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const validationState = deriveValidationState(field.value ?? "");
            return (
              <>
                <Input
                  {...field}
                  id={name}
                  type="email"
                  placeholder={placeholder}
                  disabled={disabled}
                  style={style}
                  className="pl-10 w-full px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm sm:text-base pr-10"
                />
                {!disabled && validationState === "valid" && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 h-4 w-4" />
                )}
                {!disabled && validationState === "invalid" && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 h-4 w-4" />
                )}
              </>
            );
          }}
        />
        {errors[name] && (
          <small className="text-red-500">{errors[name]?.message as string}</small>
        )}
      </div>
    </div>
  );
}
