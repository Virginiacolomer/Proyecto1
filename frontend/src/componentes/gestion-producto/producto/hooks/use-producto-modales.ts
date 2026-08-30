import { useState } from "react";

type ModalKey =
  | "alta"
  | "actualizar"
  | "auditoria"
  | "movimientos"
  | "historial"
  | "cambioPrecios"
  | "alternativos"
  | "deQuienEs";

export function useProductoModales() {
  const [abiertos, setAbiertos] = useState<Record<ModalKey, boolean>>({
    alta: false,
    actualizar: false,
    auditoria: false,
    movimientos: false,
    historial: false,
    cambioPrecios: false,
    alternativos: false,
    deQuienEs: false,
  });

  const abrir = (modal: ModalKey) =>
    setAbiertos(prev => ({ ...prev, [modal]: true }));

  const cerrar = (modal: ModalKey) =>
    setAbiertos(prev => ({ ...prev, [modal]: false }));

  const cerrarTodos = () =>
    setAbiertos({
      alta: false,
      actualizar: false,
      auditoria: false,
      movimientos: false,
      historial: false,
      cambioPrecios: false,
      alternativos: false,
      deQuienEs: false,
    });

  return { abiertos, abrir, cerrar, cerrarTodos };
}
