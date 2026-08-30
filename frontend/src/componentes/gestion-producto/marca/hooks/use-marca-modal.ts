import { useState } from "react";
import { Marca } from "../../../../interfaces/gestion-producto/marca/interfaces-marca";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";

export type MarcaModalTipo = "alta" | "edicion" | "auditoria" | null;

export function useMarcaModal() {
  const [tipo, setTipo] = useState<MarcaModalTipo>(null);
  const [marca, setMarca] = useState<Marca | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  const abrirAlta = () => {
    setMarca(null);
    setAuditoria(null);
    setTipo("alta");
  };

  const abrirEdicion = (marca: Marca) => {
    setMarca(marca);
    setAuditoria(null);
    setTipo("edicion");
  };

  const abrirAuditoria = (auditoria: Auditoria) => {
    setAuditoria(auditoria);
    setMarca(null);
    setTipo("auditoria");
  };

  const cerrar = () => {
    setTipo(null);
    setMarca(null);
    setAuditoria(null);
  };

  return {
    tipo,
    marca,
    auditoria,
    abrirAlta,
    abrirEdicion,
    abrirAuditoria,
    cerrar,
  };
}
