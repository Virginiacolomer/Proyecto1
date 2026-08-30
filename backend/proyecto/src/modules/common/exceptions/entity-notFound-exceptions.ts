import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string) {
    super(`${entityName}, no existe o fue eliminada`, HttpStatus.NOT_FOUND);
  }
}