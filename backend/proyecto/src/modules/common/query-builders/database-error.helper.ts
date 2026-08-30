// database-error.helper.ts

import { HttpException, NotFoundException } from "@nestjs/common";
import { EntityNotFoundException } from "../exceptions/entity-notFound-exceptions";
import { EntityNotFoundError, QueryFailedError, TypeORMError } from "typeorm";
import { DatabaseConnectionException } from "../exceptions/database-connection.exception";


// ── Excepciones de dominio que no se deben envolver ───────────
const DOMAIN_EXCEPTIONS = [
  EntityNotFoundException,
  HttpException,
  // agregá acá cualquier otra excepción propia
];

interface DbError {
  message?: string;
  code?: string;
  sqlMessage?: string;
  sql?: string;
  stack?: string;
  parameters?: unknown[];
  driverError?: unknown;
}

type Logger = { error: (msg: unknown, ...args: unknown[]) => void };

interface HandleDatabaseErrorOptions {
  rethrowNotFound?: boolean;
  context?: string;
}

export function handleDatabaseError(
  logger: Logger,
  methodName: string,
  error: unknown,
  options?: HandleDatabaseErrorOptions,
): never {

  // ── 1. Deja pasar excepciones de dominio / HTTP ───────────────
  for (const ExceptionClass of DOMAIN_EXCEPTIONS) {
    if (error instanceof ExceptionClass) throw error;
  }

  const err = error instanceof Error ? error : new Error(String(error));

  // ── 2. Log base ───────────────────────────────────────────────
  const prefix = options?.context
    ? `[${methodName}][${options.context}]`
    : `[${methodName}]`;

  logger.error(`${prefix} ${err.message}`, err.stack);

  // ── 3. Log específico por tipo ────────────────────────────────
  if (error instanceof QueryFailedError) {
    const q = error as QueryFailedError & DbError;
    logger.error(
      `${prefix} QueryFailedError:`,
      JSON.stringify({ code: q.code, sqlMessage: q.sqlMessage, sql: q.sql,
                       parameters: q.parameters, driverError: q.driverError }, null, 2),
    );
    throw new DatabaseConnectionException(`Error en operación de base de datos: ${err.message}`);

  } else if (error instanceof EntityNotFoundError) {
    logger.error(`${prefix} EntityNotFoundError: ${err.message}`);
    if (options?.rethrowNotFound) throw new NotFoundException(err.message);
    throw new DatabaseConnectionException(err.message);

  } else if (error instanceof TypeORMError) {
    logger.error(`${prefix} TypeORMError: ${err.message}`, err.stack);
    throw new DatabaseConnectionException(err.message);

  } else {
    logger.error(`${prefix} Error inesperado:`,
      JSON.stringify({ name: err.name, message: err.message, stack: err.stack }, null, 2));
    throw new DatabaseConnectionException('Error al conectar con la base de datos.');
  }
}


export function handleDatabaseErrorOld(
  logger: { error: (msg: string, ...args: unknown[]) => void },
  methodName: string,
  error: unknown,
): never {

  // ── 1. Deja pasar excepciones de dominio / HTTP ───────────────
  for (const ExceptionClass of DOMAIN_EXCEPTIONS) {
    if (error instanceof ExceptionClass) throw error;
  }

  const err = error instanceof Error ? error : new Error(String(error));
  const dbError = error as DbError;

  // ── 2. Log base siempre presente ──────────────────────────────
  logger.error(`[${methodName}] ${err.message}`, err.stack);

  // ── 3. Log específico según el tipo de error TypeORM ─────────
  if (error instanceof QueryFailedError) {
    logger.error(
      `[${methodName}] QueryFailedError:`,
      JSON.stringify(
        {
          message: dbError.message,
          code: dbError.code,
          sqlMessage: dbError.sqlMessage,
          sql: dbError.sql,
          parameters: dbError.parameters,
          driverError: dbError.driverError,
        },
        null,
        2,
      ),
    );
  } else if (error instanceof EntityNotFoundError) {
    // TypeORM lanza este cuando usás findOneOrFail
    logger.error(`[${methodName}] EntityNotFoundError: ${err.message}`);
  } else if (error instanceof TypeORMError) {
    logger.error(`[${methodName}] TypeORMError: ${err.message}`, err.stack);
  } else {
    // Error inesperado no relacionado con TypeORM
    logger.error(
      `[${methodName}] Error inesperado:`,
      JSON.stringify(
        {
          name: err.name,
          message: err.message,
          stack: err.stack,
        },
        null,
        2,
      ),
    );
  }

  throw new DatabaseConnectionException('Error al conectar con la base de datos.');
}