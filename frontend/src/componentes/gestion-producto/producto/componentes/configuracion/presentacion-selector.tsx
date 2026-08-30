import { SelectPresentacion } from "../../../../../interfaces/gestion-producto/presentacion/interfaces-presentacion";
import EntidadSelectorBase from "../../../../herramientas/reutilizables/entidad-selector-base";

export default function PresentacionesSelector(props: {
  denominacionPresentacion: string;
  setDenominacionPresentacion: (v: string) => void;
  denominacionPresentacionRef: React.RefObject<HTMLInputElement>;
  selectPresentacionRef: React.RefObject<HTMLDivElement>;

  presentaciones: SelectPresentacion[];
  selectedPresentacion: SelectPresentacion | null;
  presentacionId: number;

  disabled?: boolean;
  error?: string;

  onEnterPresentacion: (e: React.KeyboardEvent) => void;
  onChangePresentacion: (p: SelectPresentacion | null) => void;
  onAgregarPresentacion: () => void;
}) {
  return (
    <EntidadSelectorBase<SelectPresentacion>
      titulo="Presentaciones"
      denominacion={props.denominacionPresentacion}
      setDenominacion={props.setDenominacionPresentacion}
      denominacionRef={props.denominacionPresentacionRef}
      opciones={props.presentaciones}
      selected={props.selectedPresentacion}
      selectedId={props.presentacionId}
      selectRef={props.selectPresentacionRef}
      disabled={props.disabled}
      error={props.error}
      onEnterInput={props.onEnterPresentacion}
      onChange={props.onChangePresentacion}
      onAgregar={props.onAgregarPresentacion}
    />
  );
}
