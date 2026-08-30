import { useState } from "react";
import { Cliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";

type ModalCliente = "crear" | "editar" | "movimientos" | "auditoria" | null;

export function useClienteModales() {
  const [modalActivo, setModalActivo] = useState<ModalCliente>(null);

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
