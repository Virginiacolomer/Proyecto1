import { useState } from "react";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { ConsultarUsuario } from "../../../../interfaces/gestion-organizacion/usuario/interfaces-usuario";
import { Usuario } from "../../../../interfaces/gestion-usuario/interfaces-usuario";
import UsuarioService from "../services/usuario-service";

export function useUsuarios(empresaId: number, usuarioId: number) {
  const [usuarios, setUsuarios] = useState<ConsultarUsuario[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria>({} as Auditoria);

  const buscar = async (params: any) => {
    const response = await UsuarioService.obtener(params);
    setUsuarios(response.data);
    return response.total;
  };

  const obtenerPorId = async (id: number) => {
    const usuario = await UsuarioService.obtenerId(id, empresaId);
    setUsuarioSeleccionado(usuario);
    return usuario;
  };

  const obtenerAuditoria = async (id: number) => {
    const datos = await UsuarioService.obtenerAuditoria(id);
    setAuditoria(datos);
  };

  const eliminar = async (id: number) => {
    const response: ResponsePost = await UsuarioService.eliminar(id, usuarioId);
    setUsuarios((prev) => prev.filter((c) => c.id !== id));
    return response.mensaje;
  };

  return {
    usuarios,
    usuarioSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setUsuarioSeleccionado,
  };
}
