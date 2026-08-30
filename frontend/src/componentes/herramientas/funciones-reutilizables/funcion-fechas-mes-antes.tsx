// Función para obtener la fecha actual en formato YYYY-MM-DD
export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// Función para obtener la fecha un mes atrás desde hoy
export const getOneMonthAgoDate = (): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split("T")[0];
};

export function getFechaLocalActual(): string {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset()); // Ajuste para obtener fecha local real
  return hoy.toISOString().split("T")[0];
}

// Función para obtener la fecha dos meses a futuro desde hoy
export function getTwoMonthsFutureDate(): string {
  const fecha = new Date();
  fecha.setMonth(fecha.getMonth() + 2); // Sumar dos meses
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset()); // Ajuste para zona local
  return fecha.toISOString().split("T")[0];
}
