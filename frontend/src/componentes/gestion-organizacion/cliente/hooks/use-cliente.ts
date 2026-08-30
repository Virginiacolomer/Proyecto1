import { useState } from "react";
import ClienteService from "../services/cliente-service";
import { Cliente, ConsultarCliente } from "../../../../interfaces/gestion-organizacion/cliente/interfaces-cliente";
import { Auditoria, ResponsePost } from "../../../../interfaces/generales/interfaces-generales";

export function useClientes(empresaId: number, usuarioId: number) {
  const [clientes, setClientes] = useState<ConsultarCliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [auditoria, setAuditoria] = useState<Auditoria>({} as Auditoria);

  const buscar = async (params: any) => {
    const response = await ClienteService.obtener(params);
    setClientes(response.data);
    return response.total;
  };

  const obtenerPorId = async (id: number) => {
    const cliente = await ClienteService.obtenerId(id, empresaId);
    setClienteSeleccionado(cliente);
    return cliente;
  };

  const obtenerAuditoria = async (id: number) => {
    const datos = await ClienteService.obtenerAuditoria(id);
    setAuditoria(datos);
  };

  const eliminar = async (id: number) => {
    const response: ResponsePost = await ClienteService.eliminar(id, usuarioId);
    setClientes((prev) => prev.filter((c) => c.id !== id));
    return response.mensaje;
  };

  return {
    clientes,
    clienteSeleccionado,
    auditoria,
    buscar,
    obtenerPorId,
    obtenerAuditoria,
    eliminar,
    setClienteSeleccionado,
  };
}
