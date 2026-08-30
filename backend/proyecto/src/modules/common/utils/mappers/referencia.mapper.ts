export interface ReferenciaDto {
  id: number;
  denominacion: string;
}

export function toReferenciaDto<T extends { id: number; denominacion: string }>(
  entity?: T,
): ReferenciaDto {
  if (!entity) {
    throw new Error('Entidad nula al mapear ReferenciaDto');
  }
  return {
    id: entity.id,
    denominacion: entity.denominacion,
  };
}


export function toReferenciaDtoOrEmpty<T extends { id: number; denominacion: string }>(
  entity?: T | null
): ReferenciaDto {
  return entity ? toReferenciaDto(entity) : EMPTY_REFERENCIA;
}

const EMPTY_REFERENCIA: ReferenciaDto = {
  id: 0,
  denominacion: ""
};