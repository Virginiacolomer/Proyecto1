import { useState } from "react";
import { Personal } from "../../../../interfaces/gestion-organizacion/personal/interfaces-personal";
import { Auditoria } from "../../../../interfaces/generales/interfaces-generales";

export type PersonalModalTipo = "alta" | "edicion" | "auditoria" | null;

export function usePersonalModal() {
  const [tipo, setTipo] = useState<PersonalModalTipo>(null);
  const [personal, setPersonal] = useState<Personal | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  const abrirAlta = () => {
    setPersonal(null);
    setAuditoria(null);
    setTipo("alta");
  };

  const abrirEdicion = (personal: Personal) => {
    setPersonal(personal);
    setAuditoria(null);
    setTipo("edicion");
  };

  const abrirAuditoria = (auditoria: Auditoria) => {
    setAuditoria(auditoria);
    setPersonal(null);
    setTipo("auditoria");
  };

  const cerrar = () => {
    setTipo(null);
    setPersonal(null);
    setAuditoria(null);
  };

  return {
    tipo,
    personal,
    auditoria,
    abrirAlta,
    abrirEdicion,
    abrirAuditoria,
    cerrar,
  };
}
