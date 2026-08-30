import React from "react";
import { ClipboardList } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "../../../ui/Button";

interface CodigoProductoSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onBuscar: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export default function CodigoProductoSelector({
  value,
  onChange,
  onBuscar,
  onKeyDown,
  disabled,
  inputRef,
  buttonRef,
}: CodigoProductoSelectorProps) {
  return (
    <div className="flex items-end gap-2">
      {/* Código */}
      <div className="flex flex-col space-y-1">
        <label className="label-base">
          Código
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Código"
          className="border border-gray-300 bg-white text-black rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 w-[150px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
      </div>

      {/* Botón búsqueda */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              ref={buttonRef}
              variant="outline"
              size="icon"
              onClick={onBuscar}
              disabled={disabled}
              className="bg-blue-500 text-white hover:bg-blue-700 w-10 h-10 rounded-full shadow-md transition"
            >
              <ClipboardList size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 text-white p-2 rounded-md">
            Búsqueda Avanzada
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
