import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class DatabaseConnectionException extends HttpException {
  private readonly logger = new Logger(DatabaseConnectionException.name);
  

constructor(error: any) {
  // Normalizá el error primero, antes de llamar super
  let message = 'Error inesperado en la base de datos.';
  let status = HttpStatus.INTERNAL_SERVER_ERROR;

  // Extraé el mensaje sin importar si error es string, Error, o QueryFailedError
  const errorMessage: string =
    typeof error === 'string'
      ? error
      : error?.message ?? '';

  if (error instanceof QueryFailedError) {
    const sqlErrorCode = (error as any).code;

    if (process.env.DB_TYPE === 'mysql') {
      switch (sqlErrorCode) {
        case 'ER_DUP_ENTRY':
          message = 'Error: El valor ingresado ya existe y debe ser único.';
          status = HttpStatus.CONFLICT;
          break;
        // ... resto de casos
        default:
          message = `Error en MySQL: ${errorMessage}`;
      }
    } else if (process.env.DB_TYPE === 'postgres') {
      switch (sqlErrorCode) {
        case '23505':
          message = 'Error: El valor ingresado ya existe y debe ser único.';
          status = HttpStatus.CONFLICT;
          break;
        // ... resto de casos
        default:
          message = `Error en PostgreSQL: ${errorMessage}`;
      }
    }
  } else if (errorMessage.includes('ECONNREFUSED')) {
    message = 'Error: No se pudo conectar con la base de datos.';
  }

  super(message, status); // ← solo UNA vez, al final, con los valores correctos
}
  
}
