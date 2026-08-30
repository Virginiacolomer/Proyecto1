import { useState } from "react";
import { Linea } from "../../../../interfaces/gestion-producto/linea/interfaces-linea";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";

export type LineaModalTipo = "alta" | "edicion" | "auditoria" | null;

export function useLineaModal() {
  const [tipo, setTipo] = useState<LineaModalTipo>(null);
  const [linea, setLinea] = useState<Linea | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  const abrirAlta = () => {
    setLinea(null);
    setAuditoria(null);
    setTipo("alta");
  };

  const abrirEdicion = (linea: Linea) => {
    setLinea(linea);
    setAuditoria(null);
    setTipo("edicion");
  };

  const abrirAuditoria = (auditoria: Auditoria) => {
    setAuditoria(auditoria);
    setLinea(null);
    setTipo("auditoria");
  };

  const cerrar = () => {
    setTipo(null);
    setLinea(null);
    setAuditoria(null);
  };

  return {
    tipo,
    linea,
    auditoria,
    abrirAlta,
    abrirEdicion,
    abrirAuditoria,
    cerrar,
  };
}
