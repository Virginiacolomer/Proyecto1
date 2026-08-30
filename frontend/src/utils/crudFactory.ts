import UsuarioService from "../componentes/gestion-usuario/usuario-service";
import ApiService from "./apiService";

const obtenerUsuarioId = async (id: number) => {
    const usuario = await UsuarioService.obtenerUsuarioId(id);
    if (!usuario) throw new Error("No se encontró el usuario");
    return usuario;
  };

export const createCrudService = <T>(baseEndpoint: string) => ({

  nuevo: (payload: T) => ApiService.post(`/${baseEndpoint}`, payload),

  actualizar: (id: number,payload: T) => ApiService.put(`/${baseEndpoint}/${id}`, payload),

  obtenerId: (id: number, empresaId?: number) => ApiService.get(`/${baseEndpoint}/${id}`, {empresaId}),

  obtener: (filtros: any) => {
    return ApiService.get(`/${baseEndpoint}/search-by`, filtros);
  },

  imprimirTodo: () => {
    return ApiService.imprimir(`/${baseEndpoint}/imprimir-listado-todo`);
  },


  imprimirPagina: () => {
    return ApiService.imprimir(`/${baseEndpoint}/imprimir-listado-pagina`);
  },

  obtenerRapido: (filtros: any) => {
    return ApiService.get(`/${baseEndpoint}/search-by-rapido`, filtros);
  },

  obtenerDesde: (filtros: any, entidades:string) => {
    return ApiService.get(`/${baseEndpoint}/search-${entidades}-by`, filtros);
  },

  obtenerRapidoDesde: (filtros: any, entidades:string) => {
    return ApiService.get(`/${baseEndpoint}/search-${entidades}-by-rapido`, filtros);
  },

  obtenerTotales: (filtros:any, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}/select`, filtros),

  obtenerTotalesSinSistema: (filtros:any, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}-sin-sistema/select`, filtros),

  obtenerTotalesSistema: (filtros:any, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}-sistema/select`, filtros),

  obtenerTotalesPara: (id:number, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}-for/${id}/select`),

  obtenerTotalesSinFacturarPara: (id:number, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}-sin-facturar-for/${id}/select`),

  obtenerTotalesSinPedidoPara: (id:number, entidades:string) => ApiService.get(`/${baseEndpoint}/find-all-for-${entidades}-sin-pedido-for/${id}/select`),

  obtenerItemsPara: (id:number, entidad:string) => ApiService.get(`/${baseEndpoint}/find-all-items-for-${entidad}-for/${id}`),
  
  obtenerIdEntidad: (id:number, entidad:string) => ApiService.get(`/${baseEndpoint}/${entidad}/${id}`),

  eliminar: (id: number, usuarioId:number) => ApiService.delete(`/${baseEndpoint}/${id}`,usuarioId),

  obtenerAuditoria: (id: number) => ApiService.get(`/${baseEndpoint}/${id}/audit`),

  obtenerUsuarioId,
});
