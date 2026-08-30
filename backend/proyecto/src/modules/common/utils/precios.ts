// utils/precio.util.ts

import { redondear5 } from "./number/redondeo";


/**
 * Calcula el divisor de IVA a partir del porcentaje
 * @param porcentajeIva - Porcentaje de IVA (ej: 21 para 21%)
 * @returns Divisor (ej: 1.21 para 21%)
 */
export const obtenerDivisorIva = (porcentajeIva: number): number => {
  return 1 + porcentajeIva / 100;
};

/**
 * Calcula el precio sin IVA y lo redondea
 * @param precioConIva - Precio con IVA incluido
 * @param porcentajeIva - Porcentaje de IVA
 * @returns Precio sin IVA redondeado
 */
export const calcularPrecioSinIva = (
  precioConIva: number,
  porcentajeIva: number,
): number => {
  const divisor = obtenerDivisorIva(porcentajeIva);
  return redondear5(precioConIva / divisor);
};

/**
 * Calcula el precio con IVA y lo redondea
 * @param precioSinIva - Precio sin IVA
 * @param porcentajeIva - Porcentaje de IVA
 * @returns Precio con IVA redondeado
 */
export const calcularPrecioConIva = (
  precioSinIva: number,
  porcentajeIva: number,
): number => {
  const multiplicador = obtenerDivisorIva(porcentajeIva);
  return redondear5(precioSinIva * multiplicador);
};