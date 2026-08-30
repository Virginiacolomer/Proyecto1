export const sumarMontos = (montoNuevo: number, total: number): number => {
  const totalFinal = total + montoNuevo;

  return totalFinal;
};

export const restarMontos = (montoNuevo: number, total: number): number => {
  const totalFinal = total - montoNuevo;

  return totalFinal;
};

export const calcularSubtotal = (cantidad: number, precioSinIva: number): number => {
  const subtotalFinal = cantidad * precioSinIva;

  return subtotalFinal;
};

export const calcularImporteTotal = (cantidad: number, precioConIva: number): number => {
  const importeTotalFinal = cantidad * precioConIva;

  return importeTotalFinal;
};
