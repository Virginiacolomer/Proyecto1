// utils/parseApiError.ts
export function parseApiError(error: any): string {
  const responseData = error?.response?.data;

  if (!responseData) return "Ocurrió un error inesperado.";

  if (typeof responseData === "string") return responseData;

  if (typeof responseData.message === "string") return responseData.message;

  if (Array.isArray(responseData.message)) {
    return responseData.message.join(", ");
  }

  // ✅ NUEVO: Caso donde `message` es un objeto con campo `message`
  if (
    typeof responseData.message === "object" &&
    "message" in responseData.message
  ) {
    return String(responseData.message.message);
  }

  return "Ocurrió un error inesperado.";
}
