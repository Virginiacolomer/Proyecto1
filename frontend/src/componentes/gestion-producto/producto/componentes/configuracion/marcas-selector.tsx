import { SelectMarca } from "../../../../../interfaces/gestion-producto/marca/interfaces-marca";
import EntidadSelectorBase from "../../../../herramientas/reutilizables/entidad-selector-base";


export default function MarcasSelector(props: {
  denominacionMarca: string;
  setDenominacionMarca: (v: string) => void;
  denominacionMarcaRef: React.RefObject<HTMLInputElement>;
  selectMarcaRef: React.RefObject<HTMLDivElement>;
  marcas: SelectMarca[];
  selectedMarca: SelectMarca | null;
  marcaId: number;
  disabled?: boolean;
  error?: string;
  onEnterMarca: (e: React.KeyboardEvent) => void;
  onChangeMarca: (m: SelectMarca | null) => void;
  onAgregarMarca: () => void;
}) {
  return (
    <EntidadSelectorBase<SelectMarca>
      titulo="Marcas"
      denominacion={props.denominacionMarca}
      setDenominacion={props.setDenominacionMarca}
      denominacionRef={props.denominacionMarcaRef}
      opciones={props.marcas}
      selected={props.selectedMarca}
      selectedId={props.marcaId}
      selectRef={props.selectMarcaRef}
      disabled={props.disabled}
      error={props.error}
      onEnterInput={props.onEnterMarca}
      onChange={props.onChangeMarca}
      onAgregar={props.onAgregarMarca}
    />
  );
}
