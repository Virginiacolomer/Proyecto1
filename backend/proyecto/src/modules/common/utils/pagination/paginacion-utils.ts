

export const PaginacionUtils = {
  totalPaginas(totalRegistros: number, cantidadPorPagina: number): number {
    const total = Math.ceil(totalRegistros / cantidadPorPagina);
    return total;
  },

  totalItems(totalRegistros: number): number {
    return totalRegistros;
  },
};
