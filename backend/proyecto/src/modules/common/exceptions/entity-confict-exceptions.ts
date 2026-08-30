import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityConflictException extends HttpException {
  constructor(entityName: string) {
    super(`Conflicto con la entidad ${entityName}`, HttpStatus.CONFLICT);
  }
}