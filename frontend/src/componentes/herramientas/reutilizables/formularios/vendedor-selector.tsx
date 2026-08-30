import Select from "react-select";
import { RefObject } from "react";

export interface Vendedor {
  id: number;
  denominacion: string;
}

interface Props {
  vendedores: Vendedor[];
  value: Vendedor | null;
  onChange: (vendedor: Vendedor | null) => void;

  denominacionVendedor: string;
  setDenominacionVendedor: (value: string) => void;

  denominacionVendedorRef: RefObject<HTMLInputElement>;
  selectVendedorRef: RefObject<HTMLDivElement>;

  onEnter: (e: React.KeyboardEvent<HTMLInputElement>, tipo: string) => void;
  disabled: boolean;
  error?: string;
}

export const VendedorSelector = ({
  vendedores,
  value,
  onChange,
  denominacionVendedor,
  setDenominacionVendedor,
  denominacionVendedorRef,
  selectVendedorRef,
  onEnter,
  disabled,
  error,
}: Props) => {
  return (
    <div className="min-w-[420px]">
      <label className="text-xs font-medium text-gray-600 mb-1 block">
        Vendedor
      </label>

      <div className="flex items-center gap-2">
        {/* Input denominación */}
        <input
          type="text"
          ref={denominacionVendedorRef}
          onKeyDown={(e) => onEnter(e, "VENDEDOR")}
          placeholder="Denominación"
          value={denominacionVendedor}
          onChange={(e) =>
            setDenominacionVendedor(e.target.value.trimStart())
          }
          disabled={disabled}
          className="
            h-[36px] w-[180px]
            rounded-md border border-gray-300
            bg-white px-2 text-sm text-black
            focus:ring-2 focus:ring-blue-500
          "
        />

        {/* Select vendedor */}
        <div ref={selectVendedorRef} className="flex-1">
          <Select
            value={value}
            options={vendedores}
            getOptionLabel={(o) => o.denominacion}
            getOptionValue={(o) => String(o.id)}
            onChange={(o) => onChange(o as Vendedor)}
            placeholder="Seleccione"
            isDisabled={disabled}
            menuPortalTarget={document.body}
            className="text-black"
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "36px",
                height: "36px",
                fontSize: "0.875rem",
              }),
              singleValue: (base) => ({
                ...base,
                fontSize: "0.875rem",
              }),
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};
