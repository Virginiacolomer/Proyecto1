import * as React from "react";
import { Command, CommandInput, CommandItem, CommandList, CommandGroup } from "./Command";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

export function Combobox({ value, onChange, onInput, children }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (newValue: string) => {
    onChange(newValue);
    setOpen(false);
  };

  return (
    <Command className="relative w-full">
      <CommandInput
        value={value}
        onInput={onInput}
        placeholder="Buscar..."
        className="w-full p-2 border bg-white text-black border-gray-300 rounded-md"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      />
      {open && (
        <CommandList className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-md z-50">
          <CommandGroup>
            {React.Children.map(children, (child) =>
              React.isValidElement<ComboboxItemProps>(child)
                ? React.cloneElement(child, {
                    onSelect: () => handleSelect(child.props.value),
                  } as Partial<ComboboxItemProps>)
                : child,
            )}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}

interface ComboboxItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
}

export function ComboboxItem({ children, onSelect }: ComboboxItemProps) {
  return (
    <CommandItem className="p-2 hover:bg-gray-100 cursor-pointer" onSelect={onSelect}>
      {children}
    </CommandItem>
  );
}
