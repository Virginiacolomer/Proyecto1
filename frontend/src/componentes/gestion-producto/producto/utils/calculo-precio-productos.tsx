import { useFormContext } from "react-hook-form";
import { Calculator } from "lucide-react";
import { Button } from "../../../ui/Button";
import PriceInput from "../../../herramientas/formateo-de-campos/price-input";
import PorcentajeInput from "../../../herramientas/formateo-de-campos/porcentaje-input";

interface Props {
  producto?: any;
  onCalcularPrecios: () => void;
}



export default function CalculoPreciosProducto({
  producto,
  onCalcularPrecios,
}: Props) {
  const { watch, setValue } = useFormContext();

  const costo = watch("costo") || 0;
  const precioOcasional = watch("precioOcasional") || 0;
  const precioMayorista = watch("precioMayorista") || 0;
  const precioCliente = watch("precioCliente") || 0;
  const precioOferta = watch("precioOferta") || 0;

  const porcentajeOcasional = watch("porcentajeOcasional") || 0;
  const porcentajeMayorista = watch("porcentajeMayorista") || 0;
  const porcentajeCliente = watch("porcentajeCliente") || 0;

  const disabled = !!producto;

  /* return (
    <div className="w-full lg:w-1/2 lg:pr-7">
      <div className="flex items-end gap-3 mb-4">
        <div className="flex-1">
          <PriceInput
            name="costo"
            label="Costo"
            value={costo}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCalcularPrecios();
              }
            }}
            onChange={(value) => setValue("costo", Number(value))}
            disabled={disabled}
            maxDigits={8}
          />
        </div>

        <Button
          type="button"
          onClick={onCalcularPrecios}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          disabled={disabled}
        >
          <Calculator className="w-5 h-5 mr-2" />
          Calcular Precios
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PriceInput
          name="precioOcasional"
          label="Precio Ocasional"
          value={precioOcasional}
          onChange={(v) => setValue("precioOcasional", Number(v))}
          disabled={disabled}
          maxDigits={8}
        />

        <PriceInput
          name="precioMayorista"
          label="Precio Mayorista"
          value={precioMayorista}
          onChange={(v) => setValue("precioMayorista", Number(v))}
          disabled={disabled}
          maxDigits={8}
        />

        <PorcentajeInput
          name="porcentajeOcasional"
          label=""
          value={porcentajeOcasional}
          onChange={(v) => setValue("porcentajeOcasional", Number(v))}
          disabled={disabled}
          maxDigits={5}
        />

        <PorcentajeInput
          name="porcentajeMayorista"
          label=""
          value={porcentajeMayorista}
          onChange={(v) => setValue("porcentajeMayorista", Number(v))}
          disabled={disabled}
          maxDigits={4}
        />

        <PriceInput
          name="precioCliente"
          label="Precio Cliente"
          value={precioCliente}
          onChange={(v) => setValue("precioCliente", Number(v))}
          disabled={disabled}
          maxDigits={8}
        />

        <PriceInput
          name="precioOferta"
          label="Precio Oferta"
          value={precioOferta}
          onChange={(v) => setValue("precioOferta", Number(v))}
          disabled={disabled}
          maxDigits={8}
        />

        <PorcentajeInput
          name="porcentajeCliente"
          label=""
          value={porcentajeCliente}
          onChange={(v) => setValue("porcentajeCliente", Number(v))}
          disabled={disabled}
          maxDigits={5}
        />
      </div>
    </div>
  ); */
  

  return (
    <div className="bg-white rounded-xl border shadow-sm p-3 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Precios Calculados
        </h3>
      </div>

      {/* Precio compra */}
      <div className="flex items-end gap-4 border-b pb-4">
        <div className="flex-1">
          <PriceInput
            name="costo"
            label="Costo"
            value={costo}
            onChange={(v) => setValue("costo", Number(v))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();      
                onCalcularPrecios();     
              }
            }}
            maxDigits={8}
            className="text-right font-input-cabecera"
            disabled={disabled}
          />
        </div>

        <Button
          type="button"
          onClick={onCalcularPrecios}
          className="h-[44px] px-5 bg-blue-600 hover:bg-blue-700"
          disabled={disabled}
        >
          Calcular
        </Button>
      </div>

      {/* ===== FILA 1: Ocasional + Mayorista ===== */}
      <div className="flex items-end gap-3 w-full">
        {/* Ocasional */}
        <div className="flex items-end gap-1 flex-1">
          <div className="w-20 shrink-0">
            <PorcentajeInput
              name="porcentajeOcasional"
              label="%"
              value={porcentajeOcasional}
              onChange={(v) =>
                setValue("porcentajeOcasional", Number(v))
              }
              className="h-10 font-input-cabecera"
            />
          </div>

          <div className="flex-1 min-w-0">
            <PriceInput
              name="precioOcasional"
              label="Ocasional"
              value={precioOcasional}
              onChange={(v) =>
                setValue("precioOcasional", Number(v))
              }
              maxDigits={8}
              className="text-right h-10 font-input-cabecera"
            />
          </div>
        </div>

        {/* Mayorista */}
        <div className="flex items-end gap-1 flex-1">
          <div className="w-20 shrink-0">
            <PorcentajeInput
              name="porcentajeMayorista"
              label="%"
              value={porcentajeMayorista}
              onChange={(v) =>
                setValue("porcentajeMayorista", Number(v))
              }
              className="h-10 font-input-cabecera"
            />
          </div>

          <div className="flex-1 min-w-0">
            <PriceInput
              name="precioMayorista"
              label="Mayorista"
              value={precioMayorista}
              onChange={(v) =>
                setValue("precioMayorista", Number(v))
              }
              maxDigits={8}
              className="text-right  h-10 font-input-cabecera"
            />
          </div>
        </div>
      </div>

      {/* ===== FILA 2: Cliente + Oferta ===== */}
      <div className="flex items-end gap-3 w-full">
        {/* Cliente */}
        <div className="flex items-end gap-1 flex-1">
          <div className="w-20 shrink-0">
            <PorcentajeInput
              name="porcentajeCliente"
              label="%"
              value={porcentajeCliente}
              onChange={(v) =>
                setValue("porcentajeCliente", Number(v))
              }
              className="h-10 font-input-cabecera"
            />
          </div>

          <div className="flex-1 min-w-0">
            <PriceInput
              name="precioCliente"
              label="Cliente"
              value={precioCliente}
              onChange={(v) =>
                setValue("precioCliente", Number(v))
              }
              maxDigits={8}
              className="text-right h-10 font-input-cabecera"
            />
          </div>
        </div>

        {/* Oferta (sin %, alineada con spacer) */}
        <div className="flex items-end gap-1 flex-1">
          <div className="w-20 shrink-0" />
          <div className="flex-1 min-w-0">
            <PriceInput
              name="precioOferta"
              label="Oferta"
              value={precioOferta}
              onChange={(v) =>
                setValue("precioOferta", Number(v))
              }
              maxDigits={8}
              className="text-right h-10 font-input-cabecera"
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );

}

