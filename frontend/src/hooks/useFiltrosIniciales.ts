import { FILTROS_INICIALES, TipoModuloFiltro } from "../config/filtros-iniciales";

export const useFiltrosIniciales = (componente: TipoModuloFiltro) => {
  return FILTROS_INICIALES[componente];
};