import React from "react";
import Select from "react-select";
import { useAtom } from "jotai";
import { tipoPrecioSeleccionadoAtom } from "../../../../context/factura-venta-context";
import { TipoPrecio } from "../../../../interfaces/generales/interfaces-generales";

const TipoPrecioSelect: React.FC = () => {
  const [tipoPrecioSeleccionado, setTipoPrecioSeleccionado] =
    useAtom(tipoPrecioSeleccionadoAtom);

  const options = Object.entries(TipoPrecio).map(([key, value]) => ({
    id: key,
    denominacion: value,
  }));

  return (
    <div className="w-60">
      <label className="label-base">
        Tipo Precio
      </label>

      <Select
        value={options.find(o => o.id === tipoPrecioSeleccionado) || null}
        options={options}
        getOptionLabel={(o) => o.denominacion}
        getOptionValue={(o) => String(o.id)}
        onChange={(o) => setTipoPrecioSeleccionado(o?.id ?? "")}
        className="text-black"
        menuPortalTarget={document.body}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "36px",
            height: "36px",
            fontSize: "0.875rem",
          }),
          singleValue: (base) => ({
            ...base,
            color: "black",
          }),
          option: (base, { isSelected, isFocused }) => ({
            ...base,
            color: isSelected ? "white" : "black",
            backgroundColor: isSelected
              ? "#3b82f6"
              : isFocused
              ? "#93c5fd"
              : "white",
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default TipoPrecioSelect;
