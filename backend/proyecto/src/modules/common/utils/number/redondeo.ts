
/**
 * Redondea un número a 2 decimales
 */
export const redondear2 = (valor: number): number => {
  return Math.round(valor * 100) / 100;
};

/**
 * Redondea un número a 3 decimales
 */
export const redondear3 = (valor: number): number => {
  return Math.round(valor * 1000) / 1000;
};

/**
 * Redondea un número a 5 decimales
 */
export const redondear5 = (valor: number): number => {
  return Math.round(valor * 100000) / 100000;
};


/**
 * Redondea un número a N decimales con corrección de floating point.
 * @param valor - Número a redondear
 * @param decimales - Cantidad de decimales (default: 2)
 */
export const redondear = (valor: number, decimales =2): number => {
  const factor = 10 ** decimales; // Más idiomático que Math.pow
  return Math.round((valor + Number.EPSILON) * factor) / factor;
};
