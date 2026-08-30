export function isValidFilter(value: any, excludeValue?: any): boolean {
  // Rechazar null, undefined
  if (value === null || value === undefined) {
    return false;
  }
  
  // Si es string, rechazar si está vacío o solo espacios
  if (typeof value === 'string' && value.trim() === '') {
    return false;
  }
  
  // Rechazar valor específico si se proporciona
  if (excludeValue !== undefined && value === excludeValue) {
    return false;
  }
  
  return true;
}