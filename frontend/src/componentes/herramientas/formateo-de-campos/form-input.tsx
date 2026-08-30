import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/Input";
import { useMask } from "@react-input/mask";

type FormInputProps = {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  defaultValue?: string;
  classNameDisabled?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputRef?: React.Ref<HTMLInputElement>;
  mask?: string;
};

export default function FormInput({
  name,
  label,
  placeholder,
  type,
  mask,
  className,
  classNameDisabled,
  disabled,
  style,
  defaultValue,
  onKeyDown,
  onBlur,
  inputRef,
}: FormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Accede al contexto

  // Hook de máscara (solo si se pasa mask)
  const maskRef = mask
    ? useMask({
        mask,
        replacement: { _: /\d/ }, // "_" representa un dígito
      })
    : null;

  return (
    <div className={`space-y-1 sm:space-y-2 ${className || ""}`}>
      <Label htmlFor={name} className="label-base">
        {label}
      </Label>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              style={style}
              onKeyDown={onKeyDown}
              onBlur={(e) => {
                field.onBlur();
                onBlur?.(e);
              }}
              ref={mask ? maskRef : inputRef}
              className={
                classNameDisabled
                  ? classNameDisabled
                  : "pl-10 w-full px-3 sm:px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm sm:text-base"
              }
            />
          )}
        />
        {errors[name] && <small className="text-red-500">{errors[name]?.message as string}</small>}
      </div>
    </div>
  );
}
