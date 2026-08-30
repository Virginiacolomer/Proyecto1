import { useState } from "react";

type ModalProveedor = "crear" | "editar" | "movimientos" | "auditoria" | null;

export function useProveedorModales() {
  const [modalActivo, setModalActivo] = useState<ModalProveedor>(null);

  const abrirCrear = () => setModalActivo("crear");
  const abrirEditar = () => setModalActivo("editar");
  const abrirMovimientos = () => setModalActivo("movimientos");
  const abrirAuditoria = () => setModalActivo("auditoria");
  const cerrar = () => setModalActivo(null);

  return {
    modalActivo,
    abrirCrear,
    abrirEditar,
    abrirMovimientos,
    abrirAuditoria,
    cerrar,
  };
}
