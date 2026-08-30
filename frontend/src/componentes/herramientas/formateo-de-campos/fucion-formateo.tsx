export const formatPrice = (value: number | string, currency?: "ARS" | "USD"): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  const formattedValue = numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Agregar el símbolo según la moneda seleccionada
  if (currency === "ARS") return `$ ${formattedValue}`;
  if (currency === "USD") return `US$ ${formattedValue}`;

  return formattedValue; // Si no se especifica moneda, se devuelve sin símbolo
};

export const formatPercentage = (value: number | string): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  return `${numberValue.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} %`;
};

export const formatCantidades = (value: number | string): string => {
  if (value === null || value === undefined) return "";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numberValue)) return "";

  // Solo separa los miles, sin decimales
  return numberValue.toLocaleString("es-AR");
};

export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "No tiene";

  const soloFecha = dateString.split("T")[0];
  const [year, month, day] = soloFecha.split("-");
  if (!year || !month || !day) return "Fecha inválida";

  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
};

export const formatFechaHora = (dateString: string | null | undefined) => {
  if (!dateString) return "No tiene";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida";

  const dia = date.getDate().toString().padStart(2, "0");
  const mes = (date.getMonth() + 1).toString().padStart(2, "0");
  const anio = date.getFullYear();
  const hora = date.getHours().toString().padStart(2, "0");
  const minutos = date.getMinutes().toString().padStart(2, "0");

  return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
};