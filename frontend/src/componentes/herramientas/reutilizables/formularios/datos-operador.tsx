import SeleccionProveedorClienteCabecera from "../seleccion-proveedor-cliente-cabecera";


interface SeleccionProveedorClienteProps {
  disabled?: boolean;
  visible?: boolean;
  disabledByItems?: boolean;
}

export default function DatosOperador({
  disabled = false,
  visible = true,
  disabledByItems = false,
}: SeleccionProveedorClienteProps) {
  if (!visible) return null;

  return (
    <fieldset disabled={disabled}>
      <div className="w-full">
        <SeleccionProveedorClienteCabecera disabledByItems={disabledByItems} />
      </div>
    </fieldset>
  );
}
