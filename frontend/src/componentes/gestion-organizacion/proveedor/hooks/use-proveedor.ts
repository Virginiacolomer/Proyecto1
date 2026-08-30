import { useState } from "react";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";
import { ConsultarProveedor, Proveedor } from "../../../../interfaces/gestion-organizacion/proveedor/interfaces-proveedor";
import ProveedorService from "../services/proveedor-service";

export function useProveedores(empresaId: number, usuarioId: number) {
  const [proveedores, setProveedores] = useState<ConsultarProveedor[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<Proveedor | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria>({} as Auditoria);

  const buscar = async (params: any) => {
    const response = await ProveedorService.obtener(params);
    setProveedores(response.data);
    return response.total;
  };

  const obtenerPorId = async (id: number) => {
    const cliente = await ProveedorService.obtenerId(id, empresaId);
    setProveedorSeleccionado(cliente);
    return cliente;
  };

  const obtenerAuditoria = async (id: number) => {
    const datos = await ProveedorService.obtenerAuditoria(id);
    setAuditoria(datos);
  };

  const eliminar = async (id: number) => {
    const response: ResponsePost = await ProveedorService.eliminar(id, usuarioId);
    setProveedores((prev) => prev.filter((c) => c.id !== id));
    return response.mensaje;
  };

  return {
    proveedores,
    proveedorSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setProveedorSeleccionado,
  };
}
