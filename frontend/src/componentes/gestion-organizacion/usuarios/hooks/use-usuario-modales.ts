import { useState } from "react";

type ModalUsuario = "crear" | "editar" | "movimientos" | "auditoria" | null;

export function useUsuarioModales() {
  const [modalActivo, setModalActivo] = useState<ModalUsuario>(null);

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
