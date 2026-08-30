import { ForbiddenException } from "@nestjs/common";

export interface SistemaEntity {
  sistema?: number;
}

export function ensureNotSistemaEntity(entity: SistemaEntity, entityName: string) {
  if (entity.sistema === 1) {
    throw new ForbiddenException(`${entityName} marcado como del sistema y no puede ser modificado o eliminado`);
  }
}