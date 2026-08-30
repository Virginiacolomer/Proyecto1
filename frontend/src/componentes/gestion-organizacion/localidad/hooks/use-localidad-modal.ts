import { useState } from "react";
import { Localidad } from "../../../../interfaces/gestion-organizacion/localidad/interfaces-localidad";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";

export type LocalidadModalTipo = "alta" | "edicion" | "auditoria" | null;

export function useLocalidadModal() {
  const [tipo, setTipo] = useState<LocalidadModalTipo>(null);
  const [localidad, setLocalidad] = useState<Localidad | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  const abrirAlta = () => {
    setLocalidad(null);
    setAuditoria(null);
    setTipo("alta");
  };

  const abrirEdicion = (localidad: Localidad) => {
    setLocalidad(localidad);
    setAuditoria(null);
    setTipo("edicion");
  };

  const abrirAuditoria = (auditoria: Auditoria) => {
    setAuditoria(auditoria);
    setLocalidad(null);
    setTipo("auditoria");
  };

  const cerrar = () => {
    setTipo(null);
    setLocalidad(null);
    setAuditoria(null);
  };

  return {
    tipo,
    localidad,
    auditoria,
    abrirAlta,
    abrirEdicion,
    abrirAuditoria,
    cerrar,
  };
}
